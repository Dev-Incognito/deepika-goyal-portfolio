/* ============================================
   CONTENT LOADER
   Fetches content.json + feature-flags.json,
   renders hero variant, injects all content,
   then kicks off animations.
   ============================================ */

/* ─── SVG Icon Library ─── */
const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
};

const iconMap = {
  'E': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  'C': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>',
  'G': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  'I': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  'L': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  'S': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  'Now': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  'Next': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
  'Future': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
};
const getIcon = (key) => iconMap[key] || key;

/* ─── QR Code Modal ─── */
function createQRModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'qr-modal-backdrop';
  backdrop.id = 'qrModal';
  backdrop.innerHTML = `
    <div class="qr-modal" role="dialog" aria-modal="true" aria-label="Social QR Code">
      <button class="qr-modal-close" id="qrModalClose" aria-label="Close">&times;</button>
      <div class="qr-modal-icon" id="qrModalIcon"></div>
      <div class="qr-modal-platform" id="qrModalPlatform"></div>
      <div class="qr-modal-qr">
        <img id="qrModalImg" src="" alt="QR Code" width="176" height="176">
      </div>
      <div class="qr-modal-handle" id="qrModalHandle"></div>
      <div class="qr-modal-label">Scan to connect</div>
      <a class="qr-modal-link" id="qrModalLink" href="#" target="_blank" rel="noopener">Open Profile</a>
    </div>
  `;
  document.body.appendChild(backdrop);

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  document.getElementById('qrModalClose').addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  return {
    open(platform, label, handle, url) {
      document.getElementById('qrModalIcon').innerHTML = SOCIAL_ICONS[platform] || '';
      document.getElementById('qrModalPlatform').textContent = label;
      document.getElementById('qrModalHandle').textContent = handle;
      document.getElementById('qrModalLink').href = url;
      // Use qr-server.com free API for QR generation
      const encoded = encodeURIComponent(url);
      document.getElementById('qrModalImg').src =
        `https://api.qrserver.com/v1/create-qr-code/?size=176x176&margin=0&color=0-0-0&bgcolor=255-255-255&data=${encoded}`;
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };
}

/* ─── Hero Templates ─── */
function renderHeroOrbital(data) {
  const hero = document.getElementById('hero');
  hero.className = 'hero';
  hero.innerHTML = `
    <div class="hero-bg-element hero-bg-1"></div>
    <div class="hero-bg-element hero-bg-2"></div>
    <div class="hero-bg-element hero-bg-3"></div>
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-name">${data.hero.nameFirst}<span>${data.hero.nameLast}</span></h1>
        <div class="hero-tagline">
          ${data.hero.tagline.map((t, i, a) =>
            `<span>${t}</span>${i < a.length - 1 ? '<span class="dot"></span>' : ''}`
          ).join('')}
        </div>
        <p class="hero-statement">${data.hero.statement}</p>
        <div class="hero-scroll" onclick="scrollToSection('brand')">
          <div class="scroll-line"></div>
          <span>${data.hero.scrollBtn}</span>
        </div>
      </div>
      <div class="hero-portrait">
        <div class="portrait-frame">
          <img src="assets/portrait.jpg" alt="${data.hero.nameFirst} ${data.hero.nameLast}" class="portrait-img" fetchpriority="high">
        </div>
      </div>
    </div>
  `;
}

function renderHeroCinematic(data) {
  const hero = document.getElementById('hero');
  hero.className = 'hero hero--cinematic';
  hero.innerHTML = `
    <div class="hero-cin-bg">
      <img src="assets/portrait.jpg" class="hero-cin-portrait-bg" alt="" role="presentation" fetchpriority="high">
      <div class="hero-cin-overlay"></div>
    </div>
    <div class="hero-cin-grain"></div>
    <div class="hero-cin-scanline"></div>
    <div class="hero-cin-content">
      <h1 class="hero-cin-name">
        ${data.hero.nameFirst}
        <span class="cin-last">${data.hero.nameLast}</span>
      </h1>
      <p class="hero-cin-statement">${data.hero.statement}</p>
      <div class="hero-cin-actions">
        <button class="hero-cin-btn" onclick="scrollToSection('brand')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          ${data.hero.scrollBtn}
        </button>
        <span class="hero-cin-tagline-small">${data.hero.tagline.join(' · ')}</span>
      </div>
    </div>
    <div class="hero-cin-meta">
      <span>HR & Digital</span>
      <span>Sangrur • PB • IN</span>
      <span>EN • HI • PA</span>
    </div>
  `;
}

