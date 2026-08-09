/* ============================================
   DEEPIKA GOYAL - Personal Brand Portfolio
   Interactive Behaviors & Animations
   ============================================ */

// Expose initializeAnimations globally so content-loader can call it
// after dynamic content is injected into the DOM.
window.initializeAnimations = function() {

  const f = window.__featureFlags || {};

  // ---------- 1. Lenis Smooth Scroll ----------
  if (f['lenis-scroll'] !== false && typeof Lenis !== 'undefined' && !window._lenisInit) {
    window._lenisInit = true;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }



  // ---------- 3. GSAP ScrollTrigger (Premium Reveal) ----------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    document.querySelectorAll('.reveal:not(.gsap-observed)').forEach(el => {
      el.classList.add('gsap-observed');
      // Remove any CSS transitions so GSAP can take over smoothly
      el.style.transition = 'none';
      gsap.fromTo(el, 
        { y: 60, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  } else {
    // Fallback Intersection Observer if GSAP fails to load
    const revealElements = document.querySelectorAll('.reveal:not(.observed)');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(el => { el.classList.add('observed'); revealObserver.observe(el); });
  }

  // ---------- 6. Premium Text Animations ----------
  const heroNameEl = document.querySelector('.hero-name, .hero-cin-name, .hero-pro-name, .hero-pook-name, .hero-mod-name, .hero-gal-name, .hero-art-name');
  if (heroNameEl && !window._textAnimInit) {
    window._textAnimInit = true;
    
    // Check which theme is active
    const theme = Array.from(document.body.classList).find(c => c.startsWith('theme-')) || 'theme-orbital';
    
    if (theme === 'theme-artistic' && typeof Blotter !== 'undefined') {
      // Blotter.js Liquid Distortion
      const text = heroNameEl.textContent.replace(/\s+/g, ' ').trim();
      const material = new Blotter.LiquidDistortMaterial();
      material.uniforms.uSpeed.value = 0.3;
      material.uniforms.uVolatility.value = 0.05;
      
      // Calculate font size
      const computedStyle = window.getComputedStyle(heroNameEl);
      const fontSize = parseFloat(computedStyle.fontSize) || 80;
      
      const blotterText = new Blotter.Text(text, {
        family: "'Inter', sans-serif",
        size: fontSize,
        fill: "#e94560",
        paddingLeft: 40,
        paddingRight: 40
      });
      const blotter = new Blotter(material, { texts: blotterText });
      const scope = blotter.forText(blotterText);
      heroNameEl.innerHTML = '';
      scope.appendTo(heroNameEl);
      
      heroNameEl.addEventListener('mouseenter', () => {
        gsap.to(material.uniforms.uVolatility, { value: 0.15, duration: 0.5 });
      });
      heroNameEl.addEventListener('mouseleave', () => {
        gsap.to(material.uniforms.uVolatility, { value: 0.05, duration: 1.5 });
      });
      
    } else if ((theme === 'theme-modern' || theme === 'theme-galaxy') && typeof baffle !== 'undefined') {
      // Baffle.js Glitch
      let targets = heroNameEl.querySelectorAll('.baffle-target');
      if (targets.length === 0) targets = heroNameEl;
      const b = baffle(targets, {
        characters: '█▓▒░/|\\-<>+*^[]{}',
        speed: 75
      }).start();
      setTimeout(() => b.reveal(1500), 500);
      
      heroNameEl.addEventListener('mouseenter', () => {
        b.start();
        setTimeout(() => b.reveal(1000), 100);
      });
      
    } else if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
      // SplitType + GSAP Premium Reveal
      const split = new SplitType(heroNameEl, { types: 'chars, words' });
      gsap.from(split.chars, {
        opacity: 0,
        y: 60,
        rotateX: -90,
        stagger: 0.05,
        duration: 1.2,
        ease: "back.out(1.7)"
      });
    }
  }

  // ---------- 5. Premium Typing Animation (TypeIt) ----------
  if (typeof TypeIt !== 'undefined' && !window._typeItInit) {
    const taglineEl = document.querySelector('.hero-tagline, .hero-cin-tagline-small, .hero-pro-tagline');
    if (taglineEl && taglineEl.textContent.trim().length > 0) {
      window._typeItInit = true;
      // Extract text and hide original
      const originalHTML = taglineEl.innerHTML;
      taglineEl.innerHTML = '';
      new TypeIt(taglineEl, {
        strings: originalHTML,
        speed: 50,
        html: true,
        cursor: false,
        waitUntilVisible: true
      }).go();
    }
  }

  // ---------- 7. Premium Typography Animations (ScrollTrigger) ----------
  if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !window._minimalTextAnimInit) {
    window._minimalTextAnimInit = true;
    
    // Word-level blur reveal for paragraphs and titles
    const textBlocks = document.querySelectorAll(`
      .section-title, .section-subtitle, .intro-text p, 
      .brand-quote, .biz-narrative p, .contact-cta-text, 
      .vision-statement p, .contact-references p, 
      .exp-description, .diff-card p, .cap-item p, 
      .biz-highlight p, .vision-pillar p,
      .value-card h3, .exp-role, .exp-company, .diff-card h3,
      .biz-highlight h4, .cap-item h3, .vision-pillar h3
    `.replace(/\s+/g, ' '));
    textBlocks.forEach(block => {
      if (block.classList.contains('split-applied') || block.textContent.trim().length === 0) return;
      block.classList.add('split-applied');
      
      const split = new SplitType(block, { types: 'lines, words' });
      gsap.from(split.words, {
        scrollTrigger: {
          trigger: block,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 15,
        duration: 0.8,
        stagger: 0.015,
        ease: "power2.out"
      });
    });

    // Character-level slide reveal for section labels
    const labels = document.querySelectorAll('.section-label');
    labels.forEach(label => {
      if (label.classList.contains('split-applied') || label.textContent.trim().length === 0) return;
      label.classList.add('split-applied');
      
      const split = new SplitType(label, { types: 'chars' });
      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: label,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: -10,
        duration: 0.6,
        stagger: 0.04,
        ease: "power2.out"
      });
    });
  }

  // ---------- Diff numbers - replay ----------
  const diffNumbers = document.querySelectorAll('.diff-number:not(.diff-observed)');
  const diffObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('count-in');
      } else {
        entry.target.classList.remove('count-in');
      }
    });
  }, { threshold: 0.3 });

  diffNumbers.forEach(num => {
    num.classList.add('diff-observed');
    diffObserver.observe(num);
  });

  // ---------- Standalone cap bars (not inside reveal) ----------
  const standaloneBars = document.querySelectorAll('.cap-bar:not(.bar-observed)');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        void entry.target.offsetWidth;
        setTimeout(() => entry.target.classList.add('animate'), 200);
      } else {
        entry.target.classList.remove('animate');
      }
    });
  }, { threshold: 0.5 });

  standaloneBars.forEach(bar => {
    bar.classList.add('bar-observed');
    barObserver.observe(bar);
  });

  // ---------- 4. Premium 3D Tilt Hover ----------
  if (typeof VanillaTilt !== 'undefined' && window.__featureFlags && window.__featureFlags['magnetic-hover'] !== false) {
    const tiltElements = document.querySelectorAll('.value-card:not(.tilt-applied), .diff-card:not(.tilt-applied), .cap-item:not(.tilt-applied), .vision-pillar:not(.tilt-applied), .biz-highlight:not(.tilt-applied), .hero-pro-img-wrap:not(.tilt-applied), .hero-art-portrait:not(.tilt-applied), .contact-avatar:not(.tilt-applied)');
    tiltElements.forEach(el => {
      el.classList.add('tilt-applied');
      VanillaTilt.init(el, {
        max: 8,
        speed: 400,
        glare: false,
        scale: 1.02
      });
    });
  }

  // ---------- Text data-text for section titles ----------
  document.querySelectorAll('.section-title').forEach(title => {
    title.setAttribute('data-text', title.textContent);
  });
};

