// ==========================================
// AD STUDIO - Main Application
// ==========================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// AI-generated canvas decorations (rendered on canvas, exported with ad)
let canvasDecorations = [];

// Get layer overrides from UI (opacity > 0 = enabled)
function getLayerOverrides() {
  const bgOpacity = parseFloat(document.getElementById('bgLayerOpacity')?.value) || 1;
  const textOpacity = parseFloat(document.getElementById('textLayerOpacity')?.value) || 1;
  const fgOpacity = parseFloat(document.getElementById('fgLayerOpacity')?.value) || 1;

  return {
    background: {
      opacity: bgOpacity,
      enabled: bgOpacity > 0
    },
    text: {
      opacity: textOpacity,
      enabled: textOpacity > 0
    },
    foreground: {
      opacity: fgOpacity,
      enabled: fgOpacity > 0
    }
  };
}

// ==========================================
// DEFAULT SYSTEM PROMPT
// ==========================================

const DEFAULT_SYSTEM_PROMPT = `You are an expert performance ad copywriter. Your copy is emotional, not rational. Research shows emotional ads succeed 2x more than feature-focused ones (31% vs 16%).

## Core Principle: Emotion Over Features
- Don't say what the product does — say how it makes them FEEL
- Speak to identity: "Who am I if I use this?"
- Tap into desires (freedom, control, status) and fears (missing out, falling behind, wasting time)
- Features inform, emotions convert

## The Four Voices (Visual Hierarchy)
1. INTRO (Whisper) — Identity qualifier. Makes the right person stop and self-select. Examples: "For Creators", "Finally", "Tired of X?"
2. HEADLINE (Shout) — Emotional hook. The promise, the dream. Two lines that hit hard. This is 50% of visual weight.
3. OFFER (Speak) — Clear value, low friction. What they get, why now. Action-oriented.
4. LEGEND (Murmur) — Trust signal. Removes anxiety. "No credit card", "Cancel anytime", social proof.

## Copy Rules
- Lead with emotional outcomes, not features
- Use contrast: "More X, Less Y" / "Do X, Without Y"
- Numbers build credibility (100GB, 10,000+ users, 14 days free)
- Short, punchy words — no fluff, no jargon
- Intros can be questions or identity labels
- Headlines must be statements that evoke feeling
- Offers answer: "What do I get?" and "What's the catch?"
- Legends remove the last objection

## Context
- Platforms: Reddit, social feeds
- Scan time: 0.6 seconds — copy must resolve instantly
- Goal: Stop scroll → emotional connection → action`;

function getSystemPrompt() {
  const el = document.getElementById('systemPrompt');
  return el?.value?.trim() || DEFAULT_SYSTEM_PROMPT;
}

function updateSystemPromptStyle() {
  const el = document.getElementById('systemPrompt');
  if (el) {
    const isModified = el.value.trim() !== DEFAULT_SYSTEM_PROMPT.trim();
    el.classList.toggle('modified', isModified);
  }
}

function resetSystemPrompt() {
  const el = document.getElementById('systemPrompt');
  if (el) {
    el.value = DEFAULT_SYSTEM_PROMPT;
    updateSystemPromptStyle();
    saveAppStateDebounced();
  }
}

// Initialize system prompt and add change listener
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('systemPrompt');
  if (el) {
    if (!el.value) {
      el.value = DEFAULT_SYSTEM_PROMPT;
    }
    updateSystemPromptStyle();
    el.addEventListener('input', () => {
      updateSystemPromptStyle();
      saveAppStateDebounced();
    });
  }
});

// ==========================================
// FONT PRESETS
// ==========================================

// Apply preset to UI when font changes (only styling, not text content or margins)
function applyFontPreset(fontFamily) {
  const preset = CONFIG.fontPresets?.[fontFamily];
  if (!preset) return;

  ['intro', 'headline', 'offer', 'legend'].forEach(el => {
    if (!preset[el]) return;
    const p = preset[el];
    if (p.size !== undefined) {
      const sizeEl = document.getElementById(`${el}Size`);
      if (sizeEl) sizeEl.value = p.size;
    }
    if (p.weight !== undefined) {
      const weightEl = document.getElementById(`${el}Weight`);
      if (weightEl) weightEl.value = p.weight;
    }
    if (p.transform !== undefined) {
      const transformEl = document.getElementById(`${el}Transform`);
      if (transformEl) transformEl.value = p.transform;
    }
    if (el === 'headline' && p.lineHeight !== undefined) {
      const lhEl = document.getElementById('headlineLineHeight');
      if (lhEl) lhEl.value = p.lineHeight;
    }
  });
}

// ==========================================
// TAB NAVIGATION
// ==========================================

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tabId}-tab`).classList.add('active');

    // Update export button based on active tab
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      if (tabId === 'export') {
        exportBtn.textContent = 'Export ZIP';
        exportBtn.onclick = exportAllAds;
      } else {
        exportBtn.textContent = 'Export PNG';
        exportBtn.onclick = downloadAd;
      }
    }

    // Refresh Export tab when switching to it
    if (tabId === 'export') {
      renderVariationCards();
      renderPreview();
      renderVersions();
    }
  });
});

// ==========================================
// SECTION TOGGLES
// ==========================================

function toggleSection(header) {
  header.parentElement.classList.toggle('collapsed');
}

// ==========================================
// ELEMENT SETTINGS TOGGLES
// ==========================================

function toggleElementSettings(btn) {
  const card = btn.closest('.element-card');
  const settings = card.querySelector('.element-settings');
  settings.classList.toggle('collapsed');
  btn.classList.toggle('active');
}

// Clear element color override (reset to inherit from global)
function clearElementColor(elementId) {
  const colorText = document.getElementById(`${elementId}Color`);
  const colorPicker = document.getElementById(`${elementId}ColorPicker`);

  if (colorText) colorText.value = '';
  if (colorPicker) colorPicker.value = '#FFFFFF';

  updateColorSwatchState(elementId);
  updateElementOverrideIndicators();
  generateAd();
  saveAppStateDebounced();
}

// Update color swatch empty state based on whether color is set
function updateColorSwatchState(elementId) {
  const colorText = document.getElementById(`${elementId}Color`);
  const swatchWrap = document.getElementById(`${elementId}ColorWrap`);

  if (!swatchWrap) return;

  const val = colorText?.value;
  // Has color if hex or rgba value
  const hasColor = val && (/^#[0-9A-Fa-f]{6}$/i.test(val) || /^rgba?\(/i.test(val));
  swatchWrap.classList.toggle('empty', !hasColor);
}

// Update element override indicators (blue dot when element has typography overrides)
function updateElementOverrideIndicators() {
  ['intro', 'headline', 'offer', 'legend'].forEach(elId => {
    const indicator = document.getElementById(`${elId}OverrideIndicator`);
    if (!indicator) return;

    const fontVal = document.getElementById(`${elId}Font`)?.value;
    const colorVal = document.getElementById(`${elId}Color`)?.value;

    // Check for any typography override (font or color)
    const hasOverride =
      (fontVal && fontVal !== '') ||
      (colorVal && (/^#[0-9A-Fa-f]{6}$/i.test(colorVal) || /^rgba?\(/i.test(colorVal)));

    indicator.classList.toggle('active', hasOverride);
  });
}

// Wire up element color pickers (clearable pattern)
function setupElementColorPickers() {
  ['intro', 'headline', 'offer', 'legend'].forEach(elId => {
    const colorPicker = document.getElementById(`${elId}ColorPicker`);
    const colorText = document.getElementById(`${elId}Color`);

    if (colorPicker && colorText) {
      // Color picker updates text and swatch state
      colorPicker.addEventListener('input', () => {
        colorText.value = colorPicker.value.toUpperCase();
        updateColorSwatchState(elId);
        updateElementOverrideIndicators();
        generateAd();
        saveAppStateDebounced();
      });

      // Text input updates picker and swatch state
      // Supports hex (#FFFFFF) and rgba formats
      colorText.addEventListener('input', () => {
        let val = colorText.value;
        // Uppercase hex values only
        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
          val = val.toUpperCase();
          colorText.value = val;
          if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            colorPicker.value = val;
          }
        }
        updateColorSwatchState(elId);
        updateElementOverrideIndicators();
        generateAd();
        saveAppStateDebounced();
      });
    }

    // Wire up font select
    const fontSelect = document.getElementById(`${elId}Font`);
    if (fontSelect) {
      fontSelect.addEventListener('change', () => {
        updateElementOverrideIndicators();
        generateAd();
        saveAppStateDebounced();
      });
    }

    // Initialize swatch state
    updateColorSwatchState(elId);
  });

  // Initialize override indicators
  updateElementOverrideIndicators();
}

// Wire up layer controls (opacity only - opacity 0 = disabled)
// Uses requestAnimationFrame to throttle renders for smooth slider dragging
let layerRafPending = false;
function setupLayerControls() {
  ['bgLayerOpacity', 'textLayerOpacity', 'fgLayerOpacity'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        const valEl = document.getElementById(`${id}Val`);
        if (valEl) valEl.textContent = Math.round(parseFloat(el.value) * 100) + '%';

        // Throttle generateAd calls using requestAnimationFrame
        if (!layerRafPending) {
          layerRafPending = true;
          requestAnimationFrame(() => {
            generateAd();
            layerRafPending = false;
          });
        }
        saveAppStateDebounced();
      });
    }
  });
}

// Reset layer opacities to 100% and update UI
function resetLayerOpacities() {
  ['bgLayerOpacity', 'textLayerOpacity', 'fgLayerOpacity'].forEach(id => {
    const el = document.getElementById(id);
    const valEl = document.getElementById(`${id}Val`);
    if (el) {
      el.value = 1;
      if (valEl) valEl.textContent = '100%';
    }
  });
}

// Show/hide Layers card based on whether there are AI canvas decorations
function updateLayersCardVisibility() {
  const layersCard = document.querySelector('.layers-card');
  if (!layersCard) return;

  const hasDecorations = canvasDecorations.length > 0;
  layersCard.classList.toggle('hidden', !hasDecorations);
}

// ==========================================
// CONFIG CODE BLOCK
// ==========================================

function updateConfigCode() {
  const q = s => `'${s}'`;
  const n = v => v;

  const width = parseInt(document.getElementById('width')?.value) || 1200;
  const height = parseInt(document.getElementById('height')?.value) || 628;
  const bgColor = document.getElementById('bgColor')?.value || '#0033FF';
  const textColor = document.getElementById('textColor')?.value || '#FFFFFF';
  const fontFamily = document.getElementById('fontFamily')?.value || 'Inter';
  const fontScale = parseFloat(document.getElementById('fontScale')?.value) || 1;
  const letterSpacing = parseFloat(document.getElementById('letterSpacing')?.value) || 0;
  const opticalYOffset = parseFloat(document.getElementById('opticalYOffset')?.value) || 0.05;

  const intro = {
    text: document.getElementById('introText')?.value || '',
    size: parseFloat(document.getElementById('introSize')?.value) || 0.042,
    weight: document.getElementById('introWeight')?.value || '500',
    transform: document.getElementById('introTransform')?.value || 'uppercase',
    marginTop: parseFloat(document.getElementById('introMarginTop')?.value) || 0
  };

  const headline = {
    text1: document.getElementById('headlineText1')?.value || '',
    text2: document.getElementById('headlineText2')?.value || '',
    size: parseFloat(document.getElementById('headlineSize')?.value) || 0.125,
    weight: document.getElementById('headlineWeight')?.value || '700',
    transform: document.getElementById('headlineTransform')?.value || 'none',
    marginTop: parseFloat(document.getElementById('headlineMarginTop')?.value) || 0.015,
    lineHeight: parseFloat(document.getElementById('headlineLineHeight')?.value) || 1.0
  };

  const offer = {
    text: document.getElementById('offerText')?.value || '',
    size: parseFloat(document.getElementById('offerSize')?.value) || 0.065,
    weight: document.getElementById('offerWeight')?.value || '600',
    transform: document.getElementById('offerTransform')?.value || 'none',
    marginTop: parseFloat(document.getElementById('offerMarginTop')?.value) || 0.07
  };

  const legend = {
    text: document.getElementById('legendText')?.value || '',
    size: parseFloat(document.getElementById('legendSize')?.value) || 0.028,
    weight: document.getElementById('legendWeight')?.value || '400',
    transform: document.getElementById('legendTransform')?.value || 'none',
    marginTop: parseFloat(document.getElementById('legendMarginTop')?.value) || 0.025
  };

  // Get font presets from CONFIG
  const fontPresetsStr = JSON.stringify(CONFIG.fontPresets, null, 4)
    .replace(/"([^"]+)":/g, "'$1':") // keys with single quotes
    .replace(/"/g, "'"); // values with single quotes

  const output = `// ==========================================
