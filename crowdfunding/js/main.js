/* VinceMedia Innovation Lab — crowdfunding index renderer
   Data source: ../data/projects.json (single source of truth). */
(function () {
  const $ = (id) => document.getElementById(id);
  const fmtMoney = (n) => '$' + Number(n).toLocaleString('en-US');
  const dispPledged = (n) => { if (n >= 1000000) return '$' + Math.floor(n / 1000000) + 'M+'; if (n >= 100000) return '$' + Math.floor(n / 100000) * 100 + 'k+'; if (n >= 1000) return '$' + Math.floor(n / 1000) + 'k+'; return '$' + n; };
  const dispBackers = (n) => { if (n >= 1000) return (Math.floor(n / 1000) * 1000).toLocaleString('en-US') + '+'; if (n >= 100) return (Math.floor(n / 100) * 100).toLocaleString('en-US') + '+'; return '' + n; };
  const dispPct = (pc) => { if (pc >= 1000) return Math.floor(pc / 1000) * 1000 + '%+'; return pc + '%'; };

  let DATA = null;
  let filter = 'all';

  function endTs(p) { return p.endDate ? new Date(p.endDate).getTime() : null; }
  function isLive(p) { return p.type === 'crowdfunding' && p.status === 'live' && (!endTs(p) || endTs(p) > Date.now()); }
  function isLatePledge(p) { return p.type === 'crowdfunding' && p.status === 'late-pledge'; }
  function isEnded(p) { return p.type === 'crowdfunding' && !isLatePledge(p) && endTs(p) !== null && endTs(p) <= Date.now(); }
  function isReady(p) { return p.type === 'shopify'; }
  function pct(p) { return p.goal && p.pledged ? Math.min(999, Math.round((p.pledged / p.goal) * 100)) : null; }
  function daysLeft(p) { const t = endTs(p); if (!t) return null; return Math.max(0, Math.ceil((t - Date.now()) / 86400000)); }

  function badge(p) {
    if (p.isHero) return '<span class="badge-pill" style="background:#a3e635;color:#09090b;">Vince Pick</span>';
    if (isReady(p)) return '<span class="badge-pill" style="border:1px solid #22d3ee;color:#22d3ee;">Ready to Ship</span>';
    if (isEnded(p)) return '<span class="badge-pill" style="border:1px solid #71717a;color:#a1a1aa;">Campaign Ended</span>';
    const pc = pct(p);
    if (pc !== null && pc >= 100) return '<span class="badge-pill" style="border:1px solid #f59e0b;color:#fbbf24;">' + dispPct(pc) + ' Funded</span>';
    return '<span class="badge-pill" style="border:1px solid #52525b;color:#a1a1aa;">Fresh Launch</span>';
  }

  function countdownText(p) {
    if (isLatePledge(p)) return '<span style="color:#a3e635;">Funded &middot; Late pledges open</span>';
    const d = daysLeft(p);
    if (p.type === 'crowdfunding') return d !== null && d > 0 ? '<span style="color:#fbbf24;">' + d + (d === 1 ? ' day' : ' days') + ' left</span>' : '<span style="color:#71717a;">ended</span>';
    return '';
  }

  function card(p) {
    const pc = pct(p);
    const hero = p.isHero;
    const progress = (pc !== null && !isReady(p)) ? (pc >= 100 ? 100 : pc) + '%' : null;
    return '<a class="proj-card" href="projects/' + p.slug + '.html">' +
      '<div class="relative" style="aspect-ratio:16/9;overflow:hidden;background:#18181b;">' +
        (p.image ? '<img src="' + p.image + '" alt="' + p.name + '" class="w-full h-full object-cover" onerror="this.style.display=\'none\'">' : '') +
      '</div>' +
      '<div class="p-4 flex flex-col gap-2">' +
        '<div class="flex items-center justify-between gap-2">' + badge(p) + countdownText(p) + '</div>' +
        '<div class="text-[15px] font-bold text-zinc-100 leading-snug truncate">' + p.name + '</div>' +
        '<div class="text-xs text-zinc-500 leading-relaxed line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + p.tagline + '</div>' +
        (isReady(p)
          ? '<div class="flex items-center gap-2 text-xs text-zinc-400 pt-1"><span style="color:#22d3ee;"><i class="fas fa-box-open"></i> In Stock &amp; Guaranteed</span><span class="ml-auto text-zinc-500">Store price</span></div>'
          : '<div class="pt-1">' +
              (progress ? '<div class="h-1.5 rounded-full bg-zinc-800 overflow-hidden"><div class="h-full rounded-full" style="width:' + progress + ';background:#a3e635;"></div></div>' : '') +
              '<div class="flex items-center justify-between text-xs pt-1.5">' +
                '<span class="text-zinc-400 font-semibold">' + (pc !== null ? dispPct(pc) + ' Funded' : '') + '</span>' +
                '<span class="text-zinc-500">' + dispPledged(p.pledged) + ' · ' + dispBackers(p.backers) + ' backers' + (p.type === 'crowdfunding' && !isLatePledge(p) ? ' · and counting' : '') + '</span>' +
              '</div>' +
            '</div>') +
        '<div class="pt-2 mt-auto"><span class="ghost-btn w-full justify-center text-xs" style="padding:7px 12px;">' + (isReady(p) ? 'View Deal <i class="fas fa-arrow-right"></i>' : 'Explore Campaign <i class="fas fa-arrow-right"></i>') + '</span></div>' +
      '</div></a>';
  }

  function heroCard(p) {
    const pc = pct(p);
    return '<div class="proj-card overflow-hidden" style="background:linear-gradient(120deg, rgba(163,227,53,0.05), rgba(9,9,11,0) 45%);">' +
      '<div class="grid grid-cols-1 lg:grid-cols-2 gap-0">' +
        '<div class="bg-zinc-800 overflow-hidden">' +
          (p.image ? '<img src="' + p.image + '" alt="' + p.name + '" class="w-full h-56 sm:h-72 lg:h-full object-cover" onerror="this.style.display=\'none\'">' : '<div class="h-56 sm:h-72 lg:h-full"></div>') +
        '</div>' +
        '<div class="p-6 sm:p-8 flex flex-col justify-center gap-3">' +
          '<div class="flex items-center gap-2 flex-wrap">' + badge(p) +
            '<span class="badge-pill" style="border:1px solid #52525b;color:#a1a1aa;"><i class="fas fa-robot"></i> Robotics</span>' +
          '</div>' +
          '<h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-50 leading-tight">' + p.name + '</h1>' +
          '<p class="text-sm text-zinc-400 leading-relaxed">' + p.blurb + '</p>' +
          (p.type === 'crowdfunding' && !isLatePledge(p) ? '<p class="text-[11px] text-zinc-500"><i class="fas fa-arrow-trend-up"></i> campaign figures shown are lower bounds — they only go up.</p>' : '') +
          '<div class="flex flex-wrap gap-x-6 gap-y-2 text-xs pt-1">' +
            '<div><div class="text-zinc-600">pledged</div><div class="font-bold text-zinc-100 text-sm">' + dispPledged(p.pledged) + '</div></div>' +
            '<div><div class="text-zinc-600">backers</div><div class="font-bold text-zinc-100 text-sm">' + dispBackers(p.backers) + '</div></div>' +
            '<div><div class="text-zinc-600">updates</div><div class="font-bold text-zinc-100 text-sm">' + p.updates + '</div></div>' +
            '<div><div class="text-zinc-600">campaign ends</div><div class="font-bold" style="color:#fbbf24;font-size:0.85rem;" id="heroCountdown">…</div></div>' +
          '</div>' +
          '<div class="pt-2 flex items-center gap-3 flex-wrap">' +
            '<a class="ghost-btn ghost-accent" href="projects/beni.html"><i class="fas fa-search"></i> Read the full audit</a>' +
          '</div>' +
        '</div>' +
      '</div></div>';
  }

  function render() {
    const hero = DATA.projects.find((p) => p.isHero) || DATA.projects[0];
    $('heroSection').innerHTML = heroCard(hero);

    const counts = {
      all: DATA.projects.length,
      crowdfunding: DATA.projects.filter((p) => isLive(p) || isLatePledge(p)).length,
      ready: DATA.projects.filter(isReady).length,
    };
    const tabs = [
      ['all', 'All (' + counts.all + ')'],
      ['crowdfunding', 'Live & Funded Campaigns (' + counts.crowdfunding + ')'],
      ['ready', 'Ready to Ship (' + counts.ready + ')'],
    ];
    $('filterBar').innerHTML = tabs.map(([k, label]) =>
      '<button class="view-tab' + (filter === k ? ' active' : '') + '" data-f="' + k + '" onclick="window.__cfFilter(\'' + k + '\')">' + label + '</button>'
    ).join('');

    const shown = DATA.projects.filter((p) => {
      if (filter === 'crowdfunding') return isLive(p) || isLatePledge(p);
      if (filter === 'ready') return isReady(p);
      return true;
    });
    // hero 项目在网格中保留一张普通卡
    $('projGrid').innerHTML = shown.map(card).join('');
    if (!shown.length) $('projGrid').innerHTML = '<p class="text-zinc-600 text-sm col-span-3">nothing here yet.</p>';

    // hero 倒计时
    const cd = $('heroCountdown');
    if (cd) {
      const t = endTs(hero);
      const tick = () => {
        if (!t) { cd.innerHTML = 'Ended'; return; }
        const diff = t - Date.now();
        if (diff <= 0) { cd.innerHTML = 'Ended'; return; }
        const d = Math.max(0, Math.ceil(diff / 86400000));
        const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
        cd.innerHTML = d + 'd ' + h + 'h';
      };
      tick();
      setInterval(tick, 60000);
    }
  }

  fetch('data/projects.json?v=20260903')
    .then((r) => r.json())
    .then((d) => { DATA = d; render(); })
    .catch((e) => { console.error('projects.json load failed', e); });

  window.__cfFilter = (f) => { filter = f; render(); };
})();