document.addEventListener('DOMContentLoaded', () => {

  // page-loaded is now added by content-loader.js after theme + content is rendered
  // This prevents flash of unstyled content

  // ---------- Navigation Scroll Effect ----------
  const nav = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 60);
    backToTop.classList.toggle('visible', scrollY > 500);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---------- Back to Top ----------
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Mobile Navigation ----------
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // ---------- Smooth Anchor Scrolling (event delegation) ----------
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });

  // ---------- Active Nav Link Highlighting ----------
  const sections = document.querySelectorAll('section[id]');
  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    const navLinks = document.querySelectorAll('.nav-links a');
    sections.forEach(section => {
      const id = section.getAttribute('id');
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--rose-gold)' : '';
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ---------- Parallax Background Blobs ----------
  const heroBgElements = document.querySelectorAll('.hero-bg-element');
  let ticking = false;
  const handleParallax = () => {
    if (window.__featureFlags && window.__featureFlags['parallax-bg'] === false) {
      heroBgElements.forEach(el => el.style.transform = '');
      return;
    }
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.5) {
        heroBgElements.forEach((el, i) => {
          el.style.transform = `translateY(${scrollY * (i + 1) * 0.12}px)`;
        });
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', handleParallax, { passive: true });

  // ---------- Portrait Parallax Tilt ----------
  const portraitFrame = document.querySelector('.portrait-frame');
  if (portraitFrame) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      if (window.__featureFlags && window.__featureFlags['portrait-tilt'] === false) return;
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      portraitFrame.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    hero.addEventListener('mouseleave', () => { portraitFrame.style.transform = ''; });
  }

  // ---------- Scroll Progress Bar ----------
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  const updateProgress = () => {
    const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = progress + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ---------- Image Loading Priority ----------
  const portrait = document.querySelector('.portrait-img');
  if (portrait) portrait.loading = 'eager';
  document.querySelectorAll('img:not(.portrait-img)').forEach(img => img.loading = 'lazy');

});

// ---------- Global Functions ----------
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

function closeMobileNav() {
  document.getElementById('menuBtn').classList.remove('active');
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}