function renderHeroGalaxy(data) {
  const hero = document.getElementById('hero');
  hero.className = 'hero hero--galaxy';
  hero.innerHTML = `
    <div class="hero-gal-bg">
      <div class="hero-gal-stars"></div>
      <div class="hero-gal-nebula"></div>
    </div>
    <div class="hero-gal-content">
      <div class="hero-gal-orb"></div>
      <div class="hero-gal-portrait-wrap">
        <img src="assets/portrait.jpg" alt="${data.hero.nameFirst}" fetchpriority="high">
      </div>
      <div class="hero-gal-text">
        <h1 class="hero-gal-name"><span class="baffle-target">${data.hero.nameFirst}</span> <span class="baffle-target stroke-text">${data.hero.nameLast}</span></h1>
        <div class="hero-gal-tagline">
          ${data.hero.tagline.map(t => `<span class="gal-tag">${t}</span>`).join('<span class="gal-sep">✦</span>')}
        </div>
        <p class="hero-gal-statement">${data.hero.statement}</p>
        <button class="hero-gal-btn" onclick="scrollToSection('brand')">${data.hero.scrollBtn}</button>
      </div>
    </div>
  `;
}

function renderHeroPookie(data) {
  const hero = document.getElementById('hero');
  hero.className = 'hero hero--pookie';
  hero.innerHTML = `
    <div class="hero-pook-bg">
      <div class="pook-cloud pook-cloud-1"></div>
      <div class="pook-cloud pook-cloud-2"></div>
      <div class="pook-sparkles"></div>
    </div>
    <div class="hero-pook-content">
      <div class="hero-pook-card">
        <div class="hero-pook-portrait">
          <img src="assets/portrait.jpg" alt="${data.hero.nameFirst}">
          <div class="pook-heart">💖</div>
          <div class="pook-heart pook-h2">✨</div>
        </div>
        <h1 class="hero-pook-name">${data.hero.nameFirst} ${data.hero.nameLast}</h1>
        <div class="hero-pook-tagline">
          ${data.hero.tagline.map(t => `<span class="pook-badge">${t}</span>`).join('')}
        </div>
        <p class="hero-pook-statement">${data.hero.statement}</p>
        <button class="hero-pook-btn" onclick="scrollToSection('brand')">${data.hero.scrollBtn} 💕</button>
      </div>
    </div>
  `;
}

function renderHeroModern(data) {
  const hero = document.getElementById('hero');
  hero.className = 'hero hero--modern';
  const marqueeText = Array(10).fill(null).map(() =>
    data.hero.tagline.map(t => `<span>${t}</span>`).join('<span class="mod-star">★</span>')
  ).join('<span class="mod-star">★</span>');

  hero.innerHTML = `
    <div class="hero-mod-marquee-top">
      <div class="mod-marquee-inner">${marqueeText}</div>
    </div>
    <div class="hero-mod-grid">
      <div class="mod-cell mod-cell-1">
        <h1 class="hero-mod-name"><span class="baffle-target">${data.hero.nameFirst}</span><br><span class="baffle-target">${data.hero.nameLast}</span></h1>
      </div>
      <div class="mod-cell mod-cell-2">
        <img src="assets/portrait.jpg" alt="${data.hero.nameFirst}">
      </div>
      <div class="mod-cell mod-cell-3">
        <p class="hero-mod-statement">${data.hero.statement}</p>
        <button class="hero-mod-btn" onclick="scrollToSection('brand')">${data.hero.scrollBtn} <span>↗</span></button>
      </div>
    </div>
    <div class="hero-mod-marquee-bottom">
      <div class="mod-marquee-inner reverse">${marqueeText}</div>
    </div>
  `;
}

