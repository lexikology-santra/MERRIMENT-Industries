/* Merriment Industries — views and routing.
   Routes are plain hash tokens: #products, #products-pulses, #product-kabuli-chickpeas, #logistics-documents … */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const MONTHS_LONG = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catOf = (id) => CATEGORIES.find((c) => c.id === id);
  const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  /* ---------- Icons ---------- */
  const I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    seal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.4 1.8 3-.2.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.2L12 21l-2.4-1.8-3 .2-.9-2.9-2.4-1.8 1-2.8-1-2.8 2.4-1.8.9-2.9 3 .2z"/><path d="M9 12l2 2 4-4"/></svg>',
    lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M7.5 15h9"/></svg>',
    ship: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l2 4h14l2-4H3z"/><path d="M5 17V9h14v8M9 9V5h6v4"/></svg>',
    farm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V11l7-5 7 5v10"/><path d="M10 21v-6h4v6"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l8-8"/></svg>',
    water: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.5c2.6.2 4.3 2 5 4.5"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/></svg>'
  };
  const CAT_ICON = {
    grains: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 22V9"/><path d="M12 9c-2.5-.5-4-2.5-4-5 2.5.5 4 2.5 4 5zM12 9c2.5-.5 4-2.5 4-5-2.5.5-4 2.5-4 5z"/><path d="M12 14c-2.5-.5-4-2.5-4-5 2.5.5 4 2.5 4 5zM12 14c2.5-.5 4-2.5 4-5-2.5.5-4 2.5-4 5z"/><path d="M12 19c-2.5-.5-4-2.5-4-5 2.5.5 4 2.5 4 5zM12 19c2.5-.5 4-2.5 4-5-2.5.5-4 2.5-4 5z"/></svg>',
    pulses: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><ellipse cx="8" cy="9" rx="4" ry="3"/><ellipse cx="16" cy="11" rx="4" ry="3"/><ellipse cx="10" cy="16" rx="4" ry="3"/></svg>',
    spices: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M14 5c0-1.5 1-2.5 2.5-2.5"/><path d="M14 5c3 0 5 2.5 4 6-1.2 4.5-5 9-11 10.5C9 17 10 13 10.5 9 11 6.5 12 5 14 5z"/></svg>',
    oilseeds: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3c3 3 4.5 6 4.5 9S15 18 12 21c-3-3-4.5-6-4.5-9S9 6 12 3z"/><path d="M12 7v10"/></svg>',
    fresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 7c-1-2-3-3-5-2.5"/><path d="M12 7c-3-2-8-1-8 5 0 5 3.5 9 6 9 1 0 1.5-.5 2-.5s1 .5 2 .5c2.5 0 6-4 6-9 0-6-5-7-8-5z"/></svg>',
    beverage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h13v5a6 6 0 01-6 6h-1a6 6 0 01-6-6z"/><path d="M17 11h1.5a2.5 2.5 0 010 5H16M8 3c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4"/></svg>'
  };

  /* ---------- Storage (enquiry list) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  let enquiry = store.get("mi-enquiry", {}); // { productId: qtyMT }
  Object.keys(enquiry).forEach((k) => { if (!byId(k)) delete enquiry[k]; });
  const saveEnquiry = () => { store.set("mi-enquiry", enquiry); updateBasket(); };
  function updateBasket() {
    const n = Object.keys(enquiry).length;
    const el = $("#basketCount");
    el.textContent = n; el.hidden = n === 0;
    $(".basket").setAttribute("aria-label", `Enquiry list, ${n} product${n === 1 ? "" : "s"}`);
  }
  function toggleEnquiry(id) {
    const p = byId(id);
    if (enquiry[id] !== undefined) { delete enquiry[id]; toast(`Removed ${p.name} from your enquiry`); }
    else { enquiry[id] = ""; toast(`Added ${p.name} to your enquiry`, true); }
    saveEnquiry();
    $$(`[data-add="${id}"]`).forEach(syncAddBtn);
  }
  function syncAddBtn(b) {
    const on = enquiry[b.dataset.add] !== undefined;
    b.setAttribute("aria-pressed", on);
    b.innerHTML = on ? `${I.check} In enquiry` : `${I.plus} Add to enquiry`;
  }

  function toast(msg, withLink) {
    const t = $("#toast");
    t.innerHTML = `<span>${esc(msg)}</span>${withLink ? '<a href="#contact">View enquiry</a>' : ""}`;
    t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2800);
  }

  /* ---------- Shared fragments ---------- */
  const chip = (status) => { const s = STATUS[status]; return `<span class="chip chip-${s.tone}">${s.label}</span>`; };
  const phero = (crumb, eyebrow, title, text, extra = "") => `
    <section class="phero"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span aria-hidden="true">/</span>${crumb}</nav>
      <h1>${title}</h1>
      ${text ? `<p>${text}</p>` : ""}
      ${extra}
    </div></section>`;
  const secHead = (eyebrow, title, text) => `
    <div class="sec-head"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>${text ? `<p>${text}</p>` : ""}</div>`;
  const ctaBand = (title = "Planning next season's purchases?", text = "Send us your product, quantity and destination port. The trade desk replies with an indicative offer within one working day.") => `
    <section class="cta"><div class="wrap">
      <div><h2>${title}</h2><p>${text}</p></div>
      <div class="cta-actions"><a class="btn btn-white" href="#contact">Request a quote</a><a class="btn btn-outline" href="#contact-catalogue">Request catalogue</a></div>
    </div></section>`;
  const calRow = (p) => `<tr><td><a href="#product-${p.id}">${esc(p.name)}</a></td>${p.avail.map((v, i) => `<td class="m"><span class="cell cell-${v}" title="${MONTHS_LONG[i]}: ${["Not offered", "Available", "New crop / peak"][v]}"></span></td>`).join("")}</tr>`;
  const calTable = (list) => `
    <div class="tbl-wrap"><table class="tbl cal">
      <thead><tr><th>Product</th>${MONTHS_LONG.map((m) => `<th class="m">${m}</th>`).join("")}</tr></thead>
      <tbody>${list.map(calRow).join("")}</tbody>
    </table></div>
    <div class="legend"><span><i style="background:var(--primary)"></i>New crop / peak</span><span><i style="background:color-mix(in srgb,var(--secondary) 35%,transparent)"></i>Available from stock</span><span><i class="l0"></i>Not offered</span></div>`;

  /* ---------- Views ---------- */
  const views = {};

  views.home = () => {
    const offers = OFFERS.map((o) => {
      const p = byId(o.p);
      return `<tr data-href="#product-${p.id}" tabindex="0">
        <td><b>${esc(p.name)}</b><small>${o.lot}</small></td>
        <td>${esc(p.variant)}</td>
        <td class="r num">${o.qty.toLocaleString("en")}</td>
        <td>${o.ship}<small style="display:block">${o.inc}</small></td>
      </tr>`;
    }).join("");
    const cats = CATEGORIES.map((c) => {
      const n = PRODUCTS.filter((p) => p.cat === c.id).length;
      return `<a class="cat" href="#products-${c.id}">
        <div class="cat-top"><span class="glyph">${CAT_ICON[c.id]}</span><span class="cat-code">${c.code}</span></div>
        <h3>${c.name}</h3><p>${c.blurb}</p>
        <div class="cat-foot"><span>${n} product lines</span><span class="cat-go">${I.arrow}</span></div>
      </a>`;
    }).join("");
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    return `
    <section class="hero"><div class="wrap">
      <div class="hero-copy">
        <span class="eyebrow">Agricultural import &amp; export · Est. 2008</span>
        <h1>Agricultural commodities, <em>contracted and shipped</em> to specification.</h1>
        <p>Merriment Industries sources grains, pulses, spices, oilseeds, fresh produce, tea and coffee from audited farms, processes them in our own facilities and delivers to importers, distributors and food manufacturers in 42 countries.</p>
        <div class="hero-cta">
          <a class="btn btn-light" href="#products">Browse the catalogue ${I.arrow}</a>
          <a class="btn btn-ghost-deep" href="#contact">Talk to the trade desk</a>
        </div>
        <div class="hero-facts">
          <div><b class="num">180,000</b><span>MT shipped a year</span></div>
          <div><b class="num">42</b><span>export markets</span></div>
          <div><b class="num">1,200+</b><span>partner farms</span></div>
          <div><b class="num">2008</b><span>trading since</span></div>
        </div>
      </div>
      <div class="offer" aria-labelledby="offerTitle">
        <div class="offer-head">
          <div><h2 id="offerTitle">Current offer sheet</h2><small>Indicative lots open for contract</small></div>
          <span class="offer-date"><span class="live-dot" aria-hidden="true"></span>Updated ${today}</span>
        </div>
        <div class="offer-scroll"><table>
          <thead><tr><th>Commodity · Lot</th><th>Grade</th><th class="r">Qty (MT)</th><th>Shipment</th></tr></thead>
          <tbody>${offers}</tbody>
        </table></div>
        <div class="offer-foot"><span>Prices on request. Subject to prior sale and final confirmation.</span><a class="link" href="#contact">Request prices ${I.arrow}</a></div>
      </div>
    </div></section>

    <section class="trust" aria-label="Certifications"><div class="wrap">
      <p class="trust-label">Certified facilities and registered exporter</p>
      <div class="trust-list">
        ${["ISO 22000", "FSSC 22000", "BRCGS AA", "HACCP", "GlobalG.A.P.", "USDA Organic", "Halal", "Kosher", "FDA Reg."].map((c) => `<span class="seal"><i>${I.check.replace('stroke-width="2"', 'stroke-width="3" width="12" height="12"')}</i>${c}</span>`).join("")}
      </div>
    </div></section>

    <section class="sec"><div class="wrap">
      ${secHead("Product portfolio", "Six commodity divisions, one accountable supplier.", "Every line is graded, lab-tested and packed to the destination market's standards. Specifications, packing and HS codes are listed for each product.")}
      <div class="cats">${cats}</div>
      <div style="margin-top:28px;display:flex;gap:16px;flex-wrap:wrap;align-items:center">
        <a class="btn btn-primary" href="#products">View all ${PRODUCTS.length} products</a>
        <a class="link" href="#products-calendar">See the crop calendar ${I.arrow}</a>
      </div>
    </div></section>

    <section class="band" aria-label="Company figures"><div class="wrap">
      <div class="stat"><b class="num">6</b><span>Indian loading ports, from Mundra to Kolkata</span></div>
      <div class="stat"><b class="num">400+</b><span>pesticide residues screened on every lot</span></div>
      <div class="stat"><b class="num">99.2%</b><span>of 2025 shipments accepted without claim</span></div>
      <div class="stat"><b class="num">24 h</b><span>trade desk response on quotations</span></div>
    </div></section>

    <section class="sec"><div class="wrap">
      ${secHead("Why buyers work with us", "Built for importers who cannot afford a rejected container.", "")}
      <div class="pillars">
        <div class="pillar"><span class="mono">01 · Origin</span><h3>Direct sourcing</h3><p>We buy from 1,200+ audited farms and farmer producer organisations, not through layers of brokers.</p></div>
        <div class="pillar"><span class="mono">02 · Process</span><h3>Own processing</h3><p>Cleaning, Sortex colour sorting, steam sterilisation and packing in our Indore and Mundra units.</p></div>
        <div class="pillar"><span class="mono">03 · Proof</span><h3>Tested every lot</h3><p>Residues, aflatoxin, ETO and microbiology tested before loading. The report ships with the documents.</p></div>
        <div class="pillar"><span class="mono">04 · Delivery</span><h3>One trade desk</h3><p>Contracts, freight, documentation and claims handled by a single named account manager.</p></div>
      </div>
    </div></section>

    <section class="sec sec-alt"><div class="wrap">
      ${secHead("How an order moves", "From enquiry to discharge port in five steps.", "Typical lead time for stocked lines is two to three weeks from receipt of the letter of credit or advance.")}
      <div class="process">
        ${[["Enquiry", "Share product, specification, quantity, packing and destination port.", "Day 0"],
           ["Offer & samples", "Indicative price and pre-shipment samples by courier.", "Day 1–7"],
           ["Contract", "Sales contract and proforma invoice; LC or advance received.", "Day 7–10"],
           ["Inspection & loading", "Lab testing, optional SGS / BV inspection, container stuffing.", "Day 10–20"],
           ["Shipment & documents", "Bill of lading, phyto, COO and COA sent through banks or courier.", "Day 20+"]]
          .map((s, i) => `<div class="pstep"><div class="pstep-n"><b>${String(i + 1).padStart(2, "0")}</b><i></i></div><h3>${s[0]}</h3><p>${s[1]}</p><small>${s[2]}</small></div>`).join("")}
      </div>
    </div></section>

    <section class="sec"><div class="wrap split split-60">
      <div>
        <span class="eyebrow">Global markets</span>
        <h2>Where our containers go.</h2>
        <p class="lede">Share of export volume by destination region, financial year 2025–26. Sales offices in Dubai, Rotterdam and Singapore support buyers in their own time zone.</p>
        <div class="regions" style="margin-top:28px">
          ${[["Middle East", "UAE, Saudi Arabia, Oman, Kuwait, Qatar", 36], ["Europe & UK", "Netherlands, UK, Germany, Belgium, Spain", 24], ["South-East Asia", "Malaysia, Singapore, Vietnam, Indonesia", 18], ["Africa", "Nigeria, Kenya, South Africa, Egypt", 13], ["Americas & others", "USA, Canada, Australia", 9]]
            .map((r) => `<div class="region"><div><b>${r[0]}</b><small>${r[1]}</small></div><div class="meter" role="img" aria-label="${r[2]} percent"><span style="width:${(r[2] / 36) * 100}%"></span></div><span class="pct">${r[2]}%</span></div>`).join("")}
        </div>
      </div>
      <div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>Trade lane</th><th class="r">Transit (days)</th></tr></thead>
            <tbody>${LANES.slice(0, 7).map((l) => `<tr><td>${l[0]} → <b>${l[1]}</b></td><td class="r mono">${l[2]}</td></tr>`).join("")}</tbody>
          </table>
        </div>
        <p style="margin-top:12px;font-size:13px;color:var(--fg-muted)">Indicative port-to-port transit, direct and transhipment services. <a class="link" href="#logistics">Logistics and Incoterms ${I.arrow}</a></p>
      </div>
    </div></section>

    <section class="sec sec-alt"><div class="wrap">
      ${secHead("Client references", "What procurement teams say.", "")}
      <div class="quotes">
        <figure class="quote"><blockquote>“Merriment's lots arrive exactly as graded. Our rejection rate on kabuli chickpeas is close to zero since we moved our volume to them.”</blockquote><cite><b>Head of Procurement</b>Food distributor, Dubai, UAE</cite></figure>
        <figure class="quote"><blockquote>“The residue and ETO reports come with every shipment of cumin and sesame. That alone saves our QA team a week per container.”</blockquote><cite><b>Quality Manager</b>Spice packer, Rotterdam, Netherlands</cite></figure>
        <figure class="quote"><blockquote>“One account manager, clear documents and vessels that leave when they say. We now buy our full basmati programme through them.”</blockquote><cite><b>Category Buyer</b>Retail chain, Kuala Lumpur, Malaysia</cite></figure>
      </div>
    </div></section>

    <section class="sec"><div class="wrap">
      ${secHead("Market insights", "Crop reports and trade briefings.", "Written by our trade desk for buyers planning their purchases.")}
      <div class="posts">${INSIGHTS.slice(0, 3).map(postCard).join("")}</div>
      <div style="margin-top:24px"><a class="link" href="#insights">All insights ${I.arrow}</a></div>
    </div></section>
    ${ctaBand()}`;
  };

  function postCard(a) {
    return `<a class="post" href="#insights">
      <div class="post-meta"><span class="chip plain">${a.tag}</span><time datetime="${a.date}">${fmtDate(a.date)}</time></div>
      <h3>${esc(a.title)}</h3><p>${esc(a.sum)}</p>
    </a>`;
  }

  /* --- Catalogue --- */
  const catState = { cat: "all", q: "", view: store.get("mi-view", "grid"), status: "all" };

  views.products = (sub) => {
    if (sub && catOf(sub)) catState.cat = sub;
    else if (!sub) catState.cat = "all";
    const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, PRODUCTS.filter((p) => p.cat === c.id).length]));
    return `
    ${phero('<span>Products</span>', "", "Product catalogue", `${PRODUCTS.length} product lines across six divisions, with specifications, HS codes, packing and loading ports. Add products to an enquiry and request prices for all of them at once.`,
      `<div class="phero-meta"><div><b class="num">${PRODUCTS.length}</b><span>product lines</span></div><div><b class="num">6</b><span>commodity divisions</span></div><div><b class="num">${PRODUCTS.filter((p) => p.status === "new-crop").length}</b><span>new-crop offers</span></div></div>`)}
    <section class="sec-tight"><div class="wrap cat-layout">
      <aside class="filters" aria-label="Filters">
        <div><h3>Division</h3>
          <div class="fl" id="catFilter">
            <button data-cat="all">All products <span>${PRODUCTS.length}</span></button>
            ${CATEGORIES.map((c) => `<button data-cat="${c.id}">${c.name} <span>${counts[c.id]}</span></button>`).join("")}
          </div>
        </div>
        <div><h3>Availability</h3>
          <div class="fl" id="statusFilter">
            <button data-status="all">Any status</button>
            ${Object.entries(STATUS).map(([k, s]) => `<button data-status="${k}">${s.label}</button>`).join("")}
          </div>
        </div>
        <div class="fbox"><b>Need a custom specification?</b><span>We source to buyer specifications for grade, moisture, count and packing.</span><a class="link" href="#contact">Ask the trade desk ${I.arrow}</a></div>
      </aside>
      <div style="min-width:0">
        <div class="toolbar">
          <div class="search">${I.search}<label class="sr-only" for="q">Search products</label><input id="q" type="search" placeholder="Search by product, origin or HS code" value="${esc(catState.q)}" autocomplete="off"></div>
          <div class="seg" role="group" aria-label="Layout">
            <button data-view="grid" aria-label="Grid view">${I.grid}<span>Grid</span></button>
            <button data-view="table" aria-label="Table view">${I.list}<span>Table</span></button>
          </div>
        </div>
        <p class="result-meta" id="resultMeta" aria-live="polite"></p>
        <div id="results"></div>
      </div>
    </div></section>

    <section class="sec sec-alt" id="sec-calendar"><div class="wrap">
      ${secHead("Crop calendar", "When each product is available.", "Plan contracts around harvest. New-crop months usually offer the best quality and pricing; stocked lines ship year-round.")}
      <div id="calWrap">${calTable(PRODUCTS)}</div>
    </div></section>
    ${ctaBand("Can't find a product?", "We also trade dehydrated onion and garlic, jaggery, makhana, millets and frozen fruit on request. Tell us what you need.")}`;
  };

  function filteredProducts() {
    const q = catState.q.trim().toLowerCase();
    return PRODUCTS.filter((p) =>
      (catState.cat === "all" || p.cat === catState.cat) &&
      (catState.status === "all" || p.status === catState.status) &&
      (!q || [p.name, p.variant, p.origin, p.hs, catOf(p.cat).name].join(" ").toLowerCase().includes(q)));
  }
  function renderResults() {
    const list = filteredProducts();
    const res = $("#results"); if (!res) return;
    const catName = catState.cat === "all" ? "all divisions" : catOf(catState.cat).name;
    $("#resultMeta").textContent = `Showing ${list.length} of ${PRODUCTS.length} products in ${catName}`;
    $$("#catFilter button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === catState.cat));
    $$("#statusFilter button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.status === catState.status));
    $$(".seg button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.view === catState.view));
    if (!list.length) {
      res.innerHTML = `<div class="empty"><b>No products match these filters</b>Clear the search or choose another division. If you need something we don't list, <a class="link" href="#contact">ask the trade desk</a>.</div>`;
      return;
    }
    if (catState.view === "table") {
      res.innerHTML = `<div class="tbl-wrap"><table class="tbl ptable">
        <thead><tr><th>Product</th><th>Origin</th><th>HS code</th><th>MOQ</th><th>Status</th><th></th></tr></thead>
        <tbody>${list.map((p) => `<tr>
          <td><a href="#product-${p.id}">${esc(p.name)}</a><small>${esc(p.variant)}</small></td>
          <td>${esc(p.origin)}</td><td class="mono">${p.hs}</td><td>${esc(p.moq)}</td><td>${chip(p.status)}</td>
          <td class="r"><button class="btn btn-line btn-sm add-btn" data-add="${p.id}"></button></td></tr>`).join("")}</tbody>
      </table></div>`;
    } else {
      res.innerHTML = `<div class="pgrid">${list.map((p) => `
        <article class="pcard">
          <div class="pcard-top"><span class="glyph">${CAT_ICON[p.cat]}</span>${chip(p.status)}</div>
          <div class="pcard-body">
            <h3><a href="#product-${p.id}">${esc(p.name)}</a></h3>
            <p class="variant">${esc(p.variant)}</p>
            <dl class="kv">
              <dt>Origin</dt><dd>${esc(p.origin.split(",")[0])}</dd>
              <dt>HS code</dt><dd class="mono">${p.hs}</dd>
              <dt>MOQ</dt><dd>${esc(p.moq)}</dd>
              <dt>Loading</dt><dd>${esc(p.ports[0])}</dd>
            </dl>
          </div>
          <div class="pcard-foot"><a class="btn btn-line btn-sm" href="#product-${p.id}">Specifications</a><button class="btn btn-primary btn-sm add-btn" data-add="${p.id}"></button></div>
        </article>`).join("")}</div>`;
    }
    $$("[data-add]", res).forEach(syncAddBtn);
    const cal = $("#calWrap");
    if (cal) cal.innerHTML = calTable(catState.cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === catState.cat));
  }
  function bindProducts() {
    renderResults();
    $("#catFilter").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      catState.cat = b.dataset.cat;
      history.replaceState(null, "", b.dataset.cat === "all" ? "#products" : `#products-${b.dataset.cat}`);
      renderResults();
    });
    $("#statusFilter").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      catState.status = b.dataset.status; renderResults();
    });
    $(".seg").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      catState.view = b.dataset.view; store.set("mi-view", catState.view); renderResults();
    });
    $("#q").addEventListener("input", (e) => { catState.q = e.target.value; renderResults(); });
  }

  /* --- Product detail --- */
  views.product = (id) => {
    const p = byId(id);
    if (!p) return views.notfound();
    const c = catOf(p.cat);
    const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3);
    return `
    ${phero(`<a href="#products">Products</a><span aria-hidden="true">/</span><a href="#products-${c.id}">${c.name}</a><span aria-hidden="true">/</span><span>${esc(p.name)}</span>`, "", esc(p.name), esc(p.desc),
      `<div class="pd-hero-tags">${chip(p.status)}<span class="mono">HS ${p.hs}</span><span class="mono">${esc(p.variant)}</span><span class="mono">${esc(p.origin)}</span></div>`)}
    <section class="sec-tight"><div class="wrap pd">
      <div class="pd-main">
        <div>
          <h2>Typical specification</h2>
          <div class="tbl-wrap"><table class="tbl"><tbody>
            ${p.specs.map((s) => `<tr><td class="k">${esc(s[0])}</td><td>${esc(s[1])}</td></tr>`).join("")}
          </tbody></table></div>
          <p style="margin-top:10px;font-size:13px;color:var(--fg-muted)">Typical values. Final specification is confirmed in the sales contract and certificate of analysis. Custom grades available.</p>
        </div>
        <div>
          <h2>Availability by month</h2>
          <div class="months" role="img" aria-label="Availability calendar">
            ${p.avail.map((v, i) => `<div><span class="cell cell-${v}"></span>${MONTHS[i]}</div>`).join("")}
          </div>
          <div class="legend"><span><i style="background:var(--primary)"></i>New crop / peak</span><span><i style="background:color-mix(in srgb,var(--secondary) 35%,transparent)"></i>Available from stock</span><span><i class="l0"></i>Not offered</span></div>
        </div>
        <div class="split" style="gap:32px">
          <div><h2>Packing options</h2><ul class="checks" style="margin-top:0">${p.packing.map((x) => `<li>${I.check}<span>${esc(x)}</span></li>`).join("")}</ul></div>
          <div><h2>Certifications</h2><div class="taglist">${p.certs.map((x) => `<span>${esc(x)}</span>`).join("")}</div></div>
        </div>
        <div>
          <h2>Documents supplied</h2>
          <div class="taglist">${["Commercial invoice", "Packing list", "Bill of lading", "Certificate of origin", "Phytosanitary certificate", "Certificate of analysis"].concat(p.cat === "fresh" ? [] : ["Fumigation certificate"]).map((d) => `<span>${d}</span>`).join("")}</div>
        </div>
        ${related.length ? `<div><h2>Related products</h2><div class="related">${related.map((r) => `<a class="rel" href="#product-${r.id}"><b>${esc(r.name)}</b><small>${esc(r.variant)}</small></a>`).join("")}</div></div>` : ""}
      </div>
      <aside class="pd-side">
        <div class="panel">
          <h3>Trade summary</h3>
          <dl class="kv">
            <dt>Origin</dt><dd>${esc(p.origin)}</dd>
            <dt>HS code</dt><dd class="mono">${p.hs}</dd>
            <dt>Minimum order</dt><dd>${esc(p.moq)}</dd>
            <dt>Container load</dt><dd>${esc(p.fcl)}</dd>
            <dt>Loading ports</dt><dd>${p.ports.map(esc).join(", ")}</dd>
            <dt>Incoterms</dt><dd>FOB, CFR, CIF${p.cat === "fresh" ? "" : ", DAP"}</dd>
            <dt>Payment</dt><dd>LC at sight, CAD, T/T</dd>
          </dl>
          <div class="panel-cta">
            <button class="btn btn-primary add-btn" data-add="${p.id}"></button>
            <a class="btn btn-line" href="#contact">Request a quote now</a>
          </div>
          <p class="panel-note">Samples are sent free of charge to qualified buyers. The trade desk replies within one working day.</p>
        </div>
      </aside>
    </div></section>
    ${ctaBand(`Need ${esc(p.name.toLowerCase())} on a regular schedule?`, "Annual and seasonal supply contracts with fixed specifications, staggered shipments and price review windows.")}`;
  };

  /* --- Quality --- */
  views.quality = () => `
    ${phero("<span>Quality</span>", "", "Quality assurance and certifications", "Every lot is sampled, tested and documented before it is loaded. Our Indore laboratory works alongside NABL-accredited third-party labs and the inspection agency of your choice.",
      `<div class="phero-meta"><div><b class="num">12</b><span>certifications & registrations</span></div><div><b class="num">400+</b><span>residues screened</span></div><div><b class="num">100%</b><span>of lots tested before loading</span></div></div>`)}
    <section class="sec"><div class="wrap">
      ${secHead("Quality control", "Five checkpoints between the farm and the container.", "")}
      <div class="process">
        ${[["Supplier approval", "Farms and FPOs audited for practices, storage and traceability before the first purchase."],
           ["Intake testing", "Each arriving lot is sampled for moisture, foreign matter and grade. Lots that fail are returned."],
           ["Processing controls", "Cleaning, destoning, gravity separation, Sortex sorting and metal detection under HACCP."],
           ["Pre-shipment lab tests", "Residues, mycotoxins, ETO, microbiology and quality markers on the packed lot."],
           ["Loading supervision", "Container inspection, photo record of stuffing, seal numbers logged against the lot code."]]
          .map((s, i) => `<div class="pstep"><div class="pstep-n"><b>${String(i + 1).padStart(2, "0")}</b><i></i></div><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join("")}
      </div>
    </div></section>
    <section class="sec sec-alt"><div class="wrap split">
      <div>
        <span class="eyebrow">Laboratory</span>
        <h2>What we test, and how.</h2>
        <p class="lede">Our Indore laboratory runs physical, chemical and microbiological tests in-house. Residue and contaminant tests are confirmed by NABL-accredited laboratories, and the certificate of analysis travels with the shipping documents.</p>
        <ul class="checks">
          <li>${I.check}<span>Testing against EU Regulation 396/2005, US EPA tolerances and Codex MRLs</span></li>
          <li>${I.check}<span>Retained samples kept for 12 months for every shipped lot</span></li>
          <li>${I.check}<span>Third-party inspection by SGS, Bureau Veritas, Intertek or Cotecna on request</span></li>
        </ul>
      </div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Test group</th><th>Parameters</th></tr></thead>
        <tbody>${LAB_TESTS.map((t) => `<tr><td><b>${t[0]}</b></td><td>${t[1]}</td></tr>`).join("")}</tbody>
      </table></div>
    </div></section>
    <section class="sec"><div class="wrap">
      ${secHead("Certifications", "Certified facilities. Registered exporter.", "Certificate copies and numbers are available to buyers on request through the trade desk.")}
      <div class="cards">${CERTS.map((c) => `<div class="card cert"><span class="cert-seal">${I.seal}</span><div><h3>${c.name}</h3><p>${c.body}</p><small>${c.scope}</small></div></div>`).join("")}</div>
    </div></section>
    <section class="sec sec-alt"><div class="wrap">
      ${secHead("Traceability", "Every bag carries a lot code you can trace back to the farm cluster.", "")}
      ${lotBlock()}
    </div></section>
    ${ctaBand("Need our certificates for supplier approval?", "Our QA team sends certificate copies, the food safety policy and a completed supplier questionnaire within two working days.")}`;

  function lotBlock() {
    return `<div class="lot">
      <span class="eyebrow" style="color:var(--accent)">Lot code anatomy</span>
      <div class="lot-code" aria-label="Example lot code MI-PUL-26-1088-NSK-03"><span>MI</span><span class="sep">-</span><span>PUL</span><span class="sep">-</span><span>26</span><span class="sep">-</span><span>1088</span><span class="sep">-</span><span>NSK</span><span class="sep">-</span><span>03</span></div>
      <div class="lot-key">
        <div><b>MI</b>Merriment Industries</div>
        <div><b>PUL</b>Division (pulses)</div>
        <div><b>26</b>Crop year 2026</div>
        <div><b>1088</b>Processing batch number</div>
        <div><b>NSK</b>Origin cluster (Nashik)</div>
        <div><b>03</b>Container in the shipment</div>
      </div>
    </div>`;
  }

  /* --- Logistics --- */
  views.logistics = () => `
    ${phero("<span>Logistics &amp; trade terms</span>", "", "Logistics, Incoterms and payment terms", "We ship FCL, LCL, reefer and break-bulk from six Indian ports, and book freight, insurance and documentation in-house. Here is what to expect on every contract.",
      `<div class="phero-meta"><div><b class="num">6</b><span>loading ports</span></div><div><b class="num">4</b><span>Incoterms offered</span></div><div><b class="num">2–3 wks</b><span>contract to loading</span></div></div>`)}
    <section class="sec"><div class="wrap">
      ${secHead("Incoterms® 2020", "Who pays for what.", "S marks costs carried by Merriment as seller; B marks costs carried by the buyer. Risk transfer follows the published Incoterms rules.")}
      <div class="tbl-wrap"><table class="tbl" style="min-width:820px">
        <thead><tr><th>Term</th>${INCO_COLS.map((c) => `<th class="c">${c}</th>`).join("")}</tr></thead>
        <tbody>${INCOTERMS.map((t) => `<tr><td><b class="mono">${t.code}</b><br><span style="font-size:13.5px;color:var(--fg-muted)">${t.name}</span><p style="font-size:13px;color:var(--fg-muted);max-width:34ch;margin-top:4px">${t.note}</p></td>${t.r.map((x) => `<td class="c"><span class="resp resp-${x}" aria-label="${x === "S" ? "Seller" : "Buyer"}">${x}</span></td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>
    </div></section>
    <section class="sec sec-alt"><div class="wrap">
      ${secHead("Shipping options", "Containers, reefers and bulk.", "")}
      <div class="cards cards-4">
        ${[[I.box, "20′ dry container", "18–26 MT bagged, depending on product density. Standard for grains, pulses and spices."],
           [I.box, "40′ dry / high cube", "26–28 MT bagged. Used for lighter cargo such as chillies and tea."],
           [I.water, "40′ reefer", "Controlled atmosphere and temperature for onions, grapes, pomegranates and bananas."],
           [I.ship, "Break-bulk & vessel", "Parcels of 5,000 MT and above for parboiled rice, wheat and maize."]]
          .map((c) => `<div class="card"><span class="card-icon">${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p></div>`).join("")}
      </div>
    </div></section>
    <section class="sec" id="sec-documents"><div class="wrap">
      ${secHead("Export documentation", "Documents that travel with every shipment.", "Originals are sent through the nominated bank under LC or CAD terms, or by courier for advance-payment contracts. Scans are shared on the day of shipment.")}
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Document</th><th>What it covers</th><th>Applies to</th></tr></thead>
        <tbody>${DOCUMENTS.map((d) => `<tr><td><b>${d[0]}</b></td><td>${d[1]}</td><td style="white-space:nowrap">${d[2]}</td></tr>`).join("")}</tbody>
      </table></div>
    </div></section>
    <section class="sec sec-alt"><div class="wrap split">
      <div>
        <span class="eyebrow">Payment terms</span>
        <h2>Secure terms for both sides.</h2>
        <p class="lede">New buyers trade on confirmed letters of credit. Terms open up as the relationship builds, backed by trade credit insurance.</p>
        <div class="cards cards-2" style="margin-top:28px">${PAYMENT_TERMS.map((t) => `<div class="card"><span class="card-icon">${I.bank}</span><h3>${t[0]}</h3><p>${t[1]}</p></div>`).join("")}</div>
      </div>
      <div>
        <span class="eyebrow">Loading ports &amp; transit</span>
        <h2>Indicative transit times.</h2>
        <div class="tbl-wrap" style="margin-top:20px"><table class="tbl">
          <thead><tr><th>From</th><th>To</th><th class="r">Days</th></tr></thead>
          <tbody>${LANES.map((l) => `<tr><td>${l[0]}</td><td><b>${l[1]}</b></td><td class="r mono">${l[2]}</td></tr>`).join("")}</tbody>
        </table></div>
        <p style="margin-top:10px;font-size:13px;color:var(--fg-muted)">Port-to-port, excluding transhipment delays. Confirmed vessel schedules are shared at booking.</p>
      </div>
    </div></section>
    <section class="sec"><div class="wrap">
      ${secHead("Contract standards", "Clear terms when something goes wrong.", "")}
      <div class="cards">
        <div class="card"><span class="card-icon">${I.doc}</span><h3>GAFTA &amp; FOSFA contracts</h3><p>Grain and oilseed contracts reference GAFTA and FOSFA standard forms, including their arbitration rules.</p></div>
        <div class="card"><span class="card-icon">${I.shield}</span><h3>Quality claims</h3><p>Claims supported by an independent survey at discharge are settled within 30 days of receipt.</p></div>
        <div class="card"><span class="card-icon">${I.clock}</span><h3>Shipment windows</h3><p>Contracts state a shipment period. We confirm vessel and ETA at booking and report any change within 24 hours.</p></div>
      </div>
    </div></section>
    ${ctaBand()}`;

  /* --- Sustainability --- */
  views.sustainability = () => `
    ${phero("<span>Sustainability</span>", "", "Responsible sourcing, measured and reported", "Our business depends on farms that stay productive and farmers who are paid fairly. We work directly with growers, audit what we buy and report progress every year.",
      `<div class="phero-meta"><div><b class="num">1,240</b><span>partner farms</span></div><div><b class="num">38</b><span>farmer producer organisations</span></div><div><b class="num">62%</b><span>of volume traceable to farm cluster</span></div></div>`)}
    <section class="sec"><div class="wrap">
      ${secHead("Our commitments", "Four areas we report against.", "Targets are set for 2030 against a 2023 baseline and reviewed by the board every year.")}
      <div class="cards cards-4">
        ${[[I.people, "Farmer livelihoods", "Price premiums for graded produce, advance payments at sowing and agronomy support from our field team.", "Target: 2,000 farms by 2030"],
           [I.leaf, "Soil & water", "Drip irrigation, residue-free and integrated pest management programmes with grape, pulse and spice growers.", "Target: 30% less water per tonne"],
           [I.globe, "Traceability", "Lot codes linked to farm clusters, and GPS mapping of supplying farms for EUDR-relevant commodities.", "Target: 90% traceable volume"],
           [I.shield, "People & safety", "SMETA-audited facilities, living wage review and zero tolerance of child or forced labour.", "Target: zero lost-time incidents"]]
          .map((c) => `<div class="card"><span class="card-icon">${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p><span class="mono" style="margin-top:6px">${c[3]}</span></div>`).join("")}
      </div>
    </div></section>
    <section class="sec sec-alt"><div class="wrap split">
      <div>
        <span class="eyebrow">Farmer partnership programme</span>
        <h2>Buying directly from the people who grow it.</h2>
        <p class="lede">Since 2016 our sourcing team has worked with farmer producer organisations in Maharashtra, Madhya Pradesh, Gujarat, Rajasthan, Karnataka and Tamil Nadu. Farmers get a guaranteed buyer and premium prices for meeting our grade. Buyers get consistent quality and documented origin.</p>
        <ul class="checks">
          <li>${I.check}<span>Seed and input advice from 24 field agronomists</span></li>
          <li>${I.check}<span>Payment to farmer bank accounts within 7 days of delivery</span></li>
          <li>${I.check}<span>Residue-free protocols for grapes, chillies and cumin</span></li>
          <li>${I.check}<span>Women farmer groups supplying 18% of pulse volume</span></li>
        </ul>
      </div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Indicator</th><th class="r">2023</th><th class="r">2025</th></tr></thead>
        <tbody>
          ${[["Partner farms", "820", "1,240"], ["Volume sourced direct from FPOs", "34%", "51%"], ["Volume traceable to farm cluster", "41%", "62%"], ["Water use, processing (L/MT)", "410", "352"], ["Solar share of facility power", "12%", "38%"], ["Farmers trained in IPM", "2,100", "4,650"]]
            .map((r) => `<tr><td>${r[0]}</td><td class="r mono">${r[1]}</td><td class="r mono"><b>${r[2]}</b></td></tr>`).join("")}
        </tbody>
      </table></div>
    </div></section>
    <section class="sec"><div class="wrap">
      ${secHead("Traceability", "From the bag back to the farm cluster.", "")}
      ${lotBlock()}
    </div></section>
    ${ctaBand("Need sustainability data for your supplier assessment?", "We complete Sedex, EcoVadis and custom questionnaires, and share our annual sustainability report on request.")}`;

  /* --- About --- */
  views.about = () => `
    ${phero("<span>Company</span>", "", "An agricultural trading house built over eighteen years", "Merriment Industries started in 2008 as a two-person pulses desk in Mumbai. Today we source, process and export six commodity divisions to 42 countries, with our own processing plants and sales offices on three continents.",
      `<div class="phero-meta"><div><b class="num">340</b><span>employees</span></div><div><b class="num">5</b><span>offices</span></div><div><b class="num">2</b><span>processing plants</span></div><div><b class="num">42</b><span>export markets</span></div></div>`)}
    <section class="sec"><div class="wrap split">
      <div>
        <span class="eyebrow">Who we are</span>
        <h2>Trader, processor and exporter under one roof.</h2>
        <p class="lede">We control each step that affects quality: buying at origin, cleaning and sorting, testing, packing and booking freight. That keeps our specifications consistent from one container to the next, and gives buyers one company to hold accountable.</p>
        <ul class="checks">
          <li>${I.check}<span>Mission: to be the most dependable source of Indian agricultural produce for professional buyers.</span></li>
          <li>${I.check}<span>Values: accuracy in every specification, fairness to growers, and plain dealing with buyers.</span></li>
        </ul>
      </div>
      <div>
        <span class="eyebrow">History</span>
        <div class="timeline" style="margin-top:24px">${TIMELINE.map((t) => `<div class="tl"><b>${t[0]}</b><p>${t[1]}</p></div>`).join("")}</div>
      </div>
    </div></section>
    <section class="sec sec-alt"><div class="wrap">
      ${secHead("Infrastructure", "Facilities we own and operate.", "")}
      <div class="cards">
        <div class="card"><span class="card-icon">${I.farm}</span><h3>Indore processing unit</h3><p>Cleaning, destoning, gravity separation and Sortex lines for pulses and grains. 120 MT per day. 18,000 MT warehousing.</p><span class="mono">BRCGS AA · ISO 22000</span></div>
        <div class="card"><span class="card-icon">${I.farm}</span><h3>Mundra seed &amp; spice plant</h3><p>Sesame hulling, spice cleaning, grinding and steam sterilisation, 8 km from Mundra port. 60 MT per day.</p><span class="mono">FSSC 22000 · Organic</span></div>
        <div class="card"><span class="card-icon">${I.lab}</span><h3>Quality laboratory</h3><p>HPLC, moisture analysers, microbiology lab and retained-sample store. Staffed by eight food scientists.</p><span class="mono">ISO/IEC 17025 in progress</span></div>
        <div class="card"><span class="card-icon">${I.water}</span><h3>Nashik pack-house</h3><p>Pre-cooling and cold storage for 1,200 MT of fresh produce, under contract with a GlobalG.A.P. operator.</p><span class="mono">GlobalG.A.P. · APEDA</span></div>
        <div class="card"><span class="card-icon">${I.box}</span><h3>Rotterdam DAP warehouse</h3><p>Bonded storage for European buyers who prefer smaller, more frequent call-offs on DAP terms.</p><span class="mono">Third-party, bonded</span></div>
        <div class="card"><span class="card-icon">${I.globe}</span><h3>Sales offices</h3><p>Dubai, Rotterdam and Singapore teams handle contracts and after-sales in their local time zone.</p><span class="mono">MEA · EU · APAC</span></div>
      </div>
    </div></section>
    <section class="sec"><div class="wrap">
      ${secHead("Leadership", "The people accountable for your contracts.", "")}
      <div class="people">${LEADERS.map((l) => `<div class="person"><span class="avatar" aria-hidden="true">${l.name.split(" ").filter((w) => !w.endsWith(".")).map((w) => w[0]).slice(0, 2).join("")}</span><div><h3>${l.name}</h3><div class="role">${l.role}</div><p>${l.note}</p></div></div>`).join("")}</div>
    </div></section>
    <section class="sec sec-alt" id="sec-offices"><div class="wrap">
      ${secHead("Offices", "Five locations, three continents.", "")}
      ${officeCards()}
    </div></section>
    ${ctaBand()}`;

  const officeCards = () => `<div class="offices">${OFFICES.map((o) => `<div class="office"><h3>${o.city}</h3><span class="role">${o.role}</span><address>${o.addr}</address><small>${o.tz}</small></div>`).join("")}</div>`;

  /* --- Insights --- */
  views.insights = () => `
    ${phero("<span>Insights</span>", "", "Market insights", "Crop reports, logistics updates and regulatory briefings from our trade desk, for buyers planning their purchases.")}
    <section class="sec-tight"><div class="wrap">
      <div class="article-list">${INSIGHTS.map((a) => `
        <article class="article">
          <div class="article-meta"><span class="chip plain">${a.tag}</span><time datetime="${a.date}">${fmtDate(a.date)}</time><span>${a.read} read</span></div>
          <div>
            <h3>${esc(a.title)}</h3>
            <p>${esc(a.sum)}</p>
            <details><summary>Read the briefing ${I.arrow.replace("<svg", '<svg width="15" height="15"')}</summary>${a.body.map((b) => `<p>${esc(b)}</p>`).join("")}</details>
          </div>
        </article>`).join("")}
      </div>
    </div></section>
    ${ctaBand("Get briefings by email", "One short email every two weeks with crop updates and price direction for the products you buy. Subscribe in the footer.")}`;

  /* --- Careers --- */
  views.careers = () => `
    ${phero("<span>Careers</span>", "", "Careers at Merriment", "We hire traders, food scientists, agronomists and logistics specialists who take accuracy seriously. 340 people across India, the UAE, the Netherlands and Singapore.")}
    <section class="sec"><div class="wrap split">
      <div>
        <span class="eyebrow">Working here</span>
        <h2>What we offer.</h2>
        <ul class="checks">
          <li>${I.check}<span>Structured trainee programme for graduates in agriculture, food technology and international business</span></li>
          <li>${I.check}<span>Exposure to origin, processing and international markets in your first two years</span></li>
          <li>${I.check}<span>Health insurance for employees and families, and annual performance bonus</span></li>
          <li>${I.check}<span>Internal moves between our India, Dubai, Rotterdam and Singapore offices</span></li>
        </ul>
      </div>
      <div>
        <span class="eyebrow">Open positions</span>
        <div class="jobs" style="margin-top:20px">${JOBS.map((j) => `<div class="job"><b>${j.title}</b><span>${j.place}</span><span class="type">${j.type}</span></div>`).join("")}</div>
        <p style="margin-top:16px;color:var(--fg-muted);font-size:14.5px">Send your CV and the role title to <b style="user-select:all">careers@merriment-industries.com</b>.</p>
      </div>
    </div></section>`;

  /* --- Contact / RFQ --- */
  views.contact = (sub) => {
    const type = sub === "catalogue" ? "catalogue" : "quote";
    return `
    ${phero("<span>Contact</span>", "", "Request a quote", "Tell us the product, quantity, packing and destination port. The trade desk replies with an indicative offer within one working day.")}
    <section class="sec-tight"><div class="wrap split split-60">
      <div class="form-card" id="rfqCard">
        <form class="form" id="rfq" novalidate>
          <fieldset>
            <legend>Enquiry type</legend>
            <div class="radios">
              <label><input type="radio" name="type" value="quote" ${type === "quote" ? "checked" : ""}> Price quotation</label>
              <label><input type="radio" name="type" value="samples"> Samples</label>
              <label><input type="radio" name="type" value="catalogue" ${type === "catalogue" ? "checked" : ""}> Product catalogue</label>
              <label><input type="radio" name="type" value="contract"> Annual contract</label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Products</legend>
            <div class="enq-list" id="enqList"></div>
            <div class="row">
              <div class="field"><label for="addProduct">Add a product</label>
                <select id="addProduct"><option value="">Select a product…</option>${CATEGORIES.map((c) => `<optgroup label="${c.name}">${PRODUCTS.filter((p) => p.cat === c.id).map((p) => `<option value="${p.id}">${esc(p.name)} — ${esc(p.variant)}</option>`).join("")}</optgroup>`).join("")}</select>
              </div>
              <div class="field"><label for="packing">Packing <span class="opt">(optional)</span></label><input id="packing" placeholder="e.g. 25 kg PP bags, private label"></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Shipment</legend>
            <div class="row row-3">
              <div class="field"><label for="incoterm">Incoterm</label><select id="incoterm"><option>CIF</option><option>CFR</option><option>FOB</option><option>DAP</option><option>Not sure</option></select></div>
              <div class="field"><label for="port">Destination port</label><input id="port" placeholder="e.g. Jebel Ali" required><span class="err">Enter the destination port.</span></div>
              <div class="field"><label for="window">Shipment month</label><input id="window" placeholder="e.g. Dec 2026"></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Your details</legend>
            <div class="row">
              <div class="field"><label for="name">Full name</label><input id="name" autocomplete="name" required><span class="err">Enter your name.</span></div>
              <div class="field"><label for="company">Company</label><input id="company" autocomplete="organization" required><span class="err">Enter your company name.</span></div>
            </div>
            <div class="row">
              <div class="field"><label for="email">Work email</label><input id="email" type="email" autocomplete="email" required><span class="err">Enter a valid email address.</span></div>
              <div class="field"><label for="phone">Phone / WhatsApp <span class="opt">(optional)</span></label><input id="phone" type="tel" autocomplete="tel"></div>
            </div>
            <div class="row">
              <div class="field"><label for="country">Country</label><input id="country" autocomplete="country-name" required><span class="err">Enter your country.</span></div>
              <div class="field"><label for="btype">Business type</label><select id="btype"><option>Importer / distributor</option><option>Wholesaler</option><option>Retail chain</option><option>Food manufacturer</option><option>Trader</option><option>Other</option></select></div>
            </div>
            <div class="field"><label for="msg">Specification or notes <span class="opt">(optional)</span></label><textarea id="msg" placeholder="Grade, moisture, count, certifications, payment terms, annual volume"></textarea></div>
          </fieldset>
          <label class="consent"><input type="checkbox" id="consent" required> <span>I agree that Merriment Industries may contact me about this enquiry and process my details under its privacy policy.</span></label>
          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="btn btn-primary" type="submit">Send enquiry ${I.arrow}</button><span style="font-size:13px;color:var(--fg-muted)">Reply within one working day.</span></div>
        </form>
      </div>
      <aside class="contact-aside">
        <div class="desk">
          <h3>Trade desk, Mumbai</h3>
          <p>Contracts, prices and shipment updates. Monday to Saturday, 09:00–19:00 IST.</p>
          <div class="desk-row"><small>Email</small><span>trade@merriment-industries.com<button class="copy" data-copy="trade@merriment-industries.com">Copy</button></span></div>
          <div class="desk-row"><small>Phone</small><span>+91 22 4000 7100<button class="copy" data-copy="+91 22 4000 7100">Copy</button></span></div>
          <div class="desk-row"><small>WhatsApp Business</small><span>+91 98200 07100<button class="copy" data-copy="+91 98200 07100">Copy</button></span></div>
        </div>
        <div class="panel">
          <h3>Regional sales</h3>
          <dl class="kv">
            <dt>Middle East &amp; Africa</dt><dd>dubai@merriment-industries.com</dd>
            <dt>Europe &amp; UK</dt><dd>eu@merriment-industries.com</dd>
            <dt>Asia-Pacific</dt><dd>sg@merriment-industries.com</dd>
            <dt>Quality &amp; certificates</dt><dd>qa@merriment-industries.com</dd>
          </dl>
        </div>
      </aside>
    </div></section>
    <section class="sec sec-alt"><div class="wrap">
      ${secHead("Offices", "Visit us.", "Meetings by appointment. Samples can be reviewed at Mumbai, Dubai and Rotterdam.")}
      ${officeCards()}
    </div></section>
    <section class="sec"><div class="wrap split">
      <div><span class="eyebrow">FAQ</span><h2>Questions buyers ask first.</h2><p class="lede">Can't find the answer? Write to the trade desk and we'll reply the same day.</p></div>
      <div class="faq">${FAQ.map((f) => `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("")}</div>
    </div></section>`;
  };

  function renderEnqList() {
    const box = $("#enqList"); if (!box) return;
    const ids = Object.keys(enquiry);
    box.innerHTML = ids.length ? ids.map((id) => {
      const p = byId(id);
      return `<div class="enq-item"><div><b>${esc(p.name)}</b><small>HS ${p.hs} · MOQ ${esc(p.moq)}</small></div>
        <label class="sr-only" for="qty-${id}">Quantity in MT for ${esc(p.name)}</label>
        <input id="qty-${id}" data-qty="${id}" inputmode="decimal" placeholder="Qty (MT)" value="${esc(enquiry[id])}">
        <button type="button" data-remove="${id}" aria-label="Remove ${esc(p.name)}">${I.x}</button></div>`;
    }).join("") : `<div class="empty" style="padding:22px">No products added yet. Choose from the list below or <a class="link" href="#products">browse the catalogue</a>.</div>`;
  }

  function bindContact() {
    renderEnqList();
    const form = $("#rfq");
    $("#addProduct").addEventListener("change", (e) => {
      const id = e.target.value; if (!id) return;
      if (enquiry[id] === undefined) { enquiry[id] = ""; saveEnquiry(); }
      e.target.value = ""; renderEnqList();
    });
    $("#enqList").addEventListener("click", (e) => {
      const b = e.target.closest("[data-remove]"); if (!b) return;
      delete enquiry[b.dataset.remove]; saveEnquiry(); renderEnqList();
    });
    $("#enqList").addEventListener("input", (e) => {
      const i = e.target.closest("[data-qty]"); if (!i) return;
      enquiry[i.dataset.qty] = i.value; saveEnquiry();
    });
    form.addEventListener("input", (e) => { const f = e.target.closest(".field"); if (f) f.classList.remove("invalid"); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true, first = null;
      ["port", "name", "company", "email", "country"].forEach((id) => {
        const el = $("#" + id);
        const bad = !el.value.trim() || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        el.closest(".field").classList.toggle("invalid", bad);
        el.setAttribute("aria-invalid", bad);
        if (bad) { ok = false; first = first || el; }
      });
      const type = form.querySelector('input[name="type"]:checked').value;
      if (ok && type !== "catalogue" && !Object.keys(enquiry).length) { toast("Add at least one product to your enquiry"); $("#addProduct").focus(); return; }
      if (ok && !$("#consent").checked) { toast("Tick the consent box to send your enquiry"); $("#consent").focus(); return; }
      if (!ok) { first.focus(); return; }
      const ref = `RFQ-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const items = Object.keys(enquiry).map((id) => `<li>${esc(byId(id).name)}${enquiry[id] ? ` — ${esc(enquiry[id])} MT` : ""}</li>`).join("");
      $("#rfqCard").innerHTML = `<div class="success" role="status">
        <span class="eyebrow">Enquiry received</span>
        <h2 style="font-size:30px">Thank you, ${esc($("#name").value.trim().split(" ")[0])}.</h2>
        <p class="lede">Your reference is <span class="ref">${ref}</span>. An account manager for ${esc($("#country").value.trim())} will reply to ${esc($("#email").value.trim())} within one working day.</p>
        ${items ? `<ul class="checks">${items.replace(/<li>/g, `<li>${I.check}<span>`).replace(/<\/li>/g, "</span></li>")}</ul>` : ""}
        <p style="font-size:13px;color:var(--fg-muted)">Website preview: this form is not yet connected to the trade desk inbox, so no message has been sent.</p>
        <div><a class="btn btn-line" href="#products">Back to the catalogue</a></div>
      </div>`;
      enquiry = {}; saveEnquiry();
      window.scrollTo({ top: $("#rfqCard").getBoundingClientRect().top + window.scrollY - 120 });
    });
  }

  /* --- Legal --- */
  views.legal = () => `
    ${phero("<span>Legal</span>", "", "Privacy, terms of trade and cookies", "Summary of how we handle buyer data and the general terms that apply to our contracts.")}
    <section class="sec-tight"><div class="wrap"><div class="prose">
      <h2>Privacy</h2>
      <p>We collect the contact and company details you send through this website only to answer your enquiry and manage our trading relationship. We do not sell personal data. You may ask us to correct or delete your data by writing to privacy@merriment-industries.com.</p>
      <h2>Terms of trade</h2>
      <p>Offers on this website are indicative and subject to prior sale and written confirmation. Each sale is governed by the signed sales contract, which states the specification, quantity, price, Incoterm, shipment period, payment terms and dispute resolution. Where applicable, GAFTA or FOSFA standard contract terms apply.</p>
      <h2>Cookies</h2>
      <p>This website stores your enquiry list and catalogue layout in your browser so they are kept between visits. It does not use advertising cookies.</p>
    </div></div></section>`;

  views.notfound = () => `
    ${phero("<span>Not found</span>", "", "This page doesn't exist", "The link may be out of date. Use the menu, or go to the product catalogue.")}
    <section class="sec-tight"><div class="wrap"><a class="btn btn-primary" href="#products">Go to the catalogue</a></div></section>`;

  /* ---------- Router ---------- */
  const TITLES = { home: "Agricultural import & export", products: "Product catalogue", quality: "Quality & certifications", logistics: "Logistics & trade terms", sustainability: "Sustainability", about: "Company", insights: "Market insights", careers: "Careers", contact: "Request a quote", legal: "Legal" };

  function route() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, "")) || "home";
    let name, sub;
    if (raw.startsWith("product-")) { name = "product"; sub = raw.slice(8); }
    else { const i = raw.indexOf("-"); name = i < 0 ? raw : raw.slice(0, i); sub = i < 0 ? "" : raw.slice(i + 1); }
    if (name === "main") return;
    const view = views[name] || views.notfound;
    const main = $("#main");
    main.innerHTML = view(sub);
    const p = name === "product" ? byId(sub) : null;
    document.title = `${p ? p.name : TITLES[name] || "Not found"} · Merriment Industries`;

    const navNames = name === "product" ? ["products"] : name === "careers" ? ["about", "careers"] : [name];
    $$("[data-route]").forEach((a) => {
      if (navNames.includes(a.dataset.route)) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    closeMenu();

    if (name === "products") bindProducts();
    if (name === "contact") bindContact();
    $$("[data-add]", main).forEach((b) => { syncAddBtn(b); b.addEventListener("click", () => toggleEnquiry(b.dataset.add)); });

    const target = sub && document.getElementById("sec-" + sub);
    if (target) requestAnimationFrame(() => window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90 }));
    else window.scrollTo({ top: 0 });
  }

  /* ---------- Global handlers ---------- */
  function closeMenu() { $("#mnav").hidden = true; $("#menuBtn").setAttribute("aria-expanded", "false"); }
  $("#menuBtn").addEventListener("click", () => {
    const open = $("#mnav").hidden;
    $("#mnav").hidden = !open; $("#menuBtn").setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-href]");
    if (row) { location.hash = row.dataset.href; return; }
    const c = e.target.closest("[data-copy]");
    if (c) {
      const text = c.dataset.copy;
      const done = () => toast(`Copied ${text}`);
      try { navigator.clipboard.writeText(text).then(done, () => toast(text)); } catch (err) { toast(text); }
    }
  });
  document.addEventListener("keydown", (e) => {
    const row = e.target.closest && e.target.closest("tr[data-href]");
    if (row && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); location.hash = row.dataset.href; }
    if (e.key === "Escape") closeMenu();
  });
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#newsEmail").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { toast("Enter a valid work email to subscribe"); $("#newsEmail").focus(); return; }
    $("#newsEmail").value = ""; toast(`Subscribed ${v} to market briefings`);
  });

  function deskStatus() {
    const now = new Date();
    const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
    const h = ist.getHours() + ist.getMinutes() / 60, d = ist.getDay();
    const open = d !== 0 && h >= 9 && h < 19;
    const hh = String(ist.getHours()).padStart(2, "0"), mm = String(ist.getMinutes()).padStart(2, "0");
    $("#deskStatus").textContent = `Trade desk ${open ? "open" : "closed"} · Mumbai ${hh}:${mm} IST`;
    $(".util .live-dot").style.opacity = open ? 1 : .35;
  }

  window.addEventListener("hashchange", route);
  updateBasket();
  deskStatus(); setInterval(deskStatus, 30000);
  route();
})();
