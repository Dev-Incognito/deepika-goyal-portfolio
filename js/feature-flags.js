/* ============================================
   FEATURE FLAGS SYSTEM
   Toggles for every element on the portfolio
   ============================================ */

(function() {
  'use strict';

  const STORAGE_KEY = 'astha-portfolio-flags';

  // Flag-to-DOM mapping
  const FLAG_MAP = {
    // Global
    'gift-wrap':         { action: 'hide', selector: '#giftWrap' },
    'lenis-scroll':      { action: 'js-flag' },
    'custom-cursor':     { action: 'js-flag' },
    'animations':        { action: 'class-toggle', target: 'body', className: 'no-animations' },
    'scroll-progress':   { action: 'hide', selector: '.scroll-progress' },
    'navigation':        { action: 'hide', selector: '#mainNav' },
    'back-to-top':       { action: 'hide', selector: '#backToTop' },
    'footer':            { action: 'hide', selector: '.page-footer' },

    // Hero
    'hero-section':      { action: 'hide', selector: '#hero' },
    'hero-name':         { action: 'hide', selector: '.hero-name, .hero-cin-name, .hero-gal-name, .hero-pook-name, .hero-mod-name, .hero-pro-name, .hero-art-name' },
    'hero-tagline':      { action: 'hide', selector: '.hero-tagline, .hero-cin-tagline-small, .hero-gal-tagline, .hero-pook-tagline, .hero-mod-marquee-top, .hero-mod-marquee-bottom, .hero-pro-tagline, .hero-art-tagline' },
    'hero-statement':    { action: 'hide', selector: '.hero-statement, .hero-cin-statement, .hero-gal-statement, .hero-pook-statement, .hero-mod-statement, .hero-pro-statement, .hero-art-statement' },
    'hero-portrait':     { action: 'hide', selector: '.hero-portrait, .hero-cin-portrait-bg, .hero-gal-portrait-wrap, .hero-pook-portrait, .mod-cell-2, .hero-pro-img-wrap, .hero-art-portrait' },
    'hero-scroll-btn':   { action: 'hide', selector: '.hero-scroll, .hero-cin-btn, .hero-gal-btn, .hero-pook-btn, .hero-mod-btn, .hero-pro-btn, .hero-art-btn' },
    'hero-bg-blobs':     { action: 'hide', selector: '.hero-bg-element, .hero-cin-grain, .hero-cin-scanline, .hero-gal-bg, .hero-pook-bg, .hero-pro-meta, .hero-pro-divider, .hero-art-canvas', all: true },

    // Sections
    'section-brand':          { action: 'hide', selector: '#brand' },
    'section-strengths':      { action: 'hide', selector: '#strengths' },
    'section-differentiators':{ action: 'hide', selector: '#differentiators' },
    'section-exposure':       { action: 'hide', selector: '#exposure' },
    'section-capabilities':   { action: 'hide', selector: '#capabilities' },
    'section-vision':         { action: 'hide', selector: '#vision' },
    'section-introduction':   { action: 'hide', selector: '#introduction' },
    'section-contact':        { action: 'hide', selector: '#contact' },

    // Brand elements
    'brand-quote':       { action: 'hide', selector: '.brand-quote' },
    'brand-values':      { action: 'hide', selector: '.brand-values' },
    'brand-philosophy':  { action: 'hide', selector: '#brand [data-block="philosophy"]' },

    // Strengths elements
    'strengths-timeline':{ action: 'class-toggle', target: '.exp-timeline', className: 'no-timeline-line' },
    'strengths-tags':    { action: 'hide', selector: '.exp-skills', all: true },

    // Capabilities elements
    'cap-bars':          { action: 'hide', selector: '.cap-bar-container', all: true },
    'cap-descriptions':  { action: 'hide', selector: '.cap-item p', all: true },

    // Vision elements
    'vision-pillars':       { action: 'hide', selector: '.vision-pillars' },
    'vision-closing-quote': { action: 'hide', selector: '#vision [data-block="closing-quote"]' },

    // Contact elements
    'contact-portrait':    { action: 'hide', selector: '.contact-avatar' },
    'contact-info':        { action: 'hide', selector: '.contact-details-list' },
    'contact-social':      { action: 'hide', selector: '.contact-social-panel' },
    'contact-references':  { action: 'hide', selector: '#contact [data-block="references"]' },

    // Visual effects (these use JS-level flags, read by script.js)
    'magnetic-hover':   { action: 'js-flag' },
    'portrait-tilt':    { action: 'js-flag' },
    'parallax-bg':      { action: 'js-flag' },
    'dividers':         { action: 'hide', selector: '.divider', all: true },
    'section-labels':   { action: 'hide', selector: '.section-label', all: true },
  };

  // State
  let defaultFlags = {};
  let flags = {};

  // Fetch defaults
  async function loadDefaultFlags() {
    try {
      const response = await fetch('data/feature-flags.json');
      if (response.ok) {
        defaultFlags = await response.json();
      }
    } catch(e) {
      console.warn('Failed to load default feature flags. Falling back to internal defaults.');
    }
  }

  // Load from localStorage
  function loadFlags() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        flags = { ...defaultFlags, ...JSON.parse(stored) };
      } else {
        flags = { ...defaultFlags };
      }
    } catch(e) {
      flags = { ...defaultFlags };
    }
  }

  // Save to localStorage
  function saveFlags() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    } catch(e) {}
  }

  // Apply a single flag
  function applyFlag(flagName, isEnabled) {
    const mapping = FLAG_MAP[flagName];
    if (!mapping) return;

    if (mapping.action === 'hide') {
      if (mapping.all) {
        document.querySelectorAll(mapping.selector).forEach(el => {
          el.style.display = isEnabled ? '' : 'none';
        });
      } else {
        const el = document.querySelector(mapping.selector);
        if (el) el.style.display = isEnabled ? '' : 'none';
      }
    }
    else if (mapping.action === 'class-toggle') {
      const target = mapping.target === 'body'
        ? document.body
        : document.querySelector(mapping.target);
      if (target) {
        if (isEnabled) {
          target.classList.remove(mapping.className);
        } else {
          target.classList.add(mapping.className);
        }
      }
    }
    else if (mapping.action === 'js-flag') {
      window.__featureFlags = window.__featureFlags || {};
      window.__featureFlags[flagName] = isEnabled;
    }
  }


  // Apply all flags
  function applyAllFlags() {
    for (const flagName in FLAG_MAP) {
      const isEnabled = flags[flagName] !== false; // default true if missing
      applyFlag(flagName, isEnabled);
    }
  }

  // Init
  async function init() {
    await loadDefaultFlags();
    loadFlags();

    // Initialize JS flags
    window.__featureFlags = window.__featureFlags || {};
    for (const flagName in FLAG_MAP) {
      if (FLAG_MAP[flagName].action === 'js-flag') {
        window.__featureFlags[flagName] = flags[flagName] !== false;
      }
    }

    // Apply flags after a short delay so DOM is ready
    requestAnimationFrame(() => {
      applyAllFlags();
      
      // Setup gift wrap interaction
      const giftWrap = document.getElementById('giftWrap');
      if (giftWrap && giftWrap.style.display !== 'none') {
        // Prevent scrolling while wrapped
        document.body.style.overflow = 'hidden';
        giftWrap.addEventListener('click', () => {
          giftWrap.classList.add('unwrapping');
          if (typeof confetti !== 'undefined' && flags['confetti-effect'] !== false) {
            const duration = 3000; const end = Date.now() + duration;
            (function frame() {
              confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#e94560', '#C2727E', '#ffffff'] });
              confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#e94560', '#C2727E', '#ffffff'] });
              if (Date.now() < end) requestAnimationFrame(frame);
            }());
          }
          // Allow scrolling again and hide element after animation
          setTimeout(() => {
            document.body.style.overflow = '';
            giftWrap.style.display = 'none';
          }, 1500);
        }, { once: true });
      }
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