// AD STUDIO - Configuration
// ==========================================
//
// Typography Philosophy:
// - Intro: Whisper — qualifier, context, identity
// - Headline: Shout — emotional hook, the promise
// - Offer: Speak — clear value, call to action
// - Legend: Murmur — trust signal, friction removal
//
// Sizing uses a ~1.6x modular scale for visual harmony
// Spacing creates intentional groupings and breathing room

const CONFIG = {
  canvas: {
    width: ${n(width)},
    height: ${n(height)}
  },

  colors: {
    background: ${q(bgColor)},
    text: ${q(textColor)}
  },

  typography: {
    fontFamily: ${q(fontFamily)},
    fontScale: ${n(fontScale)},
    letterSpacing: ${n(letterSpacing)},
    opticalYOffset: ${n(opticalYOffset)}
  },

  elements: {
    intro: {
      text: ${q(intro.text)},
      size: ${n(intro.size)},
      weight: ${q(intro.weight)},
      transform: ${q(intro.transform)},
      marginTop: ${n(intro.marginTop)}
    },
    headline: {
      text: [${q(headline.text1)}, ${q(headline.text2)}],
      size: ${n(headline.size)},
      weight: ${q(headline.weight)},
      transform: ${q(headline.transform)},
      marginTop: ${n(headline.marginTop)},
      lineHeight: ${n(headline.lineHeight)}
    },
    offer: {
      text: ${q(offer.text)},
      size: ${n(offer.size)},
      weight: ${q(offer.weight)},
      transform: ${q(offer.transform)},
      marginTop: ${n(offer.marginTop)}
    },
    legend: {
      text: ${q(legend.text)},
      size: ${n(legend.size)},
      weight: ${q(legend.weight)},
      transform: ${q(legend.transform)},
      marginTop: ${n(legend.marginTop)}
    }
  },

  // Font presets optimized for each typeface's characteristics
  fontPresets: ${fontPresetsStr.split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')}
};`;

  const codeEl = document.getElementById('configCode');
  if (codeEl) {
    codeEl.textContent = output;
  }
}

function copyConfigCode() {
  const codeEl = document.getElementById('configCode');
  if (codeEl && codeEl.textContent) {
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      const btn = codeEl.nextElementSibling;
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Copied';
        setTimeout(() => { btn.innerHTML = originalText; }, 1500);
      }
    });
  }
}

// ==========================================
// SIZE PRESETS
// ==========================================

const SIZE_PRESETS = {
  reddit: [
    { w: 1200, h: 628, label: 'Feed', ratio: '1.91:1' },
    { w: 1080, h: 1080, label: 'Square', ratio: '1:1' },
    { w: 1200, h: 675, label: 'Card', ratio: '16:9' }
  ],
  facebook: [
    { w: 1200, h: 628, label: 'Feed', ratio: '1.91:1' },
    { w: 1080, h: 1080, label: 'Square', ratio: '1:1' },
    { w: 1080, h: 1350, label: 'Portrait', ratio: '4:5' },
    { w: 1080, h: 1920, label: 'Story', ratio: '9:16' }
  ],
  instagram: [
    { w: 1080, h: 1080, label: 'Square', ratio: '1:1' },
    { w: 1080, h: 1350, label: 'Portrait', ratio: '4:5' },
    { w: 1080, h: 1920, label: 'Story/Reel', ratio: '9:16' },
    { w: 1200, h: 628, label: 'Landscape', ratio: '1.91:1' }
  ],
  linkedin: [
    { w: 1200, h: 627, label: 'Feed', ratio: '1.91:1' },
    { w: 1080, h: 1080, label: 'Square', ratio: '1:1' },
    { w: 1080, h: 1350, label: 'Portrait', ratio: '4:5' }
  ],
  x: [
    { w: 1200, h: 628, label: 'Feed', ratio: '1.91:1' },
    { w: 1080, h: 1080, label: 'Square', ratio: '1:1' },
    { w: 1600, h: 900, label: 'Video', ratio: '16:9' }
  ],
  tiktok: [
    { w: 1080, h: 1920, label: 'Video', ratio: '9:16' },
    { w: 1080, h: 1080, label: 'Square', ratio: '1:1' }
  ],
  youtube: [
    { w: 1920, h: 1080, label: 'Video', ratio: '16:9' },
    { w: 1080, h: 1920, label: 'Shorts', ratio: '9:16' },
    { w: 1280, h: 720, label: 'Thumbnail', ratio: '16:9' }
  ],
  display: [
    { w: 300, h: 250, label: 'Medium Rectangle', ratio: '' },
    { w: 336, h: 280, label: 'Large Rectangle', ratio: '' },
    { w: 728, h: 90, label: 'Leaderboard', ratio: '' },
    { w: 300, h: 600, label: 'Half Page', ratio: '' },
    { w: 160, h: 600, label: 'Skyscraper', ratio: '' },
    { w: 320, h: 100, label: 'Mobile Banner', ratio: '' }
  ]
};

function renderSizeList(platform) {
  const list = document.getElementById('sizeList');
  if (!list) return;

  const sizes = SIZE_PRESETS[platform] || SIZE_PRESETS.reddit;
  const currentW = parseInt(document.getElementById('width')?.value) || 0;
  const currentH = parseInt(document.getElementById('height')?.value) || 0;

  list.innerHTML = sizes.map(size => {
    const isActive = size.w === currentW && size.h === currentH;
    const ratioText = size.ratio ? ` · ${size.ratio}` : '';
    return `
      <button class="size-btn${isActive ? ' active' : ''}" data-w="${size.w}" data-h="${size.h}">
        <span class="size-preview" style="aspect-ratio: ${size.w}/${size.h};"></span>
        <span class="size-info">
          <span class="size-dims">${size.w} × ${size.h}</span>
          <span class="size-label">${size.label}${ratioText}</span>
        </span>
      </button>
    `;
  }).join('');

  // Bind click events
  list.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      list.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('width').value = btn.dataset.w;
      document.getElementById('height').value = btn.dataset.h;
      generateAd();
    });
  });
}

// Platform dropdown change
document.getElementById('sizePlatform')?.addEventListener('change', (e) => {
  renderSizeList(e.target.value);
});

// ==========================================
// COLOR SYNC
// ==========================================

function syncColors(pickerId, textId) {
  const picker = document.getElementById(pickerId);
  const text = document.getElementById(textId);
  if (!picker || !text) return;

  picker.addEventListener('input', () => {
    text.value = picker.value.toUpperCase();
  });

  text.addEventListener('input', () => {
    let val = text.value;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      picker.value = val;
    }
  });
}

syncColors('bgColorPicker', 'bgColor');
syncColors('textColorPicker', 'textColor');

// Deselect presets on custom size change
['width', 'height'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      document.getElementById('sizeList')?.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    });
  }
});

// ==========================================
// DISPLAY UPDATES
// ==========================================

function updateDisplays() {
  const w = document.getElementById('width')?.value || 1200;
  const h = document.getElementById('height')?.value || 628;
  const canvasHeight = parseInt(h);

  // Canvas dimensions
  const canvasInfo = document.getElementById('canvasInfo');
  if (canvasInfo) canvasInfo.textContent = `${w} × ${h} px`;

  // Typography
  const fontScaleVal = document.getElementById('fontScaleVal');
  const letterSpacingVal = document.getElementById('letterSpacingVal');
  const opticalYOffsetVal = document.getElementById('opticalYOffsetVal');
  if (fontScaleVal) fontScaleVal.textContent = Math.round(parseFloat(document.getElementById('fontScale')?.value || 1) * 100) + '%';
  if (letterSpacingVal) letterSpacingVal.textContent = Math.round(parseFloat(document.getElementById('letterSpacing')?.value || 0) * 100) + '%';
  if (opticalYOffsetVal) opticalYOffsetVal.textContent = parseFloat(document.getElementById('opticalYOffset')?.value || 0).toFixed(3);

  // Element size displays (show as pixels)
  ['intro', 'headline', 'offer', 'legend'].forEach(el => {
    const sizeVal = document.getElementById(`${el}SizeVal`);
    const size = parseFloat(document.getElementById(`${el}Size`)?.value || 0);
    if (sizeVal) sizeVal.textContent = Math.round(size * canvasHeight) + 'px';
  });

  // Element margin displays
  ['intro', 'headline', 'offer', 'legend'].forEach(el => {
    const marginVal = document.getElementById(`${el}MarginTopVal`);
    const margin = parseFloat(document.getElementById(`${el}MarginTop`)?.value || 0);
    if (marginVal) marginVal.textContent = Math.round(margin * canvasHeight) + 'px';
  });

  // Headline line height
  const lineHeightVal = document.getElementById('headlineLineHeightVal');
  if (lineHeightVal) lineHeightVal.textContent = parseFloat(document.getElementById('headlineLineHeight')?.value || 1).toFixed(2);
}

// ==========================================
// TEXT UTILITIES
// ==========================================

function applyTransform(text, transform) {
  if (!text) return text;
  switch (transform) {
    case 'uppercase': return text.toUpperCase();
    case 'lowercase': return text.toLowerCase();
    case 'capitalize': return text.replace(/\b\w/g, c => c.toUpperCase());
    default: return text;
  }
}

function fitText(targetCtx, text, maxWidth, fontSize, fontWeight, fontFamily, letterSpacing) {
  if (!text) return fontSize;
  let size = fontSize;
  const spacing = size * letterSpacing;
  targetCtx.font = `${fontWeight} ${size}px "${fontFamily}"`;

  while ((targetCtx.measureText(text).width + (text.length - 1) * spacing) > maxWidth && size > 8) {
    size -= 1;
    targetCtx.font = `${fontWeight} ${size}px "${fontFamily}"`;
  }
  return size;
}

// ==========================================
// CANVAS RENDERING
// ==========================================

const dpr = window.devicePixelRatio || 1;
const exportCanvas = document.createElement('canvas');
const exportCtx = exportCanvas.getContext('2d');

// Shared render function used by Builder and Export
function renderAdToCanvas(targetCtx, width, height, template, content, scale = 1, overrides = null) {
  const {
    bgColor, textColor, fontFamily, fontScale, letterSpacing, opticalYOffset,
    intro, headline, offer, legend
  } = template;

  // Use provided overrides or get from UI
  const layerOvr = overrides || getLayerOverrides();

  // Apply text transforms
  const introText = applyTransform(content.intro || '', intro.transform);
  const headlineText1 = applyTransform(content.headline1 || '', headline.transform);
  const headlineText2 = applyTransform(content.headline2 || '', headline.transform);
  const offerText = applyTransform(content.offer || '', offer.transform);
  const legendText = applyTransform(content.legend || '', legend.transform);

  // Resolve per-element typography (inherit from global if not set)
  const resolveFont = (el) => el.fontFamily || fontFamily;
  const resolveSpacing = (el) => el.letterSpacing ?? letterSpacing;
  const resolveColor = (el) => el.color || textColor;

  // Calculate font sizes with per-element fonts
  const maxTextWidth = width * 0.88;
  const introFontSize = fitText(targetCtx, introText, maxTextWidth, height * intro.size * fontScale, intro.weight, resolveFont(intro), resolveSpacing(intro));
  const headline1FontSize = fitText(targetCtx, headlineText1, maxTextWidth, height * headline.size * fontScale, headline.weight, resolveFont(headline), resolveSpacing(headline));
  const headline2FontSize = fitText(targetCtx, headlineText2, maxTextWidth, height * headline.size * fontScale, headline.weight, resolveFont(headline), resolveSpacing(headline));
  const offerFontSize = fitText(targetCtx, offerText, maxTextWidth, height * offer.size * fontScale, offer.weight, resolveFont(offer), resolveSpacing(offer));
  const legendFontSize = fitText(targetCtx, legendText, maxTextWidth, height * legend.size * fontScale, legend.weight, resolveFont(legend), resolveSpacing(legend));

  // Build elements array with per-element typography
  const elements = [];
  let contentHeight = 0;

  if (introText) {
    const marginTop = height * intro.marginTop * fontScale;
    contentHeight += marginTop;
    elements.push({
      text: introText, fontSize: introFontSize, weight: intro.weight, marginTop,
      font: resolveFont(intro), spacing: resolveSpacing(intro), color: resolveColor(intro)
    });
    contentHeight += introFontSize;
  }
  if (headlineText1) {
    const marginTop = height * headline.marginTop * fontScale;
    contentHeight += marginTop;
    elements.push({
      text: headlineText1, fontSize: headline1FontSize, weight: headline.weight, marginTop,
      font: resolveFont(headline), spacing: resolveSpacing(headline), color: resolveColor(headline)
    });
    contentHeight += headline1FontSize;
  }
  if (headlineText2) {
    const lineGap = headline1FontSize * (headline.lineHeight - 1);
    contentHeight += lineGap;
    elements.push({
      text: headlineText2, fontSize: headline2FontSize, weight: headline.weight, marginTop: lineGap,
      font: resolveFont(headline), spacing: resolveSpacing(headline), color: resolveColor(headline)
    });
    contentHeight += headline2FontSize;
  }
  if (offerText) {
    const marginTop = height * offer.marginTop * fontScale;
    contentHeight += marginTop;
    elements.push({
      text: offerText, fontSize: offerFontSize, weight: offer.weight, marginTop,
      font: resolveFont(offer), spacing: resolveSpacing(offer), color: resolveColor(offer)
    });
    contentHeight += offerFontSize;
  }
  if (legendText) {
    const marginTop = height * legend.marginTop * fontScale;
    contentHeight += marginTop;
    elements.push({
      text: legendText, fontSize: legendFontSize, weight: legend.weight, marginTop,
      font: resolveFont(legend), spacing: resolveSpacing(legend), color: resolveColor(legend)
    });
    contentHeight += legendFontSize;
  }

  // Render
  targetCtx.save();
  targetCtx.scale(scale, scale);

  // Background fill
  targetCtx.fillStyle = bgColor;
  targetCtx.fillRect(0, 0, width, height);

  // Background canvas commands (with layer overrides)
  executeCanvasCommands(targetCtx, width, height, 'background', bgColor, textColor, layerOvr);

  // Text setup
  const opticalOffset = height * opticalYOffset;
  let currentY = (height - contentHeight) / 2 - opticalOffset;

  targetCtx.fillStyle = textColor;
  targetCtx.textAlign = 'center';
  targetCtx.textBaseline = 'top';

  // Reset lineWidth before text commands so we can detect if AI sets it
  targetCtx.lineWidth = 0;

  // Text styling commands (with layer overrides)
  executeCanvasCommands(targetCtx, width, height, 'text', bgColor, textColor, layerOvr);

  // AI must set lineWidth > 0 to enable stroke (we reset it to 0 above)
  const hasStroke = targetCtx.lineWidth > 0;

  // Draw text elements with per-element typography
  elements.forEach((el) => {
    currentY += el.marginTop;
    targetCtx.font = `${el.weight} ${el.fontSize}px "${el.font}"`;
    targetCtx.fillStyle = el.color;

    const elSpacing = el.spacing;
    if (elSpacing !== 0) {
      const charSpacing = el.fontSize * elSpacing;
      const text = el.text;
      if (text) {
        const totalWidth = targetCtx.measureText(text).width + (text.length - 1) * charSpacing;
        let charX = width / 2 - totalWidth / 2;
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const charWidth = targetCtx.measureText(char).width;
          if (hasStroke) targetCtx.strokeText(char, charX + charWidth / 2, currentY);
          targetCtx.fillText(char, charX + charWidth / 2, currentY);
          charX += charWidth + charSpacing;
        }
      }
    } else {
      if (hasStroke) targetCtx.strokeText(el.text, width / 2, currentY);
      targetCtx.fillText(el.text, width / 2, currentY);
    }

    currentY += el.fontSize;
  });

  // Foreground canvas commands (with layer overrides)
  executeCanvasCommands(targetCtx, width, height, 'foreground', bgColor, textColor, layerOvr);

  targetCtx.restore();
}

// Helper to get per-element font (empty string means inherit)
function getElementFont(elementId) {
  const val = document.getElementById(`${elementId}Font`)?.value;
  return val === '' || val === 'inherit' ? null : val;
}

// Helper to get per-element letter spacing (null means inherit)
function getElementSpacing(elementId) {
  const el = document.getElementById(`${elementId}Spacing`);
  if (!el || el.value === '' || el.value === 'inherit') return null;
  return parseFloat(el.value);
}

// Helper to get per-element color (empty string means inherit)
// Supports both hex (#FFFFFF) and rgba (rgba(255,255,255,0.65)) formats
function getElementColor(elementId) {
  const val = document.getElementById(`${elementId}Color`)?.value;
  if (!val || val === '' || val === 'inherit') return null;
  // Accept hex or rgba
  if (/^#[0-9A-Fa-f]{6}$/i.test(val) || /^rgba?\(/i.test(val)) {
    return val;
  }
  return null;
}

// Get current template from UI
function getTemplateFromUI() {
  // Global text transform (default for all elements)
  const globalTransform = document.getElementById('textTransform')?.value || 'none';

  // Helper to get element transform (empty = inherit from global)
  const getTransform = (elementId, defaultVal) => {
    const val = document.getElementById(`${elementId}Transform`)?.value;
    return val === '' ? globalTransform : (val || defaultVal);
  };

  return {
    bgColor: document.getElementById('bgColor')?.value || '#0033FF',
    textColor: document.getElementById('textColor')?.value || '#FFFFFF',
    fontFamily: document.getElementById('fontFamily')?.value || 'Inter',
    fontScale: parseFloat(document.getElementById('fontScale')?.value) || 1,
    letterSpacing: parseFloat(document.getElementById('letterSpacing')?.value) || 0,
    textTransform: globalTransform,
    opticalYOffset: parseFloat(document.getElementById('opticalYOffset')?.value) || 0.05,
    intro: {
      size: parseFloat(document.getElementById('introSize')?.value) || 0.06,
      weight: document.getElementById('introWeight')?.value || '500',
      transform: getTransform('intro', 'none'),
      marginTop: parseFloat(document.getElementById('introMarginTop')?.value) || 0,
      fontFamily: getElementFont('intro'),
      letterSpacing: getElementSpacing('intro'),
      color: getElementColor('intro')
    },
    headline: {
      size: parseFloat(document.getElementById('headlineSize')?.value) || 0.16,
      weight: document.getElementById('headlineWeight')?.value || '700',
      transform: getTransform('headline', 'uppercase'),
      marginTop: parseFloat(document.getElementById('headlineMarginTop')?.value) || 0.02,
      lineHeight: parseFloat(document.getElementById('headlineLineHeight')?.value) || 1.05,
      fontFamily: getElementFont('headline'),
      letterSpacing: getElementSpacing('headline'),
      color: getElementColor('headline')
    },
    offer: {
      size: parseFloat(document.getElementById('offerSize')?.value) || 0.11,
      weight: document.getElementById('offerWeight')?.value || '800',
      transform: getTransform('offer', 'uppercase'),
      marginTop: parseFloat(document.getElementById('offerMarginTop')?.value) || 0.15,
      fontFamily: getElementFont('offer'),
      letterSpacing: getElementSpacing('offer'),
      color: getElementColor('offer')
    },
    legend: {
      size: parseFloat(document.getElementById('legendSize')?.value) || 0.035,
      weight: document.getElementById('legendWeight')?.value || '400',
      transform: getTransform('legend', 'none'),
      marginTop: parseFloat(document.getElementById('legendMarginTop')?.value) || 0.06,
      fontFamily: getElementFont('legend'),
      letterSpacing: getElementSpacing('legend'),
      color: getElementColor('legend')
    }
  };
}

// Get current content from UI
function getContentFromUI() {
  return {
    intro: document.getElementById('introText')?.value || '',
    headline1: document.getElementById('headlineText1')?.value || '',
    headline2: document.getElementById('headlineText2')?.value || '',
    offer: document.getElementById('offerText')?.value || '',
    legend: document.getElementById('legendText')?.value || ''
  };
}

async function generateAd() {
  updateDisplays();

  // Collect and load all fonts that need to be loaded
  const fontsToLoad = new Set();
  const fontFamily = document.getElementById('fontFamily')?.value || 'Helvetica';
  fontsToLoad.add(fontFamily);
  ['intro', 'headline', 'offer', 'legend'].forEach(elId => {
    const elFont = document.getElementById(`${elId}Font`)?.value;
    if (elFont && elFont !== '' && elFont !== 'inherit') {
      fontsToLoad.add(elFont);
    }
  });
  await Promise.all(Array.from(fontsToLoad).map(f => ensureFontLoaded(f)));

  const width = parseInt(document.getElementById('width')?.value) || 1200;
  const height = parseInt(document.getElementById('height')?.value) || 628;

  // Display canvas: scaled for screen DPI
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // Export canvas: actual logical size
  exportCanvas.width = width;
  exportCanvas.height = height;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  exportCtx.imageSmoothingEnabled = true;
  exportCtx.imageSmoothingQuality = 'high';

  const template = getTemplateFromUI();
  const content = getContentFromUI();

  // Render to both canvases
  renderAdToCanvas(ctx, width, height, template, content, dpr);
  renderAdToCanvas(exportCtx, width, height, template, content, 1);

  updateConfigCode();
}

// ==========================================
// PNG EXPORT WITH DPI
// ==========================================

function embedPngDpi(dataUrl, dpi) {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const ppm = Math.round(dpi / 0.0254);
  const chunk = new Uint8Array(21);
  const view = new DataView(chunk.buffer);

  view.setUint32(0, 9, false);
  chunk[4] = 0x70; chunk[5] = 0x48; chunk[6] = 0x59; chunk[7] = 0x73;
  view.setUint32(8, ppm, false);
  view.setUint32(12, ppm, false);
  chunk[16] = 1;

  let crc = 0xFFFFFFFF;
  for (let i = 4; i < 17; i++) {
    let byte = chunk[i];
    for (let j = 0; j < 8; j++) {
      const bit = (byte ^ crc) & 1;
      crc >>>= 1;
      if (bit) crc ^= 0xEDB88320;
      byte >>>= 1;
    }
  }
  view.setUint32(17, (crc ^ 0xFFFFFFFF) >>> 0, false);

  let pos = 8;
  while (pos < bytes.length) {
    const len = (bytes[pos] << 24) | (bytes[pos+1] << 16) | (bytes[pos+2] << 8) | bytes[pos+3];
    const type = String.fromCharCode(bytes[pos+4], bytes[pos+5], bytes[pos+6], bytes[pos+7]);

    if (type === 'IDAT') {
      const result = new Uint8Array(bytes.length + 21);
      result.set(bytes.slice(0, pos), 0);
      result.set(chunk, pos);
      result.set(bytes.slice(pos), pos + 21);

      let str = '';
      for (let i = 0; i < result.length; i++) str += String.fromCharCode(result[i]);
      return 'data:image/png;base64,' + btoa(str);
    }
    pos += 12 + len;
  }
  return dataUrl;
}

function downloadAd() {
  const w = parseInt(document.getElementById('width')?.value) || 1200;
  const h = parseInt(document.getElementById('height')?.value) || 628;

  const effectiveDpi = 72 * dpr;
  const pngData = embedPngDpi(exportCanvas.toDataURL('image/png'), effectiveDpi);

  const link = document.createElement('a');
  link.download = `ad-${w}x${h}.png`;
  link.href = pngData;
  link.click();
}

function resetDefaults() {
  // Clear saved state
  localStorage.removeItem('ad_studio_state');
  // Reset data
  dataRows = [];
  activeVariationIndex = -1;
  selectedExportSizes = new Set();
  // Reload defaults
  loadDefaults();
  document.getElementById('sizePlatform').value = 'reddit';
  document.getElementById('exportPlatform').value = 'reddit';
  document.getElementById('aiPrompt').value = '';
  document.getElementById('aiVariationCount').value = '8';
  renderSizeList('reddit');
  renderDataTable();
  renderVariationCards();
  renderExportSizeList('reddit');
  updateExportSummary();
  generateAd();
}

// ==========================================
// FONT LOADING
// ==========================================

const loadedFonts = new Set();

async function ensureFontLoaded(fontFamily) {
  if (loadedFonts.has(fontFamily)) return;

  if (document.fonts) {
    const weights = ['400', '500', '600', '700', '800', '900'];
    await Promise.all(
      weights.map(w => document.fonts.load(`${w} 48px "${fontFamily}"`).catch(() => {}))
    );
  }
  loadedFonts.add(fontFamily);
}

// ==========================================
// BUILDER EVENT LISTENERS
// ==========================================

// Throttle render calls for smooth slider dragging (especially on Safari)
let builderRafPending = false;
document.querySelectorAll('#builder-tab input, #builder-tab select').forEach(input => {
  input.addEventListener('input', (e) => {
    // When font changes, apply preset if one exists
    if (e.target.id === 'fontFamily') {
      applyFontPreset(e.target.value);
    }

    // Throttle generateAd calls using requestAnimationFrame
    if (!builderRafPending) {
      builderRafPending = true;
      requestAnimationFrame(() => {
        generateAd();
        builderRafPending = false;
      });
    }
    saveAppStateDebounced();
  });
});

// ==========================================
// DATA TAB - VARIATIONS MANAGEMENT
// ==========================================

let dataRows = [];
let activeVariationIndex = -1;
let selectedExportSizes = new Set();

// ==========================================
// STATE PERSISTENCE
// ==========================================

function saveAppState() {
  try {
    const state = {
      // Builder settings
      builder: {
        width: document.getElementById('width')?.value,
        height: document.getElementById('height')?.value,
        sizePlatform: document.getElementById('sizePlatform')?.value,
        bgColor: document.getElementById('bgColor')?.value,
        textColor: document.getElementById('textColor')?.value,
        fontFamily: document.getElementById('fontFamily')?.value,
        fontScale: document.getElementById('fontScale')?.value,
        letterSpacing: document.getElementById('letterSpacing')?.value,
        textTransform: document.getElementById('textTransform')?.value,
        opticalYOffset: document.getElementById('opticalYOffset')?.value,
        // Content
        introText: document.getElementById('introText')?.value,
        introSize: document.getElementById('introSize')?.value,
        introWeight: document.getElementById('introWeight')?.value,
        introTransform: document.getElementById('introTransform')?.value,
        introMarginTop: document.getElementById('introMarginTop')?.value,
        headlineText1: document.getElementById('headlineText1')?.value,
        headlineText2: document.getElementById('headlineText2')?.value,
        headlineSize: document.getElementById('headlineSize')?.value,
        headlineWeight: document.getElementById('headlineWeight')?.value,
        headlineTransform: document.getElementById('headlineTransform')?.value,
        headlineMarginTop: document.getElementById('headlineMarginTop')?.value,
        headlineLineHeight: document.getElementById('headlineLineHeight')?.value,
        offerText: document.getElementById('offerText')?.value,
        offerSize: document.getElementById('offerSize')?.value,
        offerWeight: document.getElementById('offerWeight')?.value,
        offerTransform: document.getElementById('offerTransform')?.value,
        offerMarginTop: document.getElementById('offerMarginTop')?.value,
        legendText: document.getElementById('legendText')?.value,
        legendSize: document.getElementById('legendSize')?.value,
        legendWeight: document.getElementById('legendWeight')?.value,
        legendTransform: document.getElementById('legendTransform')?.value,
        legendMarginTop: document.getElementById('legendMarginTop')?.value,
        // Layer opacities (opacity 0 = disabled)
        bgLayerOpacity: document.getElementById('bgLayerOpacity')?.value,
        textLayerOpacity: document.getElementById('textLayerOpacity')?.value,
        fgLayerOpacity: document.getElementById('fgLayerOpacity')?.value,
        // Per-element typography overrides (color is empty string or hex)
        introFont: document.getElementById('introFont')?.value,
        introColor: document.getElementById('introColor')?.value,
        headlineFont: document.getElementById('headlineFont')?.value,
        headlineColor: document.getElementById('headlineColor')?.value,
        offerFont: document.getElementById('offerFont')?.value,
        offerColor: document.getElementById('offerColor')?.value,
        legendFont: document.getElementById('legendFont')?.value,
        legendColor: document.getElementById('legendColor')?.value
      },
      // Data tab
      data: {
        variations: dataRows,
        aiPrompt: document.getElementById('aiPrompt')?.value,
        aiLanguage: document.getElementById('aiLanguage')?.value,
        aiVariationCount: document.getElementById('aiVariationCount')?.value,
        systemPrompt: document.getElementById('systemPrompt')?.value
      },
      // Export tab
      export: {
        platform: document.getElementById('exportPlatform')?.value,
        selectedSizes: Array.from(selectedExportSizes)
      },
      // Active version (index into saved versions)
      activeVersionIndex: activeVersionIndex
    };
    localStorage.setItem('ad_studio_state', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function loadAppState() {
  try {
    const saved = localStorage.getItem('ad_studio_state');
    if (!saved) return false;

    const state = JSON.parse(saved);

    // Restore Builder settings
    if (state.builder) {
      const b = state.builder;

      // Restore regular input values
      Object.keys(b).forEach(key => {
        const el = document.getElementById(key);
        if (!el || b[key] === undefined || b[key] === null) return;

        // Handle checkboxes separately
        if (el.type === 'checkbox') {
          el.checked = b[key];
        } else {
          el.value = b[key];
        }
      });

      // Sync color pickers
      const bgColor = document.getElementById('bgColor')?.value;
      const textColor = document.getElementById('textColor')?.value;
      if (bgColor) document.getElementById('bgColorPicker').value = bgColor;
      if (textColor) document.getElementById('textColorPicker').value = textColor;

      // Render size list for saved platform
      if (b.sizePlatform) {
        renderSizeList(b.sizePlatform);
      }

      // Update layer opacity value displays
      ['bgLayerOpacity', 'textLayerOpacity', 'fgLayerOpacity'].forEach(id => {
        const el = document.getElementById(id);
        const valEl = document.getElementById(`${id}Val`);
        if (el && valEl) {
          valEl.textContent = Math.round(parseFloat(el.value) * 100) + '%';
        }
      });

      // Update all slider value displays
      // Global sliders
      ['fontScale', 'letterSpacing', 'opticalYOffset'].forEach(id => {
        const el = document.getElementById(id);
        const valEl = document.getElementById(`${id}Val`);
        if (el && valEl) {
          const val = parseFloat(el.value);
          if (id === 'fontScale') {
            valEl.textContent = val.toFixed(2);
          } else if (id === 'letterSpacing') {
            valEl.textContent = (val >= 0 ? '+' : '') + (val * 100).toFixed(0) + '%';
          } else if (id === 'opticalYOffset') {
            valEl.textContent = Math.round(val * 100) + '%';
          }
        }
      });

      // Per-element sliders
      ['intro', 'headline', 'offer', 'legend'].forEach(elId => {
        // Size
        const sizeEl = document.getElementById(`${elId}Size`);
        const sizeValEl = document.getElementById(`${elId}SizeVal`);
        if (sizeEl && sizeValEl) {
          sizeValEl.textContent = Math.round(parseFloat(sizeEl.value) * 100) + '%';
        }
        // Margin top
        const marginEl = document.getElementById(`${elId}MarginTop`);
        const marginValEl = document.getElementById(`${elId}MarginTopVal`);
        if (marginEl && marginValEl) {
          marginValEl.textContent = Math.round(parseFloat(marginEl.value) * 100) + '%';
        }
      });

      // Headline line height
      const lineHeightEl = document.getElementById('headlineLineHeight');
      const lineHeightValEl = document.getElementById('headlineLineHeightVal');
      if (lineHeightEl && lineHeightValEl) {
        lineHeightValEl.textContent = parseFloat(lineHeightEl.value).toFixed(2);
      }

      // Restore per-element colors and update swatch states
      // Supports both hex and rgba formats
      ['intro', 'headline', 'offer', 'legend'].forEach(elId => {
        const colorPicker = document.getElementById(`${elId}ColorPicker`);
        const colorText = document.getElementById(`${elId}Color`);
        const color = b[`${elId}Color`];

        if (colorPicker && colorText) {
          if (color && /^#[0-9A-Fa-f]{6}$/i.test(color)) {
            // Hex color
            colorText.value = color.toUpperCase();
            colorPicker.value = color;
          } else if (color && /^rgba?\(/i.test(color)) {
            // RGBA color (from semantic tokens)
            colorText.value = color;
            colorPicker.value = '#FFFFFF'; // Picker can't show rgba
          } else {
            colorText.value = '';
            colorPicker.value = '#FFFFFF';
          }
          updateColorSwatchState(elId);
        }
      });

      // Update override indicators after restoring all element states
      updateElementOverrideIndicators();
    }

    // Restore Data tab
    if (state.data) {
      dataRows = state.data.variations || [];
      if (dataRows.length > 0) {
        activeVariationIndex = 0;
      }
      if (state.data.aiPrompt) {
        const prompt = document.getElementById('aiPrompt');
        if (prompt) prompt.value = state.data.aiPrompt;
      }
      if (state.data.aiLanguage) {
        const lang = document.getElementById('aiLanguage');
        if (lang) lang.value = state.data.aiLanguage;
      }
      if (state.data.aiVariationCount) {
        const count = document.getElementById('aiVariationCount');
        if (count) count.value = state.data.aiVariationCount;
      }
      if (state.data.systemPrompt) {
        const sysPrompt = document.getElementById('systemPrompt');
        if (sysPrompt) {
          sysPrompt.value = state.data.systemPrompt;
          updateSystemPromptStyle();
        }
      }
    }

    // Restore Export tab
    if (state.export) {
      if (state.export.platform) {
        const platform = document.getElementById('exportPlatform');
        if (platform) platform.value = state.export.platform;
      }
      if (state.export.selectedSizes) {
        selectedExportSizes = new Set(state.export.selectedSizes);
      }
    }

    // Restore active version index (will be applied after versions load)
    if (typeof state.activeVersionIndex === 'number' && state.activeVersionIndex >= 0) {
      // Store for later - versions aren't loaded yet
      window._pendingActiveVersionIndex = state.activeVersionIndex;
    }

    return true;
  } catch (e) {
    console.error('Failed to load state:', e);
    return false;
  }
}

// Debounced save to avoid excessive writes
let saveTimeout;
function saveAppStateDebounced() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveAppState, 300);
}

// Preview canvas setup
const previewCanvas = document.getElementById('previewCanvas');
const previewCtx = previewCanvas?.getContext('2d');

function createDataRow(data = {}) {
  return {
    id: Date.now() + Math.random(),
    selected: true,
    intro: data.intro || '',
    headline1: data.headline1 || '',
    headline2: data.headline2 || '',
    offer: data.offer || '',
    legend: data.legend || ''
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render data table for Data tab (spreadsheet view)
function renderDataTable() {
  const tbody = document.getElementById('dataTableBody');
  const empty = document.getElementById('dataEmpty');
  const countEl = document.getElementById('dataRowCount');

  if (!tbody) return;

  if (dataRows.length === 0) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    if (countEl) countEl.textContent = '0';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (countEl) countEl.textContent = dataRows.length;

  tbody.innerHTML = dataRows.map((row, index) => `
    <tr data-index="${index}">
      <td class="col-num"><span class="row-num">${index + 1}</span></td>
      <td class="col-check">
        <input type="checkbox" ${row.selected ? 'checked' : ''}
               onchange="toggleRowSelection(${index}); renderVariationCards();">
      </td>
      <td><input type="text" value="${escapeHtml(row.intro)}"
                 onchange="updateRowField(${index}, 'intro', this.value)"
                 placeholder="Intro"></td>
      <td><input type="text" value="${escapeHtml(row.headline1)}"
                 onchange="updateRowField(${index}, 'headline1', this.value)"
                 placeholder="Headline 1"></td>
      <td><input type="text" value="${escapeHtml(row.headline2)}"
                 onchange="updateRowField(${index}, 'headline2', this.value)"
                 placeholder="Headline 2"></td>
      <td><input type="text" value="${escapeHtml(row.offer)}"
                 onchange="updateRowField(${index}, 'offer', this.value)"
                 placeholder="Offer"></td>
      <td><input type="text" value="${escapeHtml(row.legend)}"
                 onchange="updateRowField(${index}, 'legend', this.value)"
                 placeholder="Legend"></td>
      <td class="col-actions">
        <button class="row-delete" onclick="deleteRow(${index})">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

// Render variation cards for Export tab (preview view)
function renderVariationCards() {
  const list = document.getElementById('variationsList');
  if (!list) return;

  if (dataRows.length === 0) {
    list.innerHTML = `
      <div class="variations-empty">
        <p>No variations yet</p>
        <span>Generate with AI or add manually</span>
      </div>
    `;
    document.getElementById('variationCount').textContent = '0';
    updateExportSummary();
    return;
  }

  list.innerHTML = dataRows.map((row, index) => {
    const headline = [row.headline1, row.headline2].filter(Boolean).join(' ');
    return `
      <div class="variation-card${index === activeVariationIndex ? ' active' : ''}"
           data-index="${index}"
           onclick="selectVariation(${index})">
        <div class="variation-card-header">
          <input type="checkbox" ${row.selected ? 'checked' : ''}
                 onclick="event.stopPropagation(); toggleRowSelection(${index})">
          <span class="variation-card-intro">${escapeHtml(row.intro) || 'No intro'}</span>
          <button class="variation-card-delete" onclick="event.stopPropagation(); deleteRow(${index})">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="variation-card-headline">${escapeHtml(headline) || 'No headline'}</div>
        <div class="variation-card-offer">${escapeHtml(row.offer) || 'No offer'}</div>
        <div class="variation-card-legend">${escapeHtml(row.legend) || 'No legend'}</div>
      </div>
    `;
  }).join('');

  document.getElementById('variationCount').textContent = dataRows.length;
  updateExportSummary();
}

function selectVariation(index) {
  activeVariationIndex = index;
  renderVariationCards();
  renderPreview();
}

function addDataRow() {
  dataRows.push(createDataRow());
  activeVariationIndex = dataRows.length - 1;
  saveAppStateDebounced();
  renderDataTable();
  renderVariationCards();
  renderPreview();
}

function deleteRow(index) {
  dataRows.splice(index, 1);
  if (activeVariationIndex >= dataRows.length) {
    activeVariationIndex = dataRows.length - 1;
  }
  saveAppStateDebounced();
  renderDataTable();
  renderVariationCards();
  renderPreview();
}

function toggleRowSelection(index) {
  dataRows[index].selected = !dataRows[index].selected;
  saveAppStateDebounced();
  updateExportSummary();
}

function updateRowField(index, field, value) {
  dataRows[index][field] = value;
  saveAppStateDebounced();
}

// Select all checkboxes (Data tab and Export tab)
document.getElementById('selectAll')?.addEventListener('change', (e) => {
  dataRows.forEach(row => row.selected = e.target.checked);
  saveAppStateDebounced();
  renderDataTable();
  renderVariationCards();
  updateExportSummary();
});

document.getElementById('selectAllExport')?.addEventListener('change', (e) => {
  dataRows.forEach(row => row.selected = e.target.checked);
  saveAppStateDebounced();
  renderDataTable();
  renderVariationCards();
  updateExportSummary();
});

// ==========================================
// EXPORT SIZE LIST
// ==========================================

function renderExportSizeList(platform) {
  const list = document.getElementById('exportSizeList');
  if (!list) return;

  const sizes = SIZE_PRESETS[platform] || SIZE_PRESETS.reddit;

  list.innerHTML = sizes.map(size => {
    const key = `${size.w}x${size.h}`;
    const isSelected = selectedExportSizes.has(key);
    return `
      <div class="export-size-item${isSelected ? ' selected' : ''}" data-size="${key}">
        <input type="checkbox" ${isSelected ? 'checked' : ''}>
        <span class="size-preview" style="aspect-ratio: ${size.w}/${size.h};"></span>
        <span class="size-info">
          <span class="size-dims">${size.w} × ${size.h}</span>
          <span class="size-label">${size.label}</span>
        </span>
      </div>
    `;
  }).join('');

  // Bind click events
  list.querySelectorAll('.export-size-item').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.size;
      const checkbox = item.querySelector('input[type="checkbox"]');

      if (selectedExportSizes.has(key)) {
        selectedExportSizes.delete(key);
        item.classList.remove('selected');
        checkbox.checked = false;
      } else {
        selectedExportSizes.add(key);
        item.classList.add('selected');
        checkbox.checked = true;
      }
      updateExportSummary();
      saveAppStateDebounced();
    });
  });
}

