/**
 * True WYSIWYG Visual Editor
 * Injected when URL contains ?edit=colors
 */

(function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('edit') !== 'colors') return;

  let currentTheme = 'orbital';
  try {
    const flags = JSON.parse(localStorage.getItem('deepika-portfolio-flags') || '{}');
    currentTheme = flags['hero-variant'] || 'orbital';
  } catch (e) {}

  let savedData = {};
  let currentElements = {};

  try {
    savedData = JSON.parse(localStorage.getItem('deepika-admin-theme-colors') || '{}');
    if (!savedData[currentTheme]) {
      savedData[currentTheme] = { vars: {}, elements: {} };
    } else if (!savedData[currentTheme].elements) {
      // Migrate legacy flat structure
      savedData[currentTheme] = { vars: savedData[currentTheme], elements: {} };
    }
    currentElements = savedData[currentTheme].elements || {};
  } catch (e) {
    savedData[currentTheme] = { vars: {}, elements: {} };
    currentElements = {};
  }

  // Inject UI Styles
  const style = document.createElement('style');
  style.textContent = `
    .ve-toolbar {
      position: fixed; top: 0; left: 0; right: 0;
      background: rgba(20, 18, 24, 0.95); backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.1); z-index: 999999;
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 24px; font-family: 'Inter', sans-serif; color: #e4e2ed;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .ve-toolbar h3 { margin: 0; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .ve-toolbar-hint { font-size: 12px; color: rgba(255,255,255,0.6); margin-left: 20px; }
    .ve-actions { display: flex; gap: 12px; }
    .ve-btn {
      background: rgba(255,255,255,0.1); border: none; color: #fff;
      padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: 0.2s;
    }
    .ve-btn:hover { background: rgba(255,255,255,0.2); }
    .ve-btn.primary { background: #C2727E; }
    .ve-btn.primary:hover { background: #b0666f; }
    
    .ve-hover-box {
      position: fixed; pointer-events: none; border: 2px dashed #C2727E;
      background: rgba(194,114,126,0.1); z-index: 999997; transition: all 0.05s ease-out;
      opacity: 0; border-radius: 4px;
    }

    .ve-popup {
      position: fixed; background: #1c1a22; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px; padding: 16px; z-index: 999998; box-shadow: 0 16px 40px rgba(0,0,0,0.6);
      font-family: 'Inter', sans-serif; color: #fff; width: 260px; display: none;
    }
    .ve-popup h4 { margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #e4e2ed; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;}
    .ve-popup-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .ve-popup-label { font-size: 12px; font-weight: 500; }
    
    .ve-color-wrap {
      width: 26px; height: 26px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2);
      position: relative; overflow: hidden; cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .ve-color-wrap input {
      position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer;
    }
    .ve-reset-btn {
      background: transparent; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 16px; display: none; margin-left: 6px;
    }
    .ve-reset-btn:hover { color: #e05c6e; }
    .ve-popup-row.overridden .ve-reset-btn { display: block; }
  `;
  document.head.appendChild(style);

  function renderLiveStyles() {
    let css = '';
    for (const [selector, rules] of Object.entries(currentElements)) {
      css += `${selector} {\n`;
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
  
  // Render initially
  renderLiveStyles();

  // Create UI
  const toolbar = document.createElement('div');
  toolbar.className = 've-toolbar';
  toolbar.innerHTML = `
    <h3>🔍 Element Inspector <span class="ve-toolbar-hint">Click any element to style it independently</span></h3>
    <div class="ve-actions">
      <button class="ve-btn" onclick="window.veResetAll()">Reset All Changes</button>
      <button class="ve-btn" onclick="window.veExit()">Exit</button>
      <button class="ve-btn primary" onclick="window.veSave()">Save & Publish</button>
    </div>
  `;
  document.body.appendChild(toolbar);

  const hoverBox = document.createElement('div');
  hoverBox.className = 've-hover-box';
  document.body.appendChild(hoverBox);

  const popup = document.createElement('div');
  popup.className = 've-popup';
  document.body.appendChild(popup);

  let activeElement = null;
  let activeSelector = '';
  let popupOpen = false;

  function getCssSelector(el) {
    if (el.tagName.toLowerCase() === 'html') return 'html';
    if (el.tagName.toLowerCase() === 'body') return 'body';
    if (el.id) return '#' + el.id;
    
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && el.tagName.toLowerCase() !== 'body') {
      let selector = el.tagName.toLowerCase();
      if (el.id) {
        selector += '#' + el.id;
        path.unshift(selector);
        break;
      } else {
        let sib = el, nth = 1;
        while (sib = sib.previousElementSibling) {
          if (sib.nodeType === Node.ELEMENT_NODE) nth++;
        }
        if (el.classList.length > 0) {
          selector += '.' + Array.from(el.classList).join('.');
        } else {
          selector += `:nth-child(${nth})`;
        }
      }
      path.unshift(selector);
      el = el.parentNode;
    }
    return path.join(' > ');
  }

  function rgbToHex(rgb) {
    if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return '#000000';
    if (rgb.startsWith('#')) return rgb;
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = rgb;
    return ctx.fillStyle;
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.ve-toolbar') || e.target.closest('.ve-popup')) return;
    
    e.preventDefault();
    e.stopPropagation();

    if (popupOpen) {
      popup.style.display = 'none';
      popupOpen = false;
      return;
    }

    if (activeElement) {
      activeSelector = getCssSelector(activeElement);
      openPopup(e, activeElement, activeSelector);
    }
  }, { capture: true });

  document.addEventListener('mousemove', (e) => {
    if (popupOpen) return;

    if (e.target.closest('.ve-toolbar') || e.target.closest('.ve-popup')) {
      hoverBox.style.opacity = '0';
      activeElement = null;
      return;
    }

    const target = e.target;
    if (target === document.body) {
      hoverBox.style.opacity = '0';
      activeElement = null;
      return;
    }

    activeElement = target;
    const rect = target.getBoundingClientRect();
    
    hoverBox.style.width = `${rect.width + 4}px`;
    hoverBox.style.height = `${rect.height + 4}px`;
    hoverBox.style.top = `${rect.top - 2}px`;
    hoverBox.style.left = `${rect.left - 2}px`;
    hoverBox.style.opacity = '1';
  });

  function openPopup(e, el, selector) {
    const comp = window.getComputedStyle(el);
    const overrides = currentElements[selector] || {};

    const props = [
      { key: 'color', label: 'Text Color', default: comp.color },
      { key: 'background-color', label: 'Background', default: comp.backgroundColor },
      { key: 'border-color', label: 'Border', default: comp.borderBottomColor }
    ];

    let html = `<h4>Edit Element</h4><div style="font-size:10px;color:#888;margin-bottom:12px;font-family:monospace;word-break:break-all;">${selector}</div>`;
    
    props.forEach(p => {
      const isOverridden = !!overrides[p.key];
      const display = overrides[p.key] || p.default;
      html += `
        <div class="ve-popup-row ${isOverridden ? 'overridden' : ''}" id="prow-${p.key}">
          <div class="ve-popup-label">${p.label}</div>
          <div style="display:flex;align-items:center;">
            <div class="ve-color-wrap" style="background: ${display}">
              <input type="color" value="${rgbToHex(display)}" oninput="window.veUpdateProp('${p.key}', this.value)">
            </div>
            <button class="ve-reset-btn" onclick="window.veResetProp('${p.key}')">&times;</button>
          </div>
        </div>
      `;
    });

    popup.innerHTML = html;
    popup.style.display = 'block';
    
    let pTop = e.clientY + 15;
    let pLeft = e.clientX + 15;
    const pRect = popup.getBoundingClientRect();
    if (pLeft + pRect.width > window.innerWidth) pLeft = window.innerWidth - pRect.width - 20;
    if (pTop + pRect.height > window.innerHeight) pTop = window.innerHeight - pRect.height - 20;
    
    popup.style.top = pTop + 'px';
    popup.style.left = pLeft + 'px';
    popupOpen = true;
  }

  window.veUpdateProp = function(prop, color) {
    if (!currentElements[activeSelector]) currentElements[activeSelector] = {};
    currentElements[activeSelector][prop] = color;
    
    const row = document.getElementById(`prow-${prop}`);
    if (row) {
      row.classList.add('overridden');
      row.querySelector('.ve-color-wrap').style.background = color;
    }
    renderLiveStyles();
  };

  window.veResetProp = function(prop) {
    if (currentElements[activeSelector]) {
      delete currentElements[activeSelector][prop];
      if (Object.keys(currentElements[activeSelector]).length === 0) {
        delete currentElements[activeSelector];
      }
    }
    
    const row = document.getElementById(`prow-${prop}`);
    if (row) {
      row.classList.remove('overridden');
      // Briefly hide popup to re-compute native color
      popup.style.display = 'none';
      renderLiveStyles();
      const comp = window.getComputedStyle(activeElement);
      const newDef = prop === 'color' ? comp.color : prop === 'background-color' ? comp.backgroundColor : comp.borderBottomColor;
      row.querySelector('.ve-color-wrap').style.background = newDef;
      row.querySelector('input').value = rgbToHex(newDef);
      popup.style.display = 'block';
    } else {
      renderLiveStyles();
    }
  };

  window.veResetAll = function() {
    if (!confirm('Clear all independent element overrides?')) return;
    currentElements = {};
    savedData[currentTheme].elements = {};
    renderLiveStyles();
    popup.style.display = 'none';
    popupOpen = false;
  };

  window.veSave = function() {
    try {
      savedData[currentTheme].elements = currentElements;
      localStorage.setItem('deepika-admin-theme-colors', JSON.stringify(savedData));
      alert('Changes saved! Return to the Admin Panel to publish.');
    } catch(e) {
      alert('Error saving changes.');
    }
  };

  window.veExit = function() {
    window.location.href = 'admin/index.html';
  };

})();