function renderHeroProfessional(data) {
  const hero = document.getElementById('hero');
  hero.className = 'hero hero--professional';
  hero.innerHTML = `
    <div class="hero-pro-layout">
      <div class="hero-pro-left">
        <div class="hero-pro-meta">PROFILE.01 / ${new Date().getFullYear()}</div>
        <h1 class="hero-pro-name">${data.hero.nameFirst} ${data.hero.nameLast}.</h1>
        <div class="hero-pro-divider"></div>
        <div class="hero-pro-tagline">
          ${data.hero.tagline.join(' &mdash; ')}
        </div>
        <p class="hero-pro-statement">${data.hero.statement}</p>
        <button class="hero-pro-btn" onclick="scrollToSection('brand')">${data.hero.scrollBtn}</button>
      </div>
      <div class="hero-pro-right">
        <div class="hero-pro-img-wrap">
          <img src="assets/portrait.jpg" alt="${data.hero.nameFirst}">
        </div>
      </div>
    </div>
  `;
}

function renderHeroArtistic(data) {
  const hero = document.getElementById('hero');
  hero.className = 'hero hero--artistic';
  hero.innerHTML = `
    <div class="hero-art-canvas">
      <div class="art-shape art-shape-1"></div>
      <div class="art-shape art-shape-2"></div>
      <div class="art-shape art-shape-3"></div>
      <div class="hero-art-text-bg" aria-hidden="true">${data.hero.nameFirst}<br>${data.hero.nameLast}</div>
    </div>
    <div class="hero-art-foreground">
      <div class="hero-art-portrait">
        <div class="art-img-mask">
          <img src="assets/portrait.jpg" alt="${data.hero.nameFirst}">
        </div>
        <div class="art-frame"></div>
      </div>
      <div class="hero-art-copy">
        <h1 class="hero-art-name">${data.hero.nameFirst} <em>${data.hero.nameLast}</em></h1>
        <p class="hero-art-statement">${data.hero.statement}</p>
        <div class="hero-art-tagline">
          ${data.hero.tagline.map(t => `<span>${t}</span>`).join(' <i>&amp;</i> ')}
        </div>
        <button class="hero-art-btn" onclick="scrollToSection('brand')"><span class="art-btn-txt">${data.hero.scrollBtn}</span><span class="art-btn-line"></span></button>
      </div>
    </div>
  `;
}

/* ─── Build Contact Section ─── */
function renderContact(data) {
  const section = document.getElementById('contact');
  const inner = section.querySelector('.section-inner');
  if (!inner) return;

  inner.querySelector('.section-label').textContent = data.contact.sectionLabel;
  inner.querySelector('.section-title').textContent = data.contact.sectionTitle;

  // Remove old card content, insert new grid
  const existingGrid = inner.querySelector('.contact-grid');
  if (existingGrid) existingGrid.remove();
  const oldCard = inner.querySelector('.contact-card');
  if (oldCard) oldCard.remove();
  const oldRef = inner.querySelector('[data-block="references"]');
  if (oldRef) oldRef.remove();

  const detailsHtml = data.contact.info.map(item => `
    <div class="contact-detail-row">
      <div class="contact-detail-icon">${getIcon(item.icon)}</div>
      <div>
        <div class="contact-detail-label">${item.label}</div>
        <div class="contact-detail-value">${item.text}</div>
      </div>
    </div>
  `).join('');

  const socialHtml = (data.contact.social || []).map(s => `
    <button class="social-icon-btn" data-platform="${s.platform}" data-handle="${s.handle}" data-url="${s.url}" data-label="${s.label}" aria-label="Open ${s.label} QR code">
      <svg class="social-icon-svg" viewBox="0 0 24 24">${SOCIAL_ICONS[s.platform] ? SOCIAL_ICONS[s.platform].match(/<path[^>]+\/>/)[0] : ''}</svg>
      <div class="social-btn-text">
        <span class="social-btn-name">${s.label}</span>
        <span class="social-btn-handle">${s.handle}</span>
      </div>
      <span class="social-btn-arrow">→</span>
    </button>
  `).join('');

  const grid = document.createElement('div');
  grid.className = 'contact-grid reveal';
  grid.innerHTML = `
    <div class="contact-profile">
      <div class="contact-profile-header">
        <img src="assets/portrait.jpg" class="contact-avatar" alt="${data.contact.cardName}" loading="lazy">
        <div>
          <h3 class="contact-profile-name">${data.contact.cardName}</h3>
          <div class="contact-profile-tagline">${data.contact.cardTagline}</div>
        </div>
      </div>
      <div class="contact-details-list">${detailsHtml}</div>
      <p class="contact-cta-text">${data.contact.footer}</p>
    </div>
    <div class="contact-social-panel">
      <div class="contact-social-heading">Connect on Social</div>
      <div class="social-icon-buttons">${socialHtml}</div>
      <p class="social-qr-hint">Tap any platform to scan the QR code</p>
    </div>
  `;
  inner.appendChild(grid);

  const refDiv = document.createElement('div');
  refDiv.className = 'contact-references reveal reveal-delay-1';
  refDiv.setAttribute('data-block', 'references');
  refDiv.innerHTML = `<p>${data.contact.references}</p>`;
  inner.appendChild(refDiv);
}