// Platform dropdown change for export
document.getElementById('exportPlatform')?.addEventListener('change', (e) => {
  renderExportSizeList(e.target.value);
});

function updateExportSummary() {
  const selectedVariations = dataRows.filter(r => r.selected).length;
  const selectedSizesCount = selectedExportSizes.size;
  const totalFiles = selectedVariations * selectedSizesCount;

  document.getElementById('selectedVariations').textContent = selectedVariations;
  document.getElementById('selectedSizes').textContent = selectedSizesCount;
  document.getElementById('totalFiles').textContent = totalFiles;
}

// ==========================================
// PREVIEW RENDERING
// ==========================================

function renderPreview() {
  if (!previewCanvas || !previewCtx) return;

  const row = dataRows[activeVariationIndex];
  const previewInfo = document.getElementById('previewInfo');

  if (!row) {
    previewCanvas.style.display = 'none';
    if (previewInfo) previewInfo.textContent = 'Select a variation to preview';
    return;
  }

  previewCanvas.style.display = 'block';

  // Get current Builder settings
  const width = parseInt(document.getElementById('width')?.value) || 1200;
  const height = parseInt(document.getElementById('height')?.value) || 628;

  // Set canvas size
  previewCanvas.width = width * dpr;
  previewCanvas.height = height * dpr;
  previewCanvas.style.width = width + 'px';
  previewCanvas.style.height = height + 'px';

  if (previewInfo) previewInfo.textContent = `${width} × ${height} px`;

  previewCtx.imageSmoothingEnabled = true;
  previewCtx.imageSmoothingQuality = 'high';

  const template = getTemplateFromUI();
  const content = {
    intro: row.intro,
    headline1: row.headline1,
    headline2: row.headline2,
    offer: row.offer,
    legend: row.legend
  };

  renderAdToCanvas(previewCtx, width, height, template, content, dpr);
}

