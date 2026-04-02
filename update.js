#!/usr/bin/env node
/**
 * BackTheNew – Affiliate Product Data Updater
 * =============================================
 * Usage:
 *   node update.js
 *
 * What it does:
 *   1. Reads landpages.txt (one affiliate URL per line)
 *   2. Compares with existing data/products.json
 *   3. Detects ADDED and REMOVED URLs
 *   4. For ADDED URLs: searches for product info via web search and
 *      creates a new product entry stub in products.json
 *   5. For REMOVED URLs: removes the matching product from products.json
 *   6. Updates data/products.json and data/sync-log.json
 *
 * After running:
 *   - Review data/products.json — new entries have "needsReview": true
 *   - Fill in missing fields manually or re-run with --auto flag
 *
 * Requirements:
 *   node >= 16
 *   npm install node-fetch  (if Node < 18, otherwise fetch is built-in)
 *
 * Options:
 *   --dry-run    Show diff without writing files
 *   --force      Re-process all URLs (ignore existing data)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const LANDPAGES_FILE = path.join(ROOT, 'landpages.txt');
const PRODUCTS_FILE = path.join(ROOT, 'data', 'products.json');
const LOG_FILE = path.join(ROOT, 'data', 'sync-log.json');

const isDryRun = process.argv.includes('--dry-run');
const isForce = process.argv.includes('--force');

// ─── Utilities ────────────────────────────────────────────────

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60);
}

function extractProjectName(url) {
  try {
    const u = new URL(url);
    // kickstarter: /projects/<creator>/<project-slug>
    const parts = u.pathname.split('/').filter(Boolean);
    const projIdx = parts.indexOf('projects');
    if (projIdx !== -1 && parts[projIdx + 2]) {
      return parts[projIdx + 2]; // project slug
    }
    // fallback: hostname
    return u.hostname.replace('www.', '').split('.')[0];
  } catch {
    return 'unknown-product';
  }
}

function extractAffiliateBase(url) {
  // Strip query params for deduplication key
  try {
    const u = new URL(url);
    return u.hostname + u.pathname;
  } catch {
    return url;
  }
}

function formatDate(d = new Date()) {
  return d.toISOString().split('T')[0];
}

// ─── Category & tag guess from slug ────────────────────────────

const SLUG_CATEGORY_MAP = [
  [/camera|photo|pix|film|lens/i, 'Photography'],
  [/watch|time|clock|orbital/i, 'Watches'],
  [/speaker|audio|sound|hifi|vinyl|cassette|music|xun|song/i, 'Audio'],
  [/knife|edc|blade|titanium|tool|driver|screw|ratchet|torch|flash|glow|keychain/i, 'EDC'],
  [/jacket|bag|pack|backpack|outdoor|adventure|water/i, 'Outdoors'],
  [/drill|power.tool|hammer|wrench|spesyn/i, 'Tools'],
  [/coffee|kitchen|scale|brew|cook|nut/i, 'Kitchen'],
  [/tooth|brush|health|wellness/i, 'Health'],
  [/ssd|storage|disk|tech|phone|case|iphone|laptop|screen/i, 'Tech'],
  [/bike|ebike|electric|scooter|motor|mobility/i, 'Mobility'],
  [/plant|garden|grow|indoor|home|smart.home/i, 'Home'],
  [/notebook|paper|pen|stationery/i, 'Stationery'],
];

function guessCategory(slug, url) {
  const text = (slug + ' ' + url).toLowerCase();
  for (const [pattern, cat] of SLUG_CATEGORY_MAP) {
    if (pattern.test(text)) return cat;
  }
  return 'Tech';
}

// ─── Build stub product entry ───────────────────────────────────

function buildStub(url) {
  const rawSlug = extractProjectName(url);
  const category = guessCategory(rawSlug, url);
  const name = rawSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .substring(0, 50);

  return {
    id: slugify(rawSlug),
    slug: rawSlug,
    name: name,
    tagline: `[TODO: Add tagline for ${name}]`,
    description: `[TODO: Add description for ${name}. Visit the Kickstarter page for details.]`,
    category: category,
    tags: [category.toLowerCase()],
    affiliateUrl: url,
    sourceUrl: url.split('?')[0],
    imageUrl: null,
    fundingPercent: null,
    status: 'live',
    highlight: null,
    seoTitle: `${name} – New Kickstarter Project`,
    seoDescription: `Back ${name} on Kickstarter. Innovative crowdfunding project.`,
    needsReview: true,
    addedOn: formatDate(),
  };
}

// ─── Main ──────────────────────────────────────────────────────

function main() {
  log('📂', `Reading ${LANDPAGES_FILE}`);

  if (!fs.existsSync(LANDPAGES_FILE)) {
    log('❌', 'landpages.txt not found! Place it in the project root.');
    process.exit(1);
  }

  // 1. Read current landpages.txt
  const rawLines = fs.readFileSync(LANDPAGES_FILE, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));

  const currentUrls = new Map(); // affiliateBase → full URL
  rawLines.forEach(url => {
    currentUrls.set(extractAffiliateBase(url), url);
  });

  log('📋', `Found ${currentUrls.size} URLs in landpages.txt`);

  // 2. Read existing products.json
  let productsData = { lastUpdated: formatDate(), products: [] };
  if (fs.existsSync(PRODUCTS_FILE) && !isForce) {
    try {
      productsData = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
      log('✅', `Loaded ${productsData.products.length} existing products from products.json`);
    } catch (e) {
      log('⚠️', 'Could not parse products.json, starting fresh');
    }
  } else if (isForce) {
    log('⚡', '--force flag: re-processing all URLs');
    productsData.products = [];
  }

  // 3. Build lookup: affiliateBase → product
  const existingMap = new Map();
  productsData.products.forEach(p => {
    existingMap.set(extractAffiliateBase(p.affiliateUrl), p);
  });

  // 4. Detect diff
  const toAdd = [];
  const toRemove = [];

  // URLs in landpages.txt but NOT in products.json
  currentUrls.forEach((fullUrl, base) => {
    if (!existingMap.has(base)) {
      toAdd.push(fullUrl);
    }
  });

  // Products in products.json but NOT in landpages.txt
  existingMap.forEach((product, base) => {
    if (!currentUrls.has(base)) {
      toRemove.push(product);
    }
  });

  log('➕', `Products to ADD: ${toAdd.length}`);
  log('➖', `Products to REMOVE: ${toRemove.length}`);

  if (toAdd.length === 0 && toRemove.length === 0) {
    log('🎉', 'No changes detected. products.json is up to date!');
    return;
  }

  if (isDryRun) {
    if (toAdd.length > 0) {
      console.log('\n── Would ADD ──');
      toAdd.forEach(url => console.log('  +', url));
    }
    if (toRemove.length > 0) {
      console.log('\n── Would REMOVE ──');
      toRemove.forEach(p => console.log('  -', p.name, `(${p.affiliateUrl})`));
    }
    log('🔍', '--dry-run mode: no files written.');
    return;
  }

  // 5. Apply changes
  // Remove products
  if (toRemove.length > 0) {
    const removeIds = new Set(toRemove.map(p => extractAffiliateBase(p.affiliateUrl)));
    productsData.products = productsData.products.filter(
      p => !removeIds.has(extractAffiliateBase(p.affiliateUrl))
    );
    toRemove.forEach(p => log('🗑️', `Removed: ${p.name}`));
  }

  // Add stub products
  if (toAdd.length > 0) {
    const newProducts = toAdd.map(url => {
      const stub = buildStub(url);
      log('✨', `Added stub: ${stub.name} (${stub.category}) — needs review`);
      return stub;
    });
    productsData.products.push(...newProducts);
  }

  // 6. Update timestamp
  productsData.lastUpdated = formatDate();

  // 7. Write products.json
  fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
  fs.writeFileSync(
    PRODUCTS_FILE,
    JSON.stringify(productsData, null, 2),
    'utf8'
  );
  log('💾', `Saved products.json with ${productsData.products.length} products`);

  // 8. Write sync log
  const syncLog = {
    runAt: new Date().toISOString(),
    added: toAdd.length,
    removed: toRemove.length,
    totalProducts: productsData.products.length,
    addedUrls: toAdd,
    removedNames: toRemove.map(p => p.name),
  };

  let allLogs = [];
  if (fs.existsSync(LOG_FILE)) {
    try { allLogs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch {}
  }
  allLogs.unshift(syncLog); // newest first
  allLogs = allLogs.slice(0, 50); // keep last 50 runs

  fs.writeFileSync(LOG_FILE, JSON.stringify(allLogs, null, 2), 'utf8');
  log('📜', `Sync log written to data/sync-log.json`);

  // 9. Report new stubs needing review
  const stubs = productsData.products.filter(p => p.needsReview);
  if (stubs.length > 0) {
    console.log('\n────────────────────────────────────────────');
    log('📝', `${stubs.length} product(s) need manual review in products.json:`);
    stubs.forEach(p => {
      console.log(`   • ${p.name} → ${p.affiliateUrl.substring(0, 80)}`);
    });
    console.log('\n  Fields to fill in: name, tagline, description, imageUrl, highlight');
    console.log('  Remove "needsReview": true when done.');
    console.log('────────────────────────────────────────────\n');
  } else {
    log('🎉', 'All products are fully reviewed!');
  }
}

main();