/* ─── Main Loader ─── */
(async function() {
  try {
    // Fetch content, feature flags, and theme colors in parallel
    const [contentRes, flagsRes, colorsRes] = await Promise.all([
      fetch('data/content.json'),
      fetch('data/feature-flags.json'),
      fetch('data/theme-colors.json')
    ]);

    if (!contentRes.ok) throw new Error('Failed to load content.json');
    if (!flagsRes.ok)   throw new Error('Failed to load feature-flags.json');

    let data  = await contentRes.json();
    const flags = await flagsRes.json();
    let themeColors = {};
    try { if (colorsRes.ok) themeColors = await colorsRes.json(); } catch(e) {}

    // ── Admin content override (set by admin panel) ──
    try {
      const adminContent = localStorage.getItem('deepika-admin-content');
      if (adminContent) data = JSON.parse(adminContent);
    } catch(e) {}

    // ── Merge localStorage flag overrides (from FF panel or admin panel) ──
    try {
      const storedFlags = localStorage.getItem('deepika-portfolio-flags');
      if (storedFlags) Object.assign(flags, JSON.parse(storedFlags));
    } catch(e) {}

    
    // ── Apply Section Fonts ──
    const sections = ['hero', 'brand', 'strengths', 'differentiators', 'exposure', 'capabilities', 'vision', 'introduction', 'contact'];
    const fontSet = new Set();
    
    sections.forEach(sec => {
      if (data[sec] && data[sec].font) {
        fontSet.add(data[sec].font);
        const el = document.getElementById(sec);
        if (el) {
          el.style.setProperty('--font-display', `"${data[sec].font}", sans-serif`);
          el.style.setProperty('--font-heading', `"${data[sec].font}", sans-serif`);
          el.style.setProperty('--font-body', `"${data[sec].font}", sans-serif`);
        }
      }
    });

    if (fontSet.size > 0) {
      const families = Array.from(fontSet).map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
      document.head.appendChild(link);
    }

    const heroVariant = flags['hero-variant'] || 'orbital';
    // Remove any old theme-* classes without wiping page-loaded or other classes
    document.body.classList.forEach(cls => { if (cls.startsWith('theme-')) document.body.classList.remove(cls); });
    document.body.classList.add('theme-' + heroVariant);

    // ── Apply Theme Color Overrides ──
    let themeOverrideData = themeColors[heroVariant] || { vars: {}, elements: {} };
    // Handle legacy flat format from file
    if (!themeOverrideData.elements && !themeOverrideData.vars) {
      themeOverrideData = { vars: themeOverrideData, elements: {} };
    }
    
    try {
      const adminColors = localStorage.getItem('deepika-admin-theme-colors');
      if (adminColors) {
        const allAdminColors = JSON.parse(adminColors);
        if (allAdminColors[heroVariant]) {
          const ad = allAdminColors[heroVariant];
          if (ad.elements || ad.vars) {
             themeOverrideData.vars = { ...themeOverrideData.vars, ...(ad.vars || {}) };
             themeOverrideData.elements = { ...themeOverrideData.elements, ...(ad.elements || {}) };
          } else {
             themeOverrideData.vars = { ...themeOverrideData.vars, ...ad };
          }
        }
      }
    } catch(e) {}
    
    // Apply Global Vars
    for (const [prop, val] of Object.entries(themeOverrideData.vars || {})) {
      if (val) document.body.style.setProperty(prop, val);
    }
    
    // Apply Independent Element Styles
    const elementsData = themeOverrideData.elements || {};
    if (Object.keys(elementsData).length > 0) {
      let css = '';
      for (const [selector, rules] of Object.entries(elementsData)) {
        css += `body.theme-${heroVariant} ${selector} {\n`;
        for (const [prop, val] of Object.entries(rules)) {
          css += `  ${prop}: ${val} !important;\n`;
        }
        css += `}\n`;
      }
      let styleEl = document.getElementById('ve-live-styles');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 've-live-styles';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = css;
    }

    // ── Render Hero Variant ──
    switch (heroVariant) {
      case 'cinematic': renderHeroCinematic(data); break;
      case 'galaxy': renderHeroGalaxy(data); break;
      case 'pookie': renderHeroPookie(data); break;
      case 'modern': renderHeroModern(data); break;
      case 'professional': renderHeroProfessional(data); break;
      case 'artistic': renderHeroArtistic(data); break;
      case 'orbital':
      default: renderHeroOrbital(data); break;
    }

    // Make the page visible now that the correct theme + hero are both applied
    // This runs synchronously here so there's zero frame of wrong theme showing
    document.body.classList.add('page-loaded');

    // ── Global ──
    document.querySelector('.nav-brand').textContent = data.global.navBrand;
    document.querySelector('.footer-brand').textContent = data.global.footerBrand;
    document.querySelector('.footer-text').textContent = data.global.footerText;

    document.getElementById('navLinks').innerHTML = data.global.navLinks.map(l =>
      `<li><a href="#${l.id}">${l.label}</a></li>`
    ).join('');

    document.getElementById('mobileNav').innerHTML = data.global.navLinks.map(l =>
      `<a href="#${l.id}" onclick="closeMobileNav()">${l.label}</a>`
    ).join('');

    // ── Brand ──
    document.querySelector('#brand .section-label').textContent = data.brand.sectionLabel;
    document.querySelector('#brand .section-title').textContent = data.brand.sectionTitle;
    document.querySelector('#brand .section-subtitle').textContent = data.brand.sectionSubtitle;
    document.querySelector('.brand-quote').textContent = data.brand.quote;

    document.querySelector('.brand-values').innerHTML = data.brand.values.map((v, i) => `
      <div class="value-card reveal reveal-delay-${i + 1}">
        <div class="value-icon">${getIcon(v.icon)}</div>
        <h3>${v.title}</h3>
        <p>${v.desc}</p>
      </div>
    `).join('');

    const philosophy = document.querySelector('#brand [data-block="philosophy"]');
    if (philosophy) philosophy.innerHTML = `
      <h3 style="font-family:var(--font-heading);font-size:1.15rem;font-weight:500;margin-bottom:16px;color:var(--charcoal);">${data.brand.philosophyTitle}</h3>
      <p style="font-family:var(--font-display);font-size:1.05rem;line-height:1.9;color:var(--graphite);font-style:italic;">${data.brand.philosophyText}</p>
    `;

    // ── Strengths ──
    document.querySelector('#strengths .section-label').textContent = data.strengths.sectionLabel;
    document.querySelector('#strengths .section-title').textContent = data.strengths.sectionTitle;
    document.querySelector('#strengths .section-subtitle').textContent = data.strengths.sectionSubtitle;

    document.querySelector('.exp-timeline').innerHTML = data.strengths.timeline.map((item, i) => `
      <div class="exp-item reveal ${i > 0 ? 'reveal-delay-' + i : ''}">
        <div class="exp-period">${item.period}</div>
        <div class="exp-role">${item.role}</div>
        <div class="exp-company">${item.company}</div>
        <p class="exp-description">${item.desc}</p>
        <div class="exp-skills">
          ${item.skills.map(s => `<span class="exp-skill-tag">${s}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // ── Differentiators ──
    document.querySelector('#differentiators .section-label').textContent = data.differentiators.sectionLabel;
    document.querySelector('#differentiators .section-title').textContent = data.differentiators.sectionTitle;
    document.querySelector('#differentiators .section-subtitle').textContent = data.differentiators.sectionSubtitle;

    document.querySelector('.diff-grid').innerHTML = data.differentiators.cards.map((card, i) => `
      <div class="diff-card reveal reveal-delay-${(i % 3) + 1}">
        <div class="diff-number">${card.number}</div>
        <h3>${card.title}</h3>
        <p>${card.desc}</p>
      </div>
    `).join('');

    // ── Exposure ──
    document.querySelector('#exposure .section-label').textContent = data.exposure.sectionLabel;
    document.querySelector('#exposure .section-title').textContent = data.exposure.sectionTitle;
    document.querySelector('#exposure .section-subtitle').textContent = data.exposure.sectionSubtitle;

    document.querySelector('.biz-narrative').innerHTML = `
      <p>${data.exposure.narrativeP1}</p>
      <p>${data.exposure.narrativeP2}</p>
      <p>${data.exposure.narrativeP3}</p>
    `;

    document.querySelector('.biz-highlights').innerHTML = data.exposure.highlights.map((h, i) => `
      <div class="biz-highlight reveal reveal-delay-${i + 1}">
        <h4>${h.title}</h4>
        <p>${h.desc}</p>
      </div>
    `).join('');

    // ── Capabilities ──
    document.querySelector('#capabilities .section-label').textContent = data.capabilities.sectionLabel;
    document.querySelector('#capabilities .section-title').textContent = data.capabilities.sectionTitle;
    document.querySelector('#capabilities .section-subtitle').textContent = data.capabilities.sectionSubtitle;

    const capVisual = document.querySelector('.cap-visual');
    let capHtml = '';
    for (let i = 0; i < data.capabilities.items.length; i += 3) {
      capHtml += `<div class="cap-row reveal ${i > 0 ? 'reveal-delay-' + (i / 3) : ''}">`;
      for (let j = 0; j < 3 && i + j < data.capabilities.items.length; j++) {
        const item = data.capabilities.items[i + j];
        capHtml += `
          <div class="cap-item">
            <h3>${item.title}</h3>
            <div class="cap-bar-container">
              <div class="cap-bar" style=""></div>
            </div>
            <p>${item.desc}</p>
          </div>
        `;
      }
      capHtml += '</div>';
    }
    capVisual.innerHTML = capHtml;

    // Store target widths as data attributes for replay-safe animation
    const capItems = data.capabilities.items;
    capVisual.querySelectorAll('.cap-bar').forEach((bar, i) => {
      bar.dataset.targetWidth = capItems[i] ? capItems[i].progress : '80%';
    });

    // ── Vision ──
    document.querySelector('#vision .section-label').textContent = data.vision.sectionLabel;
    document.querySelector('#vision .section-title').textContent = data.vision.sectionTitle;
    document.querySelector('.vision-statement').innerHTML = data.vision.statement;

    document.querySelector('.vision-pillars').innerHTML = data.vision.pillars.map((p, i) => `
      <div class="vision-pillar reveal reveal-delay-${i + 1}">
        <div class="pillar-icon">${getIcon(p.icon)}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `).join('');

    const vq = document.querySelector('#vision [data-block="closing-quote"] p');
    if (vq) vq.textContent = data.vision.closingQuote;

    // ── Introduction ──
    document.querySelector('#introduction .section-label').textContent = data.introduction.sectionLabel;
    document.querySelector('#introduction .section-title').textContent = data.introduction.sectionTitle;
    document.querySelector('.intro-text').innerHTML = data.introduction.paragraphs.map(p => `<p>${p}</p>`).join('');
    document.querySelector('.intro-signature .name').textContent = data.introduction.signature;

    // ── Contact (full redesign) ──
    renderContact(data);

    console.log(`✦ Content loaded · Hero: ${heroVariant}`);
  } catch (err) {
    console.error('Content loader error:', err);
    // Safety fallback: always make page visible even if content load fails
    document.body.classList.add('page-loaded');
  }

  // Kick off animations after a paint frame
  requestAnimationFrame(() => {
    if (typeof window.initializeAnimations === 'function') {
      window.initializeAnimations();
    }

    // Wire up social QR buttons (after contact DOM is rendered)
    const qrModal = createQRModal();
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.social-icon-btn');
      if (!btn) return;
      qrModal.open(
        btn.dataset.platform,
        btn.dataset.label,
        btn.dataset.handle,
        btn.dataset.url
      );
    });

    // Cap bar replay: observe each bar and animate to its data-targetWidth
    const capBars = document.querySelectorAll('.cap-bar[data-target-width]');
    if (capBars.length) {
      const barReplayObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const bar = entry.target;
          if (entry.isIntersecting) {
            bar.style.transform = 'scaleX(0)';
            void bar.offsetWidth;
            requestAnimationFrame(() => bar.classList.add('animate'));
          } else {
            bar.classList.remove('animate');
          }
        });
      }, { threshold: 0.5 });
      capBars.forEach(bar => barReplayObserver.observe(bar));
    }
  });
})();