// ==========================================
// API KEY MANAGEMENT
// ==========================================

function openApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  const input = document.getElementById('apiKeyInput');
  if (modal) modal.classList.add('active');
  if (input) input.value = localStorage.getItem('anthropic_api_key') || '';
}

function closeApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  if (modal) modal.classList.remove('active');
}

function saveApiKey() {
  const input = document.getElementById('apiKeyInput');
  const key = input?.value?.trim();
  if (key) {
    localStorage.setItem('anthropic_api_key', key);
    updateApiKeyStatus();
  }
  closeApiKeyModal();
}

function updateApiKeyStatus() {
  const status = document.getElementById('apiKeyStatus');
  const hasKey = !!localStorage.getItem('anthropic_api_key');
  if (status) {
    const span = status.querySelector('span');
    if (span) {
      span.textContent = hasKey ? 'API Key Set' : 'Set API Key';
    }
    status.classList.toggle('active', hasKey);
  }
}

// ==========================================
// AI GENERATION
// ==========================================

async function generateWithAI() {
  const apiKey = localStorage.getItem('anthropic_api_key');
  if (!apiKey) {
    openApiKeyModal();
    return;
  }

  const prompt = document.getElementById('aiPrompt')?.value?.trim();
  if (!prompt) {
    alert('Please describe your product or service to generate copy variations.');
    return;
  }

  const variationCount = parseInt(document.getElementById('aiVariationCount')?.value) || 8;
  const language = document.getElementById('aiLanguage')?.value || 'en';
  const btn = document.getElementById('generateBtn');
  btn?.classList.add('loading');

  const systemPrompt = getSystemPrompt();

  // Language names for the prompt
  const languageNames = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    it: 'Italian', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish',
    ru: 'Russian', ja: 'Japanese', ko: 'Korean', zh: 'Chinese', ar: 'Arabic'
  };
  const languageName = languageNames[language] || 'English';
  const languageInstruction = language !== 'en'
    ? `\n\n## Language\nWrite ALL copy in ${languageName}. The output must be entirely in ${languageName}, not English.`
    : '';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `${systemPrompt}

## Brief from user:
${prompt}${languageInstruction}

## Output format
Generate exactly ${variationCount} variations exploring different emotional angles (aspiration, fear, belonging, control, simplicity). Each variation must have:
- intro: 1-3 words (identity/qualifier)
- headline1: 2-4 words (first line of emotional hook)
- headline2: 1-3 words (punch line)
- offer: 2-5 words (value + action)
- legend: 3-6 words (trust/friction removal)

Return ONLY a JSON array, no other text:
[{"intro": "...", "headline1": "...", "headline2": "...", "offer": "...", "legend": "..."}, ...]`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const content = data.content[0].text;

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const variations = JSON.parse(jsonMatch[0]);
      variations.forEach(v => {
        dataRows.push(createDataRow(v));
      });
      if (dataRows.length > 0 && activeVariationIndex === -1) {
        activeVariationIndex = 0;
      }
      saveAppStateDebounced();
      renderDataTable();
      renderVariationCards();
      renderPreview();
    }
  } catch (error) {
    console.error('AI Generation error:', error);
    alert('Error generating copy: ' + error.message);
  } finally {
    btn?.classList.remove('loading');
  }
}

