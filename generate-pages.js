#!/usr/bin/env node
/**
 * BackTheNew – Product Page Generator
 * ====================================
 * Generates individual SEO-optimized HTML landing pages for each product
 * in data/products.json, saved to products/<slug>.html
 *
 * Usage:
 *   node generate-pages.js           # Generate all product pages
 *   node generate-pages.js --id noxti  # Generate one product page
 *
 * Run after update.js to create pages for newly added products.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const PRODUCTS_FILE = path.join(ROOT, 'data', 'products.json');
const PRODUCTS_DIR = path.join(ROOT, 'products');
const BASE_URL = 'https://affiliate-vince.github.io';

const targetId = (() => {
  const idx = process.argv.indexOf('--id');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

function log(emoji, msg) { console.log(`${emoji}  ${msg}`); }

// ─── HTML Template ─────────────────────────────────────────────

function buildProductPage(p) {
  const imageHtml = p.imageUrl
    ? `<img class="hero-img" src="${p.imageUrl}" alt="${p.name} – ${p.tagline}" width="800" height="450" loading="eager" />`
    : `<div class="hero-img-placeholder">${getCategoryIcon(p.category)}</div>`;

  const tagsHtml = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const fundBadge = p.fundingPercent
    ? `<div class="fund-badge">🔥 ${p.fundingPercent.toLocaleString()}% Funded on Kickstarter</div>`
    : '';

  const schemaProduct = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.name,
    "description": p.description,
    "url": `${BASE_URL}/products/${p.slug}.html`,
    "image": p.imageUrl || '',
    "brand": { "@type": "Brand", "name": p.name },
    "offers": {
      "@type": "Offer",
      "url": p.affiliateUrl,
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "seller": { "@type": "Organization", "name": "Kickstarter" }
    }
  });

  const schemaBreadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": p.category, "item": `${BASE_URL}/?cat=${p.category}` },
      { "@type": "ListItem", "position": 3, "name": p.name, "item": `${BASE_URL}/products/${p.slug}.html` }
    ]
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${p.seoTitle}</title>
  <meta name="description" content="${p.seoDescription}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${BASE_URL}/products/${p.slug}.html" />

  <!-- Open Graph -->
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${p.seoTitle}" />
  <meta property="og:description" content="${p.seoDescription}" />
  <meta property="og:url" content="${BASE_URL}/products/${p.slug}.html" />
  <meta property="og:image" content="${p.imageUrl || ''}" />
  <meta property="og:site_name" content="BackTheNew" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.seoTitle}" />
  <meta name="twitter:description" content="${p.seoDescription}" />
  <meta name="twitter:image" content="${p.imageUrl || ''}" />

  <!-- Schema.org -->
  <script type="application/ld+json">${schemaProduct}</script>
  <script type="application/ld+json">${schemaBreadcrumb}</script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --green: #1DB954; --green-dark: #17a348; --green-light: #e8f8ee;
      --dark: #111827; --gray-700: #374151; --gray-500: #6b7280;
      --gray-300: #d1d5db; --gray-100: #f3f4f6; --white: #ffffff;
      --accent: #f59e0b; --radius: 12px;
      --shadow: 0 4px 24px rgba(0,0,0,.08);
      --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { font-family: var(--font); background: var(--gray-100); color: var(--dark); line-height: 1.6; }

    nav {
      background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--gray-300); padding: 0 24px;
      position: sticky; top: 0; z-index: 100;
    }
    .nav-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; height: 60px; gap: 16px; }
    .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 800; font-size: 1.1rem; color: var(--dark); }
    .logo-icon { width: 30px; height: 30px; background: var(--green); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
    .nav-back { margin-left: auto; color: var(--gray-500); text-decoration: none; font-size: .9rem; display: flex; align-items: center; gap: 6px; }
    .nav-back:hover { color: var(--green); }

    .breadcrumb { max-width: 1100px; margin: 0 auto; padding: 16px 24px 0; font-size: .85rem; color: var(--gray-500); }
    .breadcrumb a { color: var(--green); text-decoration: none; }
    .breadcrumb span { margin: 0 6px; }

    .product-hero { background: var(--white); border-bottom: 1px solid var(--gray-300); padding: 40px 24px; }
    .hero-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    .hero-img { width: 100%; border-radius: var(--radius); object-fit: cover; display: block; aspect-ratio: 16/9; }
    .hero-img-placeholder { width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, var(--gray-100), var(--gray-300)); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 4rem; }
    .hero-info { display: flex; flex-direction: column; gap: 16px; }
    .hero-category { display: inline-flex; align-items: center; gap: 6px; background: var(--green-light); color: var(--green-dark); padding: 5px 14px; border-radius: 50px; font-size: .8rem; font-weight: 600; width: fit-content; }
    .hero-name { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; line-height: 1.15; letter-spacing: -.02em; }
    .hero-tagline { font-size: 1.125rem; color: var(--gray-700); }
    .hero-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag { display: inline-block; padding: 4px 12px; background: var(--gray-100); color: var(--gray-700); border-radius: 50px; font-size: .78rem; font-weight: 500; }
    .fund-badge { display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; color: #b45309; padding: 8px 16px; border-radius: 50px; font-size: .85rem; font-weight: 700; width: fit-content; }
    .hero-highlight { background: var(--green-light); color: var(--green-dark); padding: 10px 18px; border-radius: 10px; font-weight: 600; font-size: .95rem; width: fit-content; }

    .cta-block { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
    .cta-primary { display: block; padding: 16px 32px; background: var(--green); color: var(--white); text-align: center; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 1.05rem; transition: background .2s, transform .1s; }
    .cta-primary:hover { background: var(--green-dark); transform: translateY(-1px); }
    .cta-notice { font-size: .78rem; color: var(--gray-500); text-align: center; }

    .product-body { max-width: 1100px; margin: 0 auto; padding: 48px 24px; display: grid; grid-template-columns: 2fr 1fr; gap: 40px; align-items: start; }
    .product-content h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: 16px; margin-top: 32px; }
    .product-content h2:first-child { margin-top: 0; }
    .product-content p { color: var(--gray-700); margin-bottom: 16px; line-height: 1.75; }

    .sidebar { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 16px; }
    .sidebar-card { background: var(--white); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); }
    .sidebar-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 16px; }
    .sidebar-cta { display: block; padding: 14px 24px; background: var(--green); color: var(--white); text-align: center; text-decoration: none; border-radius: 10px; font-weight: 700; transition: background .2s; }
    .sidebar-cta:hover { background: var(--green-dark); }
    .sidebar-meta { display: flex; flex-direction: column; gap: 10px; }
    .meta-row { display: flex; justify-content: space-between; font-size: .875rem; }
    .meta-row .key { color: var(--gray-500); }
    .meta-row .val { font-weight: 600; }
    .affiliate-note { font-size: .75rem; color: var(--gray-500); line-height: 1.5; padding: 12px 16px; background: var(--gray-100); border-radius: 8px; }

    footer { background: var(--dark); color: rgba(255,255,255,.6); padding: 32px 24px; margin-top: 48px; }
    .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; font-size: .85rem; }
    .footer-inner a { color: var(--green); text-decoration: none; }

    @media (max-width: 768px) {
      .hero-inner { grid-template-columns: 1fr; }
      .product-body { grid-template-columns: 1fr; }
      .sidebar { position: static; }
    }
  </style>
</head>
<body>

<nav>
  <div class="nav-inner">
    <a href="/" class="logo"><span class="logo-icon">🚀</span> BackTheNew</a>
    <a href="/" class="nav-back">← All Products</a>
  </div>
</nav>

<div class="breadcrumb" aria-label="Breadcrumb">
  <a href="/">Home</a>
  <span>›</span>
  <a href="/?cat=${p.category}">${p.category}</a>
  <span>›</span>
  <span>${p.name}</span>
</div>

<section class="product-hero">
  <div class="hero-inner">
    <div>
      ${imageHtml}
    </div>
    <div class="hero-info">
      <span class="hero-category">${getCategoryIcon(p.category)} ${p.category}</span>
      <h1 class="hero-name">${p.name}</h1>
      <p class="hero-tagline">${p.tagline}</p>
      <div class="hero-tags">${tagsHtml}</div>
      ${fundBadge}
      ${p.highlight ? `<div class="hero-highlight">✨ ${p.highlight}</div>` : ''}
      <div class="cta-block">
        <a href="${p.affiliateUrl}" target="_blank" rel="noopener noreferrer nofollow" class="cta-primary">
          Back This Project on Kickstarter →
        </a>
        <p class="cta-notice">⚡ Campaign is live now · Affiliate link · Opens Kickstarter</p>
      </div>
    </div>
  </div>
</section>

<div class="product-body">
  <article class="product-content" itemscope itemtype="https://schema.org/Product">
    <meta itemprop="name" content="${p.name}" />
    <meta itemprop="description" content="${p.description}" />

    <h2>About ${p.name}</h2>
    <p itemprop="description">${p.description}</p>

    <h2>Why We're Backing This</h2>
    <p>
      Among the crowdfunding campaigns we follow, <strong>${p.name}</strong> stands out for pushing the boundaries of what's possible in the <strong>${p.category}</strong> space.
      ${p.fundingPercent ? `The community has clearly agreed — with ${p.fundingPercent.toLocaleString()}% funding on Kickstarter, this is one of the most-backed projects we've seen this year.` : 'The Kickstarter community is responding enthusiastically to this campaign.'}
    </p>
    <p>
      If you're looking for something innovative that solves a real problem — or simply want to support creators building tomorrow's products today — <strong>${p.name}</strong> is worth a serious look before the campaign ends.
    </p>

    <h2>How to Back This Project</h2>
    <p>
      Click the button below to visit the official Kickstarter campaign page. You'll be able to choose your reward tier, read full specs, watch the campaign video, and join thousands of other backers.
    </p>
    <a href="${p.affiliateUrl}" target="_blank" rel="noopener noreferrer nofollow" class="cta-primary" style="display:inline-block; margin-top: 8px;">
      Visit the Kickstarter Campaign →
    </a>

    <h2>Affiliate Disclosure</h2>
    <p style="font-size:.875rem; color: var(--gray-500);">
      BackTheNew uses affiliate links to earn a small commission when you back a project through our links. This is how we keep the site running and continue discovering the best crowdfunding projects for you. Your backing price is never affected.
    </p>
  </article>

  <aside class="sidebar">
    <div class="sidebar-card">
      <h3>Back This Project</h3>
      <a href="${p.affiliateUrl}" target="_blank" rel="noopener noreferrer nofollow" class="sidebar-cta">
        View on Kickstarter →
      </a>
      <br/>
      <div class="sidebar-meta" style="margin-top:16px">
        <div class="meta-row"><span class="key">Category</span><span class="val">${p.category}</span></div>
        <div class="meta-row"><span class="key">Status</span><span class="val" style="color:var(--green)">🟢 Live</span></div>
        ${p.fundingPercent ? `<div class="meta-row"><span class="key">Funded</span><span class="val" style="color:#b45309">🔥 ${p.fundingPercent.toLocaleString()}%</span></div>` : ''}
        <div class="meta-row"><span class="key">Platform</span><span class="val">Kickstarter</span></div>
      </div>
    </div>
    <div class="sidebar-card">
      <p class="affiliate-note">
        ⚠️ <strong>Affiliate Notice:</strong> The link above is an affiliate link. BackTheNew may earn a commission if you back this project. We only feature projects we genuinely find interesting and innovative.
      </p>
    </div>
  </aside>
</div>

<footer>
  <div class="footer-inner">
    <span>© 2026 <a href="/">BackTheNew</a> · Curated Kickstarter Picks</span>
    <span>Independent reviews · <a href="/#about">About Us</a></span>
  </div>
</footer>

</body>
</html>`;
}

function getCategoryIcon(cat) {
  const icons = {
    Photography: '📷', Tech: '💻', Outdoors: '🏕️', EDC: '🔧',
    Stationery: '📓', Audio: '🎵', Watches: '⌚', Music: '🎶',
    Health: '💪', Kitchen: '🍳', Mobility: '⚡', Home: '🌿', Tools: '🔩',
  };
  return icons[cat] || '📦';
}

// ─── Main ──────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    log('❌', 'data/products.json not found. Run update.js first.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  let products = data.products;

  if (targetId) {
    products = products.filter(p => p.id === targetId || p.slug === targetId);
    if (products.length === 0) {
      log('❌', `No product found with id/slug: ${targetId}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  let generated = 0;
  products.forEach(p => {
    const html = buildProductPage(p);
    const outFile = path.join(PRODUCTS_DIR, `${p.slug}.html`);
    fs.writeFileSync(outFile, html, 'utf8');
    log('✅', `Generated: products/${p.slug}.html`);
    generated++;
  });

  log('🎉', `Done! Generated ${generated} product page(s).`);
  log('💡', 'Commit and push to GitHub Pages to publish.');
}

main();