// ==========================================
// ZIP EXPORT
// ==========================================

async function exportAllAds() {
  const selectedRows = dataRows.filter(r => r.selected);
  if (selectedRows.length === 0) {
    alert('Please select at least one variation to export.');
    return;
  }

  if (selectedExportSizes.size === 0) {
    alert('Please select at least one size to export.');
    return;
  }

  const selectedSizes = Array.from(selectedExportSizes).map(s => s.split('x').map(Number));

  // Dynamic import of JSZip
  if (!window.JSZip) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);
    await new Promise(resolve => script.onload = resolve);
  }

  const zip = new JSZip();
  const btn = document.getElementById('exportAllBtn');
  btn?.classList.add('loading');

  // Get current template settings from UI
  const template = getTemplateFromUI();

  // Load all fonts (global + per-element overrides)
  const fontsToLoad = new Set([template.fontFamily]);
  ['intro', 'headline', 'offer', 'legend'].forEach(el => {
    if (template[el]?.fontFamily) {
      fontsToLoad.add(template[el].fontFamily);
    }
  });
  await Promise.all(Array.from(fontsToLoad).map(f => ensureFontLoaded(f)));

  try {
    for (let i = 0; i < selectedRows.length; i++) {
      const row = selectedRows[i];
      const varNum = String(i + 1).padStart(2, '0');

      for (const [width, height] of selectedSizes) {
        const pngData = await renderAdToDataUrl(row, template, width, height);
        const base64 = pngData.split(',')[1];
        zip.file(`${varNum}-${width}x${height}.png`, base64, { base64: true });
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.download = `ads-export-${Date.now()}.zip`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Export error:', error);
    alert('Error exporting ads: ' + error.message);
  } finally {
    btn?.classList.remove('loading');
  }
}

async function renderAdToDataUrl(row, template, width, height) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');

  tempCtx.imageSmoothingEnabled = true;
  tempCtx.imageSmoothingQuality = 'high';

  const content = {
    intro: row.intro,
    headline1: row.headline1,
    headline2: row.headline2,
    offer: row.offer,
    legend: row.legend
  };

  renderAdToCanvas(tempCtx, width, height, template, content, 1);

  const effectiveDpi = 72 * dpr;
  return embedPngDpi(tempCanvas.toDataURL('image/png'), effectiveDpi);
}

// ==========================================
// INITIALIZATION
// ==========================================

function loadDefaults() {
  // Canvas size
  document.getElementById('width').value = CONFIG.canvas.width;
  document.getElementById('height').value = CONFIG.canvas.height;

  // Colors
  document.getElementById('bgColor').value = CONFIG.colors.background;
  document.getElementById('bgColorPicker').value = CONFIG.colors.background;
  document.getElementById('textColor').value = CONFIG.colors.text;
  document.getElementById('textColorPicker').value = CONFIG.colors.text;

  // Typography
  document.getElementById('fontFamily').value = CONFIG.typography.fontFamily;
  document.getElementById('fontScale').value = CONFIG.typography.fontScale;
  document.getElementById('letterSpacing').value = CONFIG.typography.letterSpacing;
  document.getElementById('opticalYOffset').value = CONFIG.typography.opticalYOffset;

  // Elements
  const e = CONFIG.elements;

  // Intro
  document.getElementById('introText').value = e.intro.text;
  document.getElementById('introSize').value = e.intro.size;
  document.getElementById('introWeight').value = e.intro.weight;
  document.getElementById('introTransform').value = e.intro.transform;
  document.getElementById('introMarginTop').value = e.intro.marginTop;

  // Headline
  document.getElementById('headlineText1').value = e.headline.text[0];
  document.getElementById('headlineText2').value = e.headline.text[1];
  document.getElementById('headlineSize').value = e.headline.size;
  document.getElementById('headlineWeight').value = e.headline.weight;
  document.getElementById('headlineTransform').value = e.headline.transform;
  document.getElementById('headlineMarginTop').value = e.headline.marginTop;
  document.getElementById('headlineLineHeight').value = e.headline.lineHeight;

  // Offer
  document.getElementById('offerText').value = e.offer.text;
  document.getElementById('offerSize').value = e.offer.size;
  document.getElementById('offerWeight').value = e.offer.weight;
  document.getElementById('offerTransform').value = e.offer.transform;
  document.getElementById('offerMarginTop').value = e.offer.marginTop;

  // Legend
  document.getElementById('legendText').value = e.legend.text;
  document.getElementById('legendSize').value = e.legend.size;
  document.getElementById('legendWeight').value = e.legend.weight;
  document.getElementById('legendTransform').value = e.legend.transform;
  document.getElementById('legendMarginTop').value = e.legend.marginTop;
}

// ==========================================
// SAVED VERSIONS
// ==========================================
// Versions capture the complete design state (everything except text content)
// User explicitly saves when they have a design they want to keep

const MAX_VERSIONS = 12;
let savedVersions = [];
let activeVersionIndex = -1;

function loadVersions() {
  try {
    const saved = localStorage.getItem('ad_studio_versions');
    if (saved) {
      savedVersions = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load versions:', e);
    savedVersions = [];
  }
}

function persistVersions() {
  try {
    localStorage.setItem('ad_studio_versions', JSON.stringify(savedVersions));
  } catch (e) {
    console.warn('Failed to save versions:', e);
  }
}

// Capture the complete current UI state as a version
function getCurrentVersion() {
  const getVal = (id) => document.getElementById(id)?.value || '';
  const getNum = (id) => parseFloat(document.getElementById(id)?.value) || 0;

  return {
    // Canvas
    width: parseInt(getVal('width')) || 1200,
    height: parseInt(getVal('height')) || 628,

    // Colors
    bgColor: getVal('bgColor'),
    textColor: getVal('textColor'),

    // Global Typography
    fontFamily: getVal('fontFamily'),
    fontScale: getNum('fontScale'),
    letterSpacing: getNum('letterSpacing'),
    textTransform: getVal('textTransform'),

    // Layout
    opticalYOffset: getNum('opticalYOffset'),

    // Per-element settings
    intro: {
      font: getVal('introFont'),
      weight: getVal('introWeight'),
      transform: getVal('introTransform'),
      color: getVal('introColor'),
      size: getNum('introSize'),
      marginTop: getNum('introMarginTop')
    },
    headline: {
      font: getVal('headlineFont'),
      weight: getVal('headlineWeight'),
      transform: getVal('headlineTransform'),
      color: getVal('headlineColor'),
      size: getNum('headlineSize'),
      lineHeight: getNum('headlineLineHeight'),
      marginTop: getNum('headlineMarginTop')
    },
    offer: {
      font: getVal('offerFont'),
      weight: getVal('offerWeight'),
      transform: getVal('offerTransform'),
      color: getVal('offerColor'),
      size: getNum('offerSize'),
      marginTop: getNum('offerMarginTop')
    },
    legend: {
      font: getVal('legendFont'),
      weight: getVal('legendWeight'),
      transform: getVal('legendTransform'),
      color: getVal('legendColor'),
      size: getNum('legendSize'),
      marginTop: getNum('legendMarginTop')
    },

    // Layer opacities (0 = disabled, which is a valid user choice)
    layers: {
      background: getNum('bgLayerOpacity'),
      text: getNum('textLayerOpacity'),
      foreground: getNum('fgLayerOpacity')
    },

    // AI Canvas commands (stored as code strings for re-parsing)
    canvas: {
      background: canvasDecorations.find(c => c.layer === 'background')?.code || null,
      text: canvasDecorations.find(c => c.layer === 'text')?.code || null,
      foreground: canvasDecorations.find(c => c.layer === 'foreground')?.code || null
    },

    // Style prompt for reference
    stylePrompt: getVal('stylePrompt')
  };
}

// Apply a saved version to the UI
async function applyVersion(index) {
  const version = savedVersions[index];
  if (!version) return;

  activeVersionIndex = index;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  const setColor = (pickerId, textId, val) => {
    if (val) {
      setVal(textId, val);
      const picker = document.getElementById(pickerId);
      if (picker && /^#[0-9A-Fa-f]{6}$/i.test(val)) {
        picker.value = val;
      }
    }
  };

  // Canvas size
  setVal('width', version.width);
  setVal('height', version.height);

  // Colors
  setColor('bgColorPicker', 'bgColor', version.bgColor);
  setColor('textColorPicker', 'textColor', version.textColor);

  // Global Typography
  setVal('fontFamily', version.fontFamily);
  setVal('fontScale', version.fontScale);
  setVal('letterSpacing', version.letterSpacing);
  setVal('textTransform', version.textTransform);

  // Layout
  setVal('opticalYOffset', version.opticalYOffset);

  // Per-element settings
  if (version.intro) {
    setVal('introFont', version.intro.font);
    setVal('introWeight', version.intro.weight);
    setVal('introTransform', version.intro.transform);
    setVal('introColor', version.intro.color);
    setVal('introSize', version.intro.size);
    setVal('introMarginTop', version.intro.marginTop);
    // Update color swatch state
    updateColorSwatchState('intro');
  }
  if (version.headline) {
    setVal('headlineFont', version.headline.font);
    setVal('headlineWeight', version.headline.weight);
    setVal('headlineTransform', version.headline.transform);
    setVal('headlineColor', version.headline.color);
    setVal('headlineSize', version.headline.size);
    setVal('headlineLineHeight', version.headline.lineHeight);
    setVal('headlineMarginTop', version.headline.marginTop);
    updateColorSwatchState('headline');
  }
  if (version.offer) {
    setVal('offerFont', version.offer.font);
    setVal('offerWeight', version.offer.weight);
    setVal('offerTransform', version.offer.transform);
    setVal('offerColor', version.offer.color);
    setVal('offerSize', version.offer.size);
    setVal('offerMarginTop', version.offer.marginTop);
    updateColorSwatchState('offer');
  }
  if (version.legend) {
    setVal('legendFont', version.legend.font);
    setVal('legendWeight', version.legend.weight);
    setVal('legendTransform', version.legend.transform);
    setVal('legendColor', version.legend.color);
    setVal('legendSize', version.legend.size);
    setVal('legendMarginTop', version.legend.marginTop);
    updateColorSwatchState('legend');
  }

  // Layer opacities
  if (version.layers) {
    setVal('bgLayerOpacity', version.layers.background);
    setVal('textLayerOpacity', version.layers.text);
    setVal('fgLayerOpacity', version.layers.foreground);
    // Update displays
    ['bgLayerOpacity', 'textLayerOpacity', 'fgLayerOpacity'].forEach(id => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(`${id}Val`);
      if (el && valEl) valEl.textContent = Math.round(parseFloat(el.value) * 100) + '%';
    });
  }

  // AI Canvas commands
  canvasDecorations = [];
  if (version.canvas) {
    if (version.canvas.background) {
      const cmd = parseDrawingCode(version.canvas.background, 'background');
      if (cmd) canvasDecorations.push(cmd);
    }
    if (version.canvas.text) {
      const cmd = parseDrawingCode(version.canvas.text, 'text');
      if (cmd) canvasDecorations.push(cmd);
    }
    if (version.canvas.foreground) {
      const cmd = parseDrawingCode(version.canvas.foreground, 'foreground');
      if (cmd) canvasDecorations.push(cmd);
    }
  }

  // Style prompt
  setVal('stylePrompt', version.stylePrompt || '');

  // Update slider value displays
  updateAllSliderDisplays();

  // Update override indicators
  updateElementOverrideIndicators();

  // Update layers card visibility
  updateLayersCardVisibility();

  // Update canvas info
  updateCanvasInfo();

  // Await generateAd to ensure fonts are loaded before rendering preview
  await generateAd();
  renderPreview();
  renderVersions();
}

// Update all slider value displays - delegates to updateDisplays() for consistency
function updateAllSliderDisplays() {
  updateDisplays();
}

// Update canvas info display
function updateCanvasInfo() {
  const width = document.getElementById('width')?.value || 1200;
  const height = document.getElementById('height')?.value || 628;
  const canvasInfo = document.getElementById('canvasInfo');
  if (canvasInfo) canvasInfo.textContent = `${width} × ${height} px`;
}

async function generateStyleThumbnail() {
  // Style specimen - a distilled visual representation of the style
  // Like a font preview showing "Aa" or a color swatch

  const template = getTemplateFromUI();
  await ensureFontLoaded(template.fontFamily);

  // Thumbnail dimensions - 2:1 ratio, high enough res for retina
  const thumbWidth = 200;
  const thumbHeight = 100;
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = thumbWidth;
  thumbCanvas.height = thumbHeight;
  const ctx = thumbCanvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const { bgColor, textColor, fontFamily, letterSpacing } = template;

  // 1. Background fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, thumbWidth, thumbHeight);

  // Default overrides for thumbnails (full opacity, all enabled)
  const defaultOverrides = {
    background: { opacity: 1, enabled: true },
    text: { opacity: 1, enabled: true },
    foreground: { opacity: 1, enabled: true }
  };

  // 2. Execute background canvas commands (gradients, patterns)
  executeCanvasCommands(ctx, thumbWidth, thumbHeight, 'background', bgColor, textColor, defaultOverrides);

  // 3. Set up text styling
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Reset lineWidth before text commands so we can detect if AI sets it
  ctx.lineWidth = 0;

  // 4. Execute text layer commands (shadows, strokes, fills)
  executeCanvasCommands(ctx, thumbWidth, thumbHeight, 'text', bgColor, textColor, defaultOverrides);

  // 5. Draw specimen text - large "Aa" that shows typography clearly
  const fontSize = 48;
  const fontWeight = template.headline.weight || '700';
  ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;

  // AI must set lineWidth > 0 to enable stroke (we reset it to 0 above)
  const hasStroke = ctx.lineWidth > 0;

  // Draw with letter spacing if set
  const text = 'Aa';
  if (letterSpacing !== 0) {
    const charSpacing = fontSize * letterSpacing;
    const totalWidth = ctx.measureText(text).width + (text.length - 1) * charSpacing;
    let charX = thumbWidth / 2 - totalWidth / 2;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charWidth = ctx.measureText(char).width;
      if (hasStroke) ctx.strokeText(char, charX + charWidth / 2, thumbHeight / 2);
      ctx.fillText(char, charX + charWidth / 2, thumbHeight / 2);
      charX += charWidth + charSpacing;
    }
  } else {
    if (hasStroke) ctx.strokeText(text, thumbWidth / 2, thumbHeight / 2);
    ctx.fillText(text, thumbWidth / 2, thumbHeight / 2);
  }

  // 6. Execute foreground canvas commands (borders, vignettes)
  executeCanvasCommands(ctx, thumbWidth, thumbHeight, 'foreground', bgColor, textColor, defaultOverrides);

  return thumbCanvas.toDataURL('image/png', 0.9);
}

// Save current state as a new version
async function saveCurrentVersion() {
  const thumbnail = await generateStyleThumbnail();
  const version = getCurrentVersion();

  const versionEntry = {
    id: Date.now(),
    timestamp: Date.now(),
    thumbnail: thumbnail,
    ...version
  };

  // Add to beginning of array
  savedVersions.unshift(versionEntry);

  // Limit to max items
  if (savedVersions.length > MAX_VERSIONS) {
    savedVersions = savedVersions.slice(0, MAX_VERSIONS);
  }

  activeVersionIndex = 0;
  persistVersions();
  renderVersions();
}

// Delete a saved version
function deleteVersion(index, event) {
  event.stopPropagation();
  savedVersions.splice(index, 1);

  if (activeVersionIndex === index) {
    activeVersionIndex = -1;
  } else if (activeVersionIndex > index) {
    activeVersionIndex--;
  }

  persistVersions();
  renderVersions();
}

// Render the versions strip with save button
function renderVersions() {
  const containers = [
    document.getElementById('styleHistory'),
    document.getElementById('styleHistoryExport')
  ];

  // Save button (only in builder, not export)
  const saveBtn = `
    <button class="version-save-btn" onclick="saveCurrentVersion()" title="Save current design as a version">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>
  `;

  const thumbs = savedVersions.map((version, index) => `
    <div class="style-thumb${index === activeVersionIndex ? ' active' : ''}"
         onclick="applyVersion(${index})"
         title="${escapeHtml(version.stylePrompt || 'Saved version')}">
      <img src="${escapeHtml(version.thumbnail || '')}" alt="Version ${index + 1}">
      <button class="style-thumb-delete" onclick="deleteVersion(${index}, event)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `).join('');

  containers.forEach((container, i) => {
    if (container) {
      // Only show save button in builder (first container)
      container.innerHTML = (i === 0 ? saveBtn : '') + thumbs;
    }
  });
}

// ==========================================
// AI CANVAS STYLING
// ==========================================

// Execute AI-generated canvas drawing commands with layer overrides
function executeCanvasCommands(targetCtx, width, height, layer, bgColor, textColor, overrides) {
  const layerOverride = overrides?.[layer] || { opacity: 1, enabled: true };

  // Skip if layer is disabled
  if (!layerOverride.enabled) return;

  const commands = canvasDecorations.filter(cmd => cmd.layer === layer);
  if (commands.length === 0) return;

  commands.forEach(cmd => {
    try {
      // For 'text' layer, don't save/restore - we want the styles to persist for text rendering
      if (layer !== 'text') {
        targetCtx.save();
        // Apply layer opacity
        if (layerOverride.opacity !== 1) {
          targetCtx.globalAlpha = layerOverride.opacity;
        }
      }

      // Execute the drawing function with context, dimensions, and colors
      if (typeof cmd.draw === 'function') {
        cmd.draw(targetCtx, width, height, bgColor, textColor);
      }

      if (layer !== 'text') {
        targetCtx.restore();
      }
    } catch (e) {
      console.warn('Canvas command failed:', e);
      if (layer !== 'text') {
        targetCtx.restore();
      }
    }
  });

  // For text layer, apply opacity to shadows/effects only
  // The actual text fill will be drawn at full opacity, but shadows/strokes will be dimmed
  if (layer === 'text' && layerOverride.opacity !== 1) {
    // Helper to scale color alpha
    const scaleColorAlpha = (color, opacity) => {
      if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return color;
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = match[1], g = match[2], b = match[3];
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
        return `rgba(${r}, ${g}, ${b}, ${a * opacity})`;
      }
      return color;
    };

    // Scale shadow opacity
    targetCtx.shadowColor = scaleColorAlpha(targetCtx.shadowColor, layerOverride.opacity);

    // Scale stroke opacity (text outlines are an AI effect)
    if (targetCtx.lineWidth > 0) {
      targetCtx.strokeStyle = scaleColorAlpha(targetCtx.strokeStyle, layerOverride.opacity);
    }

    // Note: globalAlpha and fillStyle are NOT modified - text fill renders at full opacity
    // Only the shadow and stroke effects are dimmed
  }
}

// Parse AI-generated drawing code into executable functions
function parseDrawingCode(code, layer) {
  try {
    // Validate code doesn't contain dangerous patterns
    // This is defense-in-depth for code stored in localStorage
    const dangerousPatterns = [
      /\beval\b/,
      /\bFunction\b/,
      /\bfetch\b/,
      /\bXMLHttpRequest\b/,
      /\blocalStorage\b/,
      /\bsessionStorage\b/,
      /\bdocument\b/,
      /\bwindow\b/,
      /\bglobalThis\b/,
      /\bimport\b/,
      /\brequire\b/,
      /\bpostMessage\b/,
      /\bconstructor\b/,
      /\b__proto__\b/,
      /\bprototype\b/
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        console.warn('Rejected canvas code containing dangerous pattern:', pattern);
        return null;
      }
    }

    // Create a function from the code string
    // The function receives: ctx, w, h, bg, fg (foreground/text color)
    const fn = new Function('ctx', 'w', 'h', 'bg', 'fg', code);
    return { layer, draw: fn, code }; // Store original code for saving versions
  } catch (e) {
    console.warn('Failed to parse drawing code:', e);
    return null;
  }
}

async function applyCanvasStyle() {
  const apiKey = localStorage.getItem('anthropic_api_key');
  if (!apiKey) {
    openApiKeyModal();
    return;
  }

  const prompt = document.getElementById('stylePrompt')?.value?.trim();
  if (!prompt) {
    alert('Please describe a visual style for the ad.');
    return;
  }

  const btn = document.getElementById('styleBtn');
  btn?.classList.add('loading');

  // Gather current state for context
  const currentState = {
    bgColor: document.getElementById('bgColor')?.value,
    textColor: document.getElementById('textColor')?.value,
    fontFamily: document.getElementById('fontFamily')?.value,
    fontScale: document.getElementById('fontScale')?.value,
    letterSpacing: document.getElementById('letterSpacing')?.value
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are a world-class advertising art director. Style this ad based on the request:

"${prompt}"

## THE AD
This is a performance marketing ad with a clear typographic hierarchy:
- INTRO (Whisper): Small qualifier text, identifies the audience
- HEADLINE (Shout): The hero text, largest element, emotional hook — 50% of visual weight
- OFFER (Speak): Clear call-to-action
- LEGEND (Murmur): Small trust signal or friction remover

The text is ALWAYS the hero. Every design decision must serve readability and impact.

## DESIGN PRINCIPLES
Study these references:
- Apple: Pristine simplicity, massive typography, restrained color, perfect contrast
- Nike: Bold, kinetic, high contrast, typography as graphic element
- Spotify: Vibrant duotones, energetic gradients, modern and fresh
- Stripe: Sophisticated gradients, subtle depth, premium feel
- Linear: Dark mode excellence, subtle glows, refined minimalism

Key principles:
- Contrast is king. Text must pop immediately.
- Restraint over decoration. Every element must earn its place.
- Typography IS the design. Don't compete with it.
- Shadows add depth, not noise. Subtle and purposeful.
- Color harmony matters. 2-3 colors maximum.
- White space is active design, not emptiness.

## CURRENT STATE
- Background: ${currentState.bgColor}
- Text: ${currentState.textColor}
- Font: ${currentState.fontFamily}

## YOUR CONTROLS

1. DESIGN (global settings):
   - bgColor: hex color for background
   - textColor: hex color for text (one color, hierarchy comes from size/weight)
   - fontFamily: Choose ONE font that matches the mood (MUST be exactly one of these):
     Display fonts (bold, impactful): Bebas Neue, Anton, Oswald, Archivo Black, Barlow Condensed
     Text fonts (readable, modern): Inter, Montserrat, Space Grotesk, DM Sans, Poppins, Roboto, Open Sans, Lato
     System fonts: Helvetica
   - fontScale: 0.5-1.5 (overall text size)
   - letterSpacing: -0.05 to 0.15

2. CANVAS (your creative playground — JS code for Canvas 2D API):
   This is where you create atmosphere, depth, and visual interest.
   Parameters available: ctx, w, h, bg, fg

   Three layers you control:

   "background" — Runs AFTER solid fill, BEFORE text
   Create depth and atmosphere behind the text:
   - Gradients: linear, radial, multi-stop color transitions
   - Geometric shapes: circles, rectangles, abstract forms
   - Patterns: grids, dots, lines, noise textures
   - Light effects: glows, spotlights, ambient color washes
   Example: ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(0,h*0.7,w,h*0.3);

   "text" — Sets context state for text rendering
   Make text pop with subtle effects:
   - Shadows: ctx.shadowColor, shadowBlur, shadowOffsetX/Y
   - Glow effects: colored shadows with blur
   - Stroke outlines: ctx.strokeStyle, lineWidth (use sparingly)
   Example: ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10;

   "foreground" — Runs AFTER text
   Finishing touches that frame the composition:
   - Borders and frames
   - Vignettes (darkened edges)
   - Overlays and gradients
   - Decorative elements that don't compete with text
   Example: ctx.strokeStyle = fg; ctx.lineWidth = 2; ctx.strokeRect(20,20,w-40,h-40);

## CRITICAL RULES
- Text legibility is sacred. Never reduce it.
- Background creates mood, it doesn't compete with text.
- Text shadows should lift, not muddy. Keep blur 8-20px, opacity 0.2-0.4.
- Foreground elements frame, they don't distract.
- When in doubt, do less. Empty canvas sections are fine.

Return ONLY valid JSON:
{
  "design": { "bgColor": "#...", "textColor": "#...", "fontFamily": "...", "fontScale": 1, "letterSpacing": 0 },
  "canvas": { "background": "// JS code or empty string", "text": "// JS code", "foreground": "" }
}`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid style JSON in response');
    }

    const styles = JSON.parse(jsonMatch[0]);

    // Clear previous canvas commands
    canvasDecorations = [];

    // Apply design changes (actual ad controls)
    if (styles.design) {
      const d = styles.design;

      if (d.bgColor && /^#[0-9A-Fa-f]{6}$/.test(d.bgColor)) {
        document.getElementById('bgColor').value = d.bgColor.toUpperCase();
        document.getElementById('bgColorPicker').value = d.bgColor;
      }
      if (d.textColor && /^#[0-9A-Fa-f]{6}$/.test(d.textColor)) {
        document.getElementById('textColor').value = d.textColor.toUpperCase();
        document.getElementById('textColorPicker').value = d.textColor;
      }
      if (d.fontFamily) {
        const fontSelect = document.getElementById('fontFamily');
        // Try exact match first, then case-insensitive match
        let option = Array.from(fontSelect.options).find(o => o.value === d.fontFamily);
        if (!option) {
          option = Array.from(fontSelect.options).find(o =>
            o.value.toLowerCase() === d.fontFamily.toLowerCase()
          );
        }
        if (option) {
          fontSelect.value = option.value;
          applyFontPreset(option.value);
        } else {
          console.warn('AI returned unknown font:', d.fontFamily);
        }
      }
      if (typeof d.fontScale === 'number' && d.fontScale >= 0.5 && d.fontScale <= 1.5) {
        document.getElementById('fontScale').value = d.fontScale;
      }
      if (typeof d.letterSpacing === 'number' && d.letterSpacing >= -0.05 && d.letterSpacing <= 0.15) {
        document.getElementById('letterSpacing').value = d.letterSpacing;
      }

      // Note: Per-element typography (sizes, weights, transforms) is left to the user.
      // AI controls mood (colors, font, atmosphere), user fine-tunes hierarchy.
    }

    // Parse and store canvas drawing commands
    if (styles.canvas) {
      if (styles.canvas.background) {
        const bgCmd = parseDrawingCode(styles.canvas.background, 'background');
        if (bgCmd) canvasDecorations.push(bgCmd);
      }
      if (styles.canvas.text) {
        const textCmd = parseDrawingCode(styles.canvas.text, 'text');
        if (textCmd) canvasDecorations.push(textCmd);
      }
      if (styles.canvas.foreground) {
        const fgCmd = parseDrawingCode(styles.canvas.foreground, 'foreground');
        if (fgCmd) canvasDecorations.push(fgCmd);
      }
    }

    // Reset layer opacities to 100% for new style
    resetLayerOpacities();

    // Update layers card visibility
    updateLayersCardVisibility();

    // Re-render the ad with new settings and canvas commands
    generateAd();

    // Auto-save as a version
    await saveCurrentVersion();

  } catch (error) {
    console.error('AI Style error:', error);
    alert('Error applying style: ' + error.message);
  } finally {
    btn?.classList.remove('loading');
  }
}

function clearCanvasStyle() {
  // Clear canvas drawing commands and re-render
  canvasDecorations = [];
  activeVersionIndex = -1;

  // Reset layer opacities and hide layers card
  resetLayerOpacities();
  updateLayersCardVisibility();

  generateAd();
  renderVersions();

  // Clear prompt
  const promptEl = document.getElementById('stylePrompt');
  if (promptEl) promptEl.value = '';
}

function resetBuilder() {
  // Clear localStorage for builder state
  localStorage.removeItem('ad_studio_state');

  // Clear canvas commands and deselect version
  canvasDecorations = [];
  activeVersionIndex = -1;
  renderVersions();

  // Reset layer opacities and hide layers card
  resetLayerOpacities();
  updateLayersCardVisibility();

  // Clear style prompt
  const promptEl = document.getElementById('stylePrompt');
  if (promptEl) promptEl.value = '';

  // Reset to defaults
  loadDefaults();

  // Re-render
  generateAd();
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize
const hasStoredState = loadAppState();
if (!hasStoredState) {
  loadDefaults();
}
updateApiKeyStatus();
loadVersions();
renderVersions();

// Restore active version (if any was saved)
if (typeof window._pendingActiveVersionIndex === 'number' && savedVersions[window._pendingActiveVersionIndex]) {
  applyVersion(window._pendingActiveVersionIndex);
  delete window._pendingActiveVersionIndex;
}

// Render size lists based on saved platform or default
const sizePlatform = document.getElementById('sizePlatform')?.value || 'reddit';
renderSizeList(sizePlatform);
const exportPlatform = document.getElementById('exportPlatform')?.value || 'reddit';
renderExportSizeList(exportPlatform);
renderDataTable();
renderVariationCards();
updateExportSummary();

// Set up new controls
setupElementColorPickers();
setupLayerControls();
updateLayersCardVisibility();

document.fonts.ready.then(() => generateAd());
