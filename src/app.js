// ==========================================
// AD STUDIO - Main Application
// ==========================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// AI-generated canvas decorations (rendered on canvas, exported with ad)
let canvasDecorations = [];

// Get layer overrides from UI (opacity > 0 = enabled)
// Uses helper to handle NaN (missing element) vs 0 (intentionally disabled)
function getLayerOverrides() {
  const parseOpacity = (id) => {
    const val = parseFloat(document.getElementById(id)?.value);
    return isNaN(val) ? 1 : val;
  };

  const bgOpacity = parseOpacity('bgLayerOpacity');
  const textOpacity = parseOpacity('textLayerOpacity');
  const fgOpacity = parseOpacity('fgLayerOpacity');

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
// KEYBOARD NAVIGATION
// ==========================================

document.addEventListener('keydown', (e) => {
  // Only handle arrow keys on Export tab when no input is focused
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

  const activeElement = document.activeElement;
  const isInputFocused = activeElement.tagName === 'INPUT' ||
                         activeElement.tagName === 'TEXTAREA' ||
                         activeElement.tagName === 'SELECT';
  if (isInputFocused) return;

  // Check if Export tab is active
  const exportTab = document.getElementById('export-tab');
  if (!exportTab || !exportTab.classList.contains('active')) return;

  // Navigate variations
  if (dataRows.length === 0) return;

  e.preventDefault();

  if (e.key === 'ArrowUp') {
    const newIndex = activeVariationIndex > 0 ? activeVariationIndex - 1 : dataRows.length - 1;
    selectVariation(newIndex);
  } else if (e.key === 'ArrowDown') {
    const newIndex = activeVariationIndex < dataRows.length - 1 ? activeVariationIndex + 1 : 0;
    selectVariation(newIndex);
  }
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

  // Each panel toggles independently (no accordion behavior)
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

// Clear element spacing override (reset to inherit from global)
function clearElementSpacing(elementId) {
  const slider = document.getElementById(`${elementId}Spacing`);
  if (slider) {
    slider.dataset.hasValue = 'false';
    slider.value = 0; // Reset to neutral position
  }
  updateSpacingSliderState(elementId);
  updateElementOverrideIndicators();
  generateAd();
  saveAppStateDebounced();
}

// Update spacing slider display and clear button visibility
function updateSpacingSliderState(elementId) {
  const slider = document.getElementById(`${elementId}Spacing`);
  const valEl = document.getElementById(`${elementId}SpacingVal`);
  const clearBtn = slider?.parentElement?.querySelector('.slider-clear-btn');

  if (!slider) return;

  // Use data-has-value to track if spacing was explicitly set
  const hasValue = slider.dataset.hasValue === 'true';

  if (hasValue) {
    if (valEl) valEl.textContent = Math.round(parseFloat(slider.value) * 100) + '%';
    if (clearBtn) clearBtn.classList.remove('hidden');
  } else {
    if (valEl) valEl.textContent = '';
    if (clearBtn) clearBtn.classList.add('hidden');
  }
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

// Clear all overrides for an element (font, color, spacing)
function clearElementOverrides(elementId) {
  // Clear font
  const fontSelect = document.getElementById(`${elementId}Font`);
  if (fontSelect) fontSelect.value = '';

  // Clear color
  const colorText = document.getElementById(`${elementId}Color`);
  const colorPicker = document.getElementById(`${elementId}ColorPicker`);
  if (colorText) colorText.value = '';
  if (colorPicker) colorPicker.value = '#FFFFFF';
  updateColorSwatchState(elementId);

  // Clear spacing
  const spacingSlider = document.getElementById(`${elementId}Spacing`);
  if (spacingSlider) {
    spacingSlider.dataset.hasValue = 'false';
    spacingSlider.value = 0;
  }
  updateSpacingSliderState(elementId);

  updateElementOverrideIndicators();
  generateAd();
  saveAppStateDebounced();
}

// Update element override indicators (blue dot when element has typography overrides)
function updateElementOverrideIndicators() {
  ['intro', 'headline', 'offer', 'legend'].forEach(elId => {
    const indicator = document.getElementById(`${elId}OverrideIndicator`);
    if (!indicator) return;

    const fontVal = document.getElementById(`${elId}Font`)?.value || '';
    const colorVal = document.getElementById(`${elId}Color`)?.value || '';
    const spacingEl = document.getElementById(`${elId}Spacing`);
    const spacingHasValue = spacingEl?.dataset.hasValue === 'true';

    // Check for any typography override
    const hasOverride =
      (fontVal !== '') ||
      (/^#[0-9A-Fa-f]{6}$/i.test(colorVal) || /^rgba?\(/i.test(colorVal)) ||
      spacingHasValue;

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

    // Wire up spacing slider
    const spacingSlider = document.getElementById(`${elId}Spacing`);
    if (spacingSlider) {
      spacingSlider.addEventListener('input', () => {
        spacingSlider.dataset.hasValue = 'true';
        updateSpacingSliderState(elId);
        updateElementOverrideIndicators();
        generateAd();
        saveAppStateDebounced();
      });
    }

    // Initialize swatch and spacing states
    updateColorSwatchState(elId);
    updateSpacingSliderState(elId);
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

        // Toggle disabled class on layer row (CSS attribute selectors don't track JS property changes)
        const layerRow = el.closest('.layer-row');
        if (layerRow) layerRow.classList.toggle('layer-disabled', parseFloat(el.value) === 0);

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

// Reset layer opacities to 25% (subtle default for AI effects) and update UI
function resetLayerOpacities() {
  ['bgLayerOpacity', 'textLayerOpacity', 'fgLayerOpacity'].forEach(id => {
    const el = document.getElementById(id);
    const valEl = document.getElementById(`${id}Val`);
    if (el) {
      el.value = 0.25;
      if (valEl) valEl.textContent = '25%';
      // Remove disabled class since opacity is now 25%
      const layerRow = el.closest('.layer-row');
      if (layerRow) layerRow.classList.remove('layer-disabled');
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
    { w: 1200, h: 675, label: 'Card', ratio: '16:9' },
    { w: 1440, h: 1080, label: 'Landscape', ratio: '4:3' }
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

  // Reset stroke state before text commands - AI must explicitly set both
  // lineWidth AND strokeStyle to get a visible stroke (prevents accidental black borders)
  targetCtx.lineWidth = 0;
  targetCtx.strokeStyle = 'transparent';

  // Text styling commands (with layer overrides)
  executeCanvasCommands(targetCtx, width, height, 'text', bgColor, textColor, layerOvr);

  // AI must set lineWidth > 0 and a visible strokeStyle to enable stroke
  const hasStroke = targetCtx.lineWidth > 0 && targetCtx.strokeStyle !== 'transparent';

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
  if (!el || el.dataset.hasValue !== 'true') return null;
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
  const getTransform = (elementId) => {
    const val = document.getElementById(`${elementId}Transform`)?.value;
    // Empty string means "Inherit" - use global transform
    return val === '' ? globalTransform : val;
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
      transform: getTransform('intro'),
      marginTop: parseFloat(document.getElementById('introMarginTop')?.value) || 0,
      fontFamily: getElementFont('intro'),
      letterSpacing: getElementSpacing('intro'),
      color: getElementColor('intro')
    },
    headline: {
      size: parseFloat(document.getElementById('headlineSize')?.value) || 0.16,
      weight: document.getElementById('headlineWeight')?.value || '700',
      transform: getTransform('headline'),
      marginTop: parseFloat(document.getElementById('headlineMarginTop')?.value) || 0.02,
      lineHeight: parseFloat(document.getElementById('headlineLineHeight')?.value) || 1.05,
      fontFamily: getElementFont('headline'),
      letterSpacing: getElementSpacing('headline'),
      color: getElementColor('headline')
    },
    offer: {
      size: parseFloat(document.getElementById('offerSize')?.value) || 0.11,
      weight: document.getElementById('offerWeight')?.value || '800',
      transform: getTransform('offer'),
      marginTop: parseFloat(document.getElementById('offerMarginTop')?.value) || 0.15,
      fontFamily: getElementFont('offer'),
      letterSpacing: getElementSpacing('offer'),
      color: getElementColor('offer')
    },
    legend: {
      size: parseFloat(document.getElementById('legendSize')?.value) || 0.035,
      weight: document.getElementById('legendWeight')?.value || '400',
      transform: getTransform('legend'),
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

async function downloadAd() {
  const w = parseInt(document.getElementById('width')?.value) || 1200;
  const h = parseInt(document.getElementById('height')?.value) || 628;

  const template = getTemplateFromUI();
  const content = getContentFromUI();

  // Ensure all fonts are loaded (global + per-element overrides)
  const fontsToLoad = new Set([template.fontFamily]);
  ['intro', 'headline', 'offer', 'legend'].forEach(el => {
    if (template[el]?.fontFamily) {
      fontsToLoad.add(template[el].fontFamily);
    }
  });
  await Promise.all(Array.from(fontsToLoad).map(f => ensureFontLoaded(f)));

  // Create 1x version
  const canvas1x = document.createElement('canvas');
  canvas1x.width = w;
  canvas1x.height = h;
  const ctx1x = canvas1x.getContext('2d');
  ctx1x.imageSmoothingEnabled = true;
  ctx1x.imageSmoothingQuality = 'high';
  renderAdToCanvas(ctx1x, w, h, template, content, 1);
  const pngData1x = embedPngDpi(canvas1x.toDataURL('image/png'), 72);

  // Create 2x version
  const canvas2x = document.createElement('canvas');
  canvas2x.width = w * 2;
  canvas2x.height = h * 2;
  const ctx2x = canvas2x.getContext('2d');
  ctx2x.imageSmoothingEnabled = true;
  ctx2x.imageSmoothingQuality = 'high';
  renderAdToCanvas(ctx2x, w, h, template, content, 2);
  const pngData2x = embedPngDpi(canvas2x.toDataURL('image/png'), 144);

  // Download both files
  const link1x = document.createElement('a');
  link1x.download = `ad-${w}x${h}@1x.png`;
  link1x.href = pngData1x;
  link1x.click();

  // Small delay to ensure both downloads trigger
  await new Promise(resolve => setTimeout(resolve, 100));

  const link2x = document.createElement('a');
  link2x.download = `ad-${w}x${h}@2x.png`;
  link2x.href = pngData2x;
  link2x.click();
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
  document.getElementById('productBrief').value = '';
  document.getElementById('productBriefData').value = '';
  document.getElementById('stylePrompt').value = '';
  // Empty brief = unchecked and disabled (consistent with updateProductCheckboxState)
  document.getElementById('updateCopyCheckbox').checked = false;
  document.getElementById('updateCopyCheckbox').disabled = true;
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

// Reset element overrides to "Inherit" when a global setting changes
function resetElementOverridesToInherit(globalId) {
  const elements = ['intro', 'headline', 'offer', 'legend'];

  if (globalId === 'fontFamily') {
    // Reset all element font overrides to inherit
    elements.forEach(el => {
      const select = document.getElementById(`${el}Font`);
      if (select) select.value = '';
    });
    updateElementOverrideIndicators();
  } else if (globalId === 'textTransform') {
    // Reset all element transform overrides to inherit
    elements.forEach(el => {
      const select = document.getElementById(`${el}Transform`);
      if (select) select.value = '';
    });
  }
}

// Throttle render calls for smooth slider dragging (especially on Safari)
let builderRafPending = false;
document.querySelectorAll('#builder-tab input, #builder-tab select').forEach(input => {
  input.addEventListener('input', (e) => {
    // When global typography settings change, reset element overrides to inherit
    if (e.target.id === 'fontFamily' || e.target.id === 'textTransform') {
      resetElementOverridesToInherit(e.target.id);
    }

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
        // Per-element typography overrides (empty string means inherit)
        // For spacing, only save if explicitly set (dataset.hasValue), otherwise save empty string
        introFont: document.getElementById('introFont')?.value,
        introColor: document.getElementById('introColor')?.value,
        introSpacing: document.getElementById('introSpacing')?.dataset.hasValue === 'true' ? document.getElementById('introSpacing')?.value : '',
        headlineFont: document.getElementById('headlineFont')?.value,
        headlineColor: document.getElementById('headlineColor')?.value,
        headlineSpacing: document.getElementById('headlineSpacing')?.dataset.hasValue === 'true' ? document.getElementById('headlineSpacing')?.value : '',
        offerFont: document.getElementById('offerFont')?.value,
        offerColor: document.getElementById('offerColor')?.value,
        offerSpacing: document.getElementById('offerSpacing')?.dataset.hasValue === 'true' ? document.getElementById('offerSpacing')?.value : '',
        legendFont: document.getElementById('legendFont')?.value,
        legendColor: document.getElementById('legendColor')?.value,
        legendSpacing: document.getElementById('legendSpacing')?.dataset.hasValue === 'true' ? document.getElementById('legendSpacing')?.value : '',
        // AI Style settings
        productBrief: document.getElementById('productBrief')?.value,
        stylePrompt: document.getElementById('stylePrompt')?.value,
        updateCopy: document.getElementById('updateCopyCheckbox')?.checked
      },
      // Data tab
      data: {
        variations: dataRows,
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

      // Update all slider value displays using the canonical function
      updateDisplays();

      // Restore per-element colors and spacing, update swatch states
      // Supports both hex and rgba formats for colors
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

        // Restore spacing with data attribute
        const spacingSlider = document.getElementById(`${elId}Spacing`);
        const spacing = b[`${elId}Spacing`];
        if (spacingSlider) {
          const hasVal = spacing !== undefined && spacing !== null && spacing !== '';
          spacingSlider.dataset.hasValue = hasVal ? 'true' : 'false';
          if (hasVal) spacingSlider.value = spacing;
          updateSpacingSliderState(elId);
        }
      });

      // Update override indicators after restoring all element states
      updateElementOverrideIndicators();

      // Restore AI Style settings
      if (b.productBrief) {
        const builderEl = document.getElementById('productBrief');
        const dataEl = document.getElementById('productBriefData');
        if (builderEl) builderEl.value = b.productBrief;
        if (dataEl) dataEl.value = b.productBrief;
      }
      if (b.stylePrompt) {
        const el = document.getElementById('stylePrompt');
        if (el) el.value = b.stylePrompt;
      }
      if (typeof b.updateCopy === 'boolean') {
        const el = document.getElementById('updateCopyCheckbox');
        if (el) el.checked = b.updateCopy;
      }
    }

    // Restore Data tab
    if (state.data) {
      dataRows = state.data.variations || [];
      if (dataRows.length > 0) {
        activeVariationIndex = 0;
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
// DATA IMPORT/EXPORT (CSV)
// ==========================================

function exportDataCSV() {
  if (dataRows.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = ['intro', 'headline1', 'headline2', 'offer', 'legend'];
  const csvRows = [headers.join(',')];

  dataRows.forEach(row => {
    const values = headers.map(h => {
      const val = row[h] || '';
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });
    csvRows.push(values.join(','));
  });

  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ad-variations.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function importDataCSV() {
  document.getElementById('csvFileInput').click();
}

function handleCSVImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const rows = parseCSV(text);

    if (rows.length === 0) {
      alert('No data found in file');
      return;
    }

    // Detect headers
    const firstRow = rows[0].map(c => c.toLowerCase().trim());
    const headerMap = {};
    const knownHeaders = ['intro', 'headline1', 'headline2', 'offer', 'legend', 'headline 1', 'headline 2'];

    let hasHeaders = false;
    firstRow.forEach((cell, i) => {
      if (knownHeaders.includes(cell)) {
        hasHeaders = true;
        // Normalize header names
        const normalized = cell.replace(' ', '');
        headerMap[normalized] = i;
      }
    });

    // If no headers detected, assume column order: intro, headline1, headline2, offer, legend
    if (!hasHeaders) {
      headerMap.intro = 0;
      headerMap.headline1 = 1;
      headerMap.headline2 = 2;
      headerMap.offer = 3;
      headerMap.legend = 4;
    }

    const dataStartIndex = hasHeaders ? 1 : 0;
    const importedRows = [];

    for (let i = dataStartIndex; i < rows.length; i++) {
      const row = rows[i];
      if (row.every(cell => !cell.trim())) continue; // Skip empty rows

      importedRows.push({
        intro: row[headerMap.intro] || '',
        headline1: row[headerMap.headline1] || '',
        headline2: row[headerMap.headline2] || '',
        offer: row[headerMap.offer] || '',
        legend: row[headerMap.legend] || '',
        selected: true
      });
    }

    if (importedRows.length === 0) {
      alert('No valid rows found in file');
      return;
    }

    // Add to existing data
    dataRows.push(...importedRows);
    saveAppStateDebounced();
    renderDataTable();
    renderVariationCards();

    alert(`Imported ${importedRows.length} row${importedRows.length > 1 ? 's' : ''}`);
  };

  reader.readAsText(file);
  // Reset input so same file can be imported again
  event.target.value = '';
}

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',' || char === '\t') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentCell.trim());
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        if (char === '\r') i++; // Skip \n in \r\n
      } else if (char !== '\r') {
        currentCell += char;
      }
    }
  }

  // Don't forget last cell/row
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell)) rows.push(currentRow);
  }

  return rows;
}

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
  // Each variation-size combination exports 2 files (1x and 2x)
  const totalFiles = selectedVariations * selectedSizesCount * 2;

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
  } else {
    localStorage.removeItem('anthropic_api_key');
  }
  updateApiKeyStatus();
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
  // Also update demo mode badge visibility
  if (typeof updateDemoModeUI === 'function') {
    updateDemoModeUI();
  }
}

// ==========================================
// AI GENERATION
// ==========================================

// Demo mode state (rate limit info from proxy)
let demoModeState = {
  remaining: null,
  resetAt: null
};

function updateDemoModeUI() {
  const badge = document.getElementById('demoModeBadge');
  if (!badge) return;

  const hasUserKey = !!localStorage.getItem('anthropic_api_key');
  badge.classList.toggle('hidden', hasUserKey);
}

// Unified API call handler - uses proxy in demo mode, direct API with user key
async function callAnthropicAPI(type, messages, maxTokens, model) {
  const userApiKey = localStorage.getItem('anthropic_api_key');

  if (userApiKey) {
    // Direct API call with user's key
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': userApiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: maxTokens,
        messages: messages
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    return response.json();
  } else {
    // Demo mode - use proxy
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: type,
        messages: messages,
        max_tokens: maxTokens
      })
    });

    // Update demo mode state from headers
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const resetAt = response.headers.get('X-RateLimit-Reset');

    if (remaining !== null) {
      demoModeState.remaining = parseInt(remaining);
    }
    if (resetAt) {
      demoModeState.resetAt = parseInt(resetAt) * 1000;
    }
    updateDemoModeUI();

    if (response.status === 429) {
      const error = await response.json();
      const minsUntilReset = Math.ceil((error.resetAt - Date.now()) / 1000 / 60);
      throw new Error(`Demo limit reached (resets in ${minsUntilReset} min). Add your API key for unlimited access.`);
    }

    if (response.status === 503) {
      const error = await response.json();
      throw new Error(error.message || 'Demo mode unavailable. Please add your API key.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || error.message || 'API request failed');
    }

    return response.json();
  }
}

async function generateWithAI() {
  // Use shared product brief from Product section
  const prompt = document.getElementById('productBrief')?.value?.trim();
  if (!prompt) {
    alert('Please describe your product in Builder > Product first.');
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

  const messageContent = `${systemPrompt}

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
[{"intro": "...", "headline1": "...", "headline2": "...", "offer": "...", "legend": "..."}, ...]`;

  try {
    const data = await callAnthropicAPI(
      'copy',
      [{ role: 'user', content: messageContent }],
      2048,  // Sufficient for ~8-10 variations; matches server limit for demo mode
      'claude-opus-4-5-20251101'
    );
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
        // Export 1x version (root folder)
        const pngData1x = await renderAdToDataUrl(row, template, width, height, 1);
        const base641x = pngData1x.split(',')[1];
        zip.file(`${varNum}-${width}x${height}.png`, base641x, { base64: true });

        // Export 2x version (@2x folder)
        const pngData2x = await renderAdToDataUrl(row, template, width, height, 2);
        const base642x = pngData2x.split(',')[1];
        zip.file(`@2x/${varNum}-${width}x${height}.png`, base642x, { base64: true });
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

async function renderAdToDataUrl(row, template, width, height, scale = 1) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width * scale;
  tempCanvas.height = height * scale;
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

  renderAdToCanvas(tempCtx, width, height, template, content, scale);

  const effectiveDpi = 72 * scale;
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
      savedVersions = JSON.parse(saved).map(migrateTemplate);
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
  // For spacing, only return value if explicitly set (dataset.hasValue)
  const getSpacing = (id) => {
    const el = document.getElementById(id);
    return el?.dataset.hasValue === 'true' ? el.value : '';
  };

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

    // Copy content
    content: {
      intro: getVal('introText'),
      headline1: getVal('headlineText1'),
      headline2: getVal('headlineText2'),
      offer: getVal('offerText'),
      legend: getVal('legendText')
    },

    // Per-element settings
    intro: {
      font: getVal('introFont'),
      weight: getVal('introWeight'),
      transform: getVal('introTransform'),
      color: getVal('introColor'),
      spacing: getSpacing('introSpacing'),
      size: getNum('introSize'),
      marginTop: getNum('introMarginTop')
    },
    headline: {
      font: getVal('headlineFont'),
      weight: getVal('headlineWeight'),
      transform: getVal('headlineTransform'),
      color: getVal('headlineColor'),
      spacing: getSpacing('headlineSpacing'),
      size: getNum('headlineSize'),
      lineHeight: getNum('headlineLineHeight'),
      marginTop: getNum('headlineMarginTop')
    },
    offer: {
      font: getVal('offerFont'),
      weight: getVal('offerWeight'),
      transform: getVal('offerTransform'),
      color: getVal('offerColor'),
      spacing: getSpacing('offerSpacing'),
      size: getNum('offerSize'),
      marginTop: getNum('offerMarginTop')
    },
    legend: {
      font: getVal('legendFont'),
      weight: getVal('legendWeight'),
      transform: getVal('legendTransform'),
      color: getVal('legendColor'),
      spacing: getSpacing('legendSpacing'),
      size: getNum('legendSize'),
      marginTop: getNum('legendMarginTop')
    },

    // Layer opacities (0 = disabled, which is a valid user choice)
    layers: {
      background: getNum('bgLayerOpacity'),
      text: getNum('textLayerOpacity'),
      foreground: getNum('fgLayerOpacity')
    },

    // AI Canvas effects (stored as effect names for lookup in EFFECT_LIBRARY)
    // Supports multiple effects per layer stored as arrays
    canvas: {
      background: canvasDecorations.filter(c => c.layer === 'background').map(c => c.effectName),
      text: canvasDecorations.filter(c => c.layer === 'text').map(c => c.effectName),
      foreground: canvasDecorations.filter(c => c.layer === 'foreground').map(c => c.effectName)
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

  const setColor = (pickerId, textId, val, isGlobal = false) => {
    const textEl = document.getElementById(textId);
    const picker = document.getElementById(pickerId);

    if (val) {
      if (textEl) textEl.value = val;
      if (picker && /^#[0-9A-Fa-f]{6}$/i.test(val)) {
        picker.value = val;
      }
    } else if (!isGlobal) {
      // For per-element colors, empty value means "inherit from global"
      if (textEl) textEl.value = '';
      if (picker) picker.value = '#FFFFFF';
    }
  };

  // Canvas size
  setVal('width', version.width);
  setVal('height', version.height);

  // Colors (global colors should always have a value)
  setColor('bgColorPicker', 'bgColor', version.bgColor, true);
  setColor('textColorPicker', 'textColor', version.textColor, true);

  // Global Typography
  setVal('fontFamily', version.fontFamily);
  setVal('fontScale', version.fontScale);
  setVal('letterSpacing', version.letterSpacing);
  setVal('textTransform', version.textTransform);

  // Layout
  setVal('opticalYOffset', version.opticalYOffset);

  // Copy content
  if (version.content) {
    setVal('introText', version.content.intro);
    setVal('headlineText1', version.content.headline1);
    setVal('headlineText2', version.content.headline2);
    setVal('offerText', version.content.offer);
    setVal('legendText', version.content.legend);
  }

  // Per-element settings
  // Helper to set spacing with data attribute
  const setSpacing = (elId, val) => {
    const slider = document.getElementById(`${elId}Spacing`);
    if (slider) {
      const hasVal = val !== undefined && val !== null && val !== '';
      slider.dataset.hasValue = hasVal ? 'true' : 'false';
      if (hasVal) slider.value = val;
    }
  };

  if (version.intro) {
    setVal('introFont', version.intro.font);
    setVal('introWeight', version.intro.weight);
    setVal('introTransform', version.intro.transform);
    setColor('introColorPicker', 'introColor', version.intro.color);
    setSpacing('intro', version.intro.spacing);
    setVal('introSize', version.intro.size);
    setVal('introMarginTop', version.intro.marginTop);
    updateColorSwatchState('intro');
    updateSpacingSliderState('intro');
  }
  if (version.headline) {
    setVal('headlineFont', version.headline.font);
    setVal('headlineWeight', version.headline.weight);
    setVal('headlineTransform', version.headline.transform);
    setColor('headlineColorPicker', 'headlineColor', version.headline.color);
    setSpacing('headline', version.headline.spacing);
    setVal('headlineSize', version.headline.size);
    setVal('headlineLineHeight', version.headline.lineHeight);
    setVal('headlineMarginTop', version.headline.marginTop);
    updateColorSwatchState('headline');
    updateSpacingSliderState('headline');
  }
  if (version.offer) {
    setVal('offerFont', version.offer.font);
    setVal('offerWeight', version.offer.weight);
    setVal('offerTransform', version.offer.transform);
    setColor('offerColorPicker', 'offerColor', version.offer.color);
    setSpacing('offer', version.offer.spacing);
    setVal('offerSize', version.offer.size);
    setVal('offerMarginTop', version.offer.marginTop);
    updateColorSwatchState('offer');
    updateSpacingSliderState('offer');
  }
  if (version.legend) {
    setVal('legendFont', version.legend.font);
    setVal('legendWeight', version.legend.weight);
    setVal('legendTransform', version.legend.transform);
    setColor('legendColorPicker', 'legendColor', version.legend.color);
    setSpacing('legend', version.legend.spacing);
    setVal('legendSize', version.legend.size);
    setVal('legendMarginTop', version.legend.marginTop);
    updateColorSwatchState('legend');
    updateSpacingSliderState('legend');
  }

  // Layer opacities
  if (version.layers) {
    setVal('bgLayerOpacity', version.layers.background);
    setVal('textLayerOpacity', version.layers.text);
    setVal('fgLayerOpacity', version.layers.foreground);
    // Update displays and disabled class
    ['bgLayerOpacity', 'textLayerOpacity', 'fgLayerOpacity'].forEach(id => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(`${id}Val`);
      if (el && valEl) valEl.textContent = Math.round(parseFloat(el.value) * 100) + '%';
      const layerRow = el?.closest('.layer-row');
      if (layerRow) layerRow.classList.toggle('layer-disabled', parseFloat(el.value) === 0);
    });
  }

  // AI Canvas effects (lookup from EFFECT_LIBRARY by name)
  canvasDecorations = [];
  if (version.canvas) {
    ['background', 'text', 'foreground'].forEach(layer => {
      const effects = version.canvas[layer] || [];
      effects.forEach(effectName => {
        if (effectName && EFFECT_LIBRARY[layer]?.[effectName]) {
          canvasDecorations.push({
            layer,
            draw: EFFECT_LIBRARY[layer][effectName],
            effectName
          });
        }
      });
    });
  }

  // Style prompt
  setVal('stylePrompt', version.stylePrompt || '');

  // Update UI state
  updateDisplays();
  updateElementOverrideIndicators();
  updateLayersCardVisibility();
  updateCanvasInfo();

  // Render and save
  await generateAd();
  renderPreview();
  renderVersions();
  updateTemplateActionButtons();
  saveAppStateDebounced();
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

  // Reset stroke state before text commands - AI must explicitly set both
  // lineWidth AND strokeStyle to get a visible stroke (prevents accidental black borders)
  ctx.lineWidth = 0;
  ctx.strokeStyle = 'transparent';

  // 4. Execute text layer commands (shadows, strokes, fills)
  executeCanvasCommands(ctx, thumbWidth, thumbHeight, 'text', bgColor, textColor, defaultOverrides);

  // 5. Draw specimen text - large "Aa" that shows typography clearly
  const fontSize = 48;
  const fontWeight = template.headline.weight || '700';
  ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;

  // AI must set lineWidth > 0 and a visible strokeStyle to enable stroke
  const hasStroke = ctx.lineWidth > 0 && ctx.strokeStyle !== 'transparent';

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
  saveAppStateDebounced();
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
  saveAppStateDebounced();
}

// Export a single template as JSON
function exportTemplate(index, event) {
  if (event) event.stopPropagation();

  const version = savedVersions[index];
  if (!version) return;

  // Export without thumbnail (it's large and can be regenerated)
  const { thumbnail, ...template } = version;

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    template: template
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  // Use style prompt for filename if available
  const name = (version.stylePrompt || 'template').slice(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase();
  a.download = `ad-template-${name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export the currently selected template
function exportCurrentTemplate() {
  if (activeVersionIndex >= 0 && savedVersions[activeVersionIndex]) {
    exportTemplate(activeVersionIndex);
  }
}

// Delete the currently selected template
function deleteCurrentTemplate() {
  if (activeVersionIndex >= 0 && savedVersions[activeVersionIndex]) {
    if (!confirm('Delete this template?')) return;

    savedVersions.splice(activeVersionIndex, 1);
    activeVersionIndex = -1;
    persistVersions();
    renderVersions();
    updateTemplateActionButtons();
    saveAppStateDebounced();
  }
}

// Update template action button states based on selection
function updateTemplateActionButtons() {
  const hasSelection = activeVersionIndex >= 0 && savedVersions[activeVersionIndex];
  const exportBtn = document.getElementById('exportTemplateBtn');
  const deleteBtn = document.getElementById('deleteTemplateBtn');

  if (exportBtn) exportBtn.disabled = !hasSelection;
  if (deleteBtn) deleteBtn.disabled = !hasSelection;
}

// Migrate template to current format (normalizes legacy data)
function migrateTemplate(template) {
  const migrated = { ...template };

  // Normalize canvas effects to arrays
  if (migrated.canvas) {
    ['background', 'text', 'foreground'].forEach(layer => {
      const val = migrated.canvas[layer];
      if (val === null || val === undefined) {
        migrated.canvas[layer] = [];
      } else if (!Array.isArray(val)) {
        migrated.canvas[layer] = [val];
      }
    });
  } else {
    migrated.canvas = { background: [], text: [], foreground: [] };
  }

  return migrated;
}

// Import template from JSON
function importTemplate() {
  document.getElementById('templateFileInput').click();
}

async function handleTemplateImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    // Save current state before any modifications
    const originalVersion = getCurrentVersion();
    const originalDecorations = [...canvasDecorations];
    const originalIndex = activeVersionIndex;

    try {
      const data = JSON.parse(e.target.result);

      // Support both single template and legacy multi-template format
      let template = data.template || (data.templates && data.templates[0]);

      if (!template) {
        alert('Invalid template file format');
        return;
      }

      // Migrate template to current format
      template = migrateTemplate(template);

      // Apply the imported template settings to generate thumbnail
      await applyVersionData(template);
      const thumbnail = await generateStyleThumbnail();

      // Restore original state
      await applyVersionData(originalVersion);
      canvasDecorations = originalDecorations;

      // Add imported template
      savedVersions.unshift({
        ...template,
        id: Date.now(),
        timestamp: Date.now(),
        thumbnail
      });

      // Limit to max
      if (savedVersions.length > MAX_VERSIONS) {
        savedVersions = savedVersions.slice(0, MAX_VERSIONS);
      }

      // Adjust activeVersionIndex to account for the unshift
      // (all existing indices shift by 1)
      activeVersionIndex = originalIndex >= 0 ? originalIndex + 1 : originalIndex;

      persistVersions();
      renderVersions();
      generateAd(); // Restore display
    } catch (err) {
      // Restore original state on any error
      await applyVersionData(originalVersion);
      canvasDecorations = originalDecorations;
      activeVersionIndex = originalIndex;
      generateAd();

      console.error('Template import error:', err);
      alert('Failed to import template: ' + err.message);
    }
  };

  reader.readAsText(file);
  event.target.value = '';
}

// Apply version data without updating activeVersionIndex (for import thumbnail generation)
async function applyVersionData(version) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  // Canvas size
  setVal('width', version.width);
  setVal('height', version.height);

  // Colors
  setVal('bgColor', version.bgColor);
  setVal('bgColorPicker', version.bgColor);
  setVal('textColor', version.textColor);
  setVal('textColorPicker', version.textColor);

  // Global Typography
  setVal('fontFamily', version.fontFamily);
  setVal('fontScale', version.fontScale);
  setVal('letterSpacing', version.letterSpacing);
  setVal('textTransform', version.textTransform);

  // Layout
  setVal('opticalYOffset', version.opticalYOffset);

  // Copy content
  if (version.content) {
    setVal('introText', version.content.intro);
    setVal('headlineText1', version.content.headline1);
    setVal('headlineText2', version.content.headline2);
    setVal('offerText', version.content.offer);
    setVal('legendText', version.content.legend);
  }

  // Per-element settings
  ['intro', 'headline', 'offer', 'legend'].forEach(el => {
    if (version[el]) {
      setVal(`${el}Font`, version[el].font);
      setVal(`${el}Weight`, version[el].weight);
      setVal(`${el}Transform`, version[el].transform);
      setVal(`${el}Color`, version[el].color);
      // Set spacing with data attribute
      const spacingSlider = document.getElementById(`${el}Spacing`);
      if (spacingSlider) {
        const hasVal = version[el].spacing !== undefined && version[el].spacing !== null && version[el].spacing !== '';
        spacingSlider.dataset.hasValue = hasVal ? 'true' : 'false';
        if (hasVal) spacingSlider.value = version[el].spacing;
      }
      setVal(`${el}Size`, version[el].size);
      setVal(`${el}MarginTop`, version[el].marginTop);
      if (el === 'headline') {
        setVal('headlineLineHeight', version[el].lineHeight);
      }
    }
  });

  // Layer opacities
  if (version.layers) {
    setVal('bgLayerOpacity', version.layers.background);
    setVal('textLayerOpacity', version.layers.text);
    setVal('fgLayerOpacity', version.layers.foreground);
  }

  // Canvas effects (arrays of effect names per layer)
  canvasDecorations = [];
  if (version.canvas) {
    ['background', 'text', 'foreground'].forEach(layer => {
      const effects = version.canvas[layer] || [];
      effects.forEach(effectName => {
        if (effectName && EFFECT_LIBRARY[layer]?.[effectName]) {
          canvasDecorations.push({
            layer,
            draw: EFFECT_LIBRARY[layer][effectName],
            effectName
          });
        }
      });
    });
  }

  // Style prompt
  setVal('stylePrompt', version.stylePrompt || '');
}

// Render the versions strip
function renderVersions() {
  const containers = [
    document.getElementById('styleHistory'),
    document.getElementById('styleHistoryExport')
  ];

  // Save button (+ icon)
  const saveBtn = `
    <button class="version-save-btn" onclick="saveCurrentVersion()" title="Save current style">
      <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
  `;

  const thumbs = savedVersions.map((version, index) => `
    <div class="style-thumb${index === activeVersionIndex ? ' active' : ''}"
         onclick="applyVersion(${index})"
         title="${escapeHtml(version.stylePrompt || 'Saved version')}">
      <img src="${escapeHtml(version.thumbnail || '')}" alt="Version ${index + 1}">
    </div>
  `).join('');

  containers.forEach((container) => {
    if (container) {
      container.innerHTML = saveBtn + thumbs;
    }
  });

  updateTemplateActionButtons();
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
    // Helper to scale color alpha (supports hex and rgba formats)
    const scaleColorAlpha = (color, opacity) => {
      if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return color;

      // Handle hex colors (#RGB, #RRGGBB)
      const hexMatch = color.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
      if (hexMatch) {
        let hex = hexMatch[1];
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // Handle rgba/rgb colors
      const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (rgbaMatch) {
        const r = rgbaMatch[1], g = rgbaMatch[2], b = rgbaMatch[3];
        const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
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

async function applyCanvasStyle() {
  const productBrief = document.getElementById('productBrief')?.value?.trim();
  const stylePrompt = document.getElementById('stylePrompt')?.value?.trim();
  const updateCopy = productBrief && document.getElementById('updateCopyCheckbox')?.checked;

  if (!productBrief && !stylePrompt) {
    alert('Please describe what you\'re advertising or specify a visual style.');
    return;
  }

  const btn = document.getElementById('styleBtn');
  btn?.classList.add('loading');

  // Gather current state for context
  const currentState = {
    bgColor: document.getElementById('bgColor')?.value,
    textColor: document.getElementById('textColor')?.value,
    fontFamily: document.getElementById('fontFamily')?.value
  };

  // Build the effect options list from EFFECT_LIBRARY
  const bgEffects = Object.keys(EFFECT_LIBRARY.background).join(', ');
  const textEffects = Object.keys(EFFECT_LIBRARY.text).join(', ');
  const fgEffects = Object.keys(EFFECT_LIBRARY.foreground).join(', ');

  // Build font list from FONT_MOODS with descriptions (shuffled to avoid AI bias)
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const shuffledMoods = shuffle(Object.entries(FONT_MOODS));
  const fontList = shuffledMoods.map(([mood, data]) => {
    const shuffledFonts = shuffle(data.fonts);
    const fontEntries = shuffledFonts.map(f => `${f.name} (${f.desc})`).join(', ');
    return `${mood.toUpperCase()}: ${data.description}\n       → ${fontEntries}`;
  }).join('\n     ');

  // Build brief section based on available context
  let briefSection = '## BRIEF\n';
  if (productBrief) {
    briefSection += `Product/Service: ${productBrief}\n`;
  }
  if (stylePrompt) {
    briefSection += `Visual Style: ${stylePrompt}`;
  } else if (productBrief) {
    briefSection += 'Visual Style: Choose an appropriate style based on the product.';
  } else {
    briefSection += 'Visual Style: Create a visually striking design based on the style description.';
  }

  // Conditionally include copy generation instructions
  const copySection = updateCopy ? `
4. SAMPLE COPY (required)
   Create compelling ad copy that matches the visual style. Use the 4-voice hierarchy:
   - intro: Short qualifier (2-4 words, e.g., "For Creators", "Finally", "Tired of X?")
   - headline1: First line of emotional hook (punchy, 3-6 words)
   - headline2: Second line of emotional hook (completes the thought)
   - offer: Clear CTA with value (e.g., "Start Free Today", "Get 50% Off")
   - legend: Trust signal (e.g., "No credit card required", "Join 10,000+ users")
` : '';

  const copyRule = updateCopy ? '\n- Copy should match the mood and energy of the visual style' : '';

  const copyJsonExample = updateCopy
    ? ',\n  "copy": { "intro": "...", "headline1": "...", "headline2": "...", "offer": "...", "legend": "..." }'
    : '';

  const messageContent = `You are a world-class advertising art director. Create a complete ad design.

${briefSection}

## DESIGN PHILOSOPHY
- Typography is 80% of the design — the ad must look stunning with ZERO effects
- Color creates mood, contrast creates readability (minimum 4.5:1 ratio)
- Effects enhance, never compete — when in doubt, use "none"
- Restraint over decoration — every choice must earn its place

## CURRENT STATE
- Background: ${currentState.bgColor}
- Text: ${currentState.textColor}
- Font: ${currentState.fontFamily}

## YOUR CONTROLS

1. COLORS (required)
   - bgColor: hex color (e.g., "#0A0A0A")
   - textColor: hex color with strong contrast against bgColor

2. TYPOGRAPHY (required)
   - fontFamily: Choose ONE font that best matches the ad's mood and message:
     ${fontList}
   - fontScale: 0.85-1.15 (subtle size adjustment, 1.0 is default)
   - letterSpacing: -0.02 to 0.05 (subtle spacing adjustment)

3. EFFECTS (optional — use array for multiple effects, or "none" for no effects)
   You can combine multiple effects per layer for rich visuals.
   Background effects: ${bgEffects}
   Text effects: ${textEffects}
   Foreground effects: ${fgEffects}

## EFFECT GUIDANCE
Background effects:
- Dark backgrounds: combine "gradient-subtle" + "vignette-light" for depth
- Light backgrounds: "gradient-diagonal" or "duotone-cool"
- Minimalist: "none" or single subtle effect

Text effects:
- Dark backgrounds: "shadow-soft", "shadow-medium", or "lift"
- Light backgrounds: "shadow-hard" adds punch
- Glowing/neon: "glow-soft" or "glow-medium"

Foreground effects (framing and polish):
- Premium/luxury: "corners" or "border-thin" — adds refinement
- Editorial/news: "line-bottom" — grounds the composition
- Bold/contained: "border-medium" or "border-bold" — strong framing
- Cinematic: "gradient-fade-bottom" — dramatic depth
${copySection}
## CRITICAL RULES
- ALWAYS ensure high contrast between bgColor and textColor
- Typography IS the design — effects enhance, never dominate
- Consider using foreground effects to add polish and framing
- Effects can be a single string OR an array of multiple effects${copyRule}

Return ONLY valid JSON:
{
  "colors": { "bgColor": "#...", "textColor": "#..." },
  "typography": { "fontFamily": "...", "fontScale": 1.0, "letterSpacing": 0 },
  "effects": { "background": ["gradient-subtle", "vignette-light"], "text": "shadow-soft", "foreground": "corners" }${copyJsonExample}
}`;

  try {
    const data = await callAnthropicAPI(
      'style',
      [{ role: 'user', content: messageContent }],
      1024,
      'claude-opus-4-5-20251101'
    );
    const content = data.content[0].text;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid style JSON in response');
    }

    const styles = JSON.parse(jsonMatch[0]);

    // Clear previous canvas commands
    canvasDecorations = [];

    // Apply colors with contrast validation
    if (styles.colors) {
      let bgColor = styles.colors.bgColor;
      let textColor = styles.colors.textColor;

      if (bgColor && /^#[0-9A-Fa-f]{6}$/.test(bgColor)) {
        // Validate and fix contrast if needed
        if (textColor && /^#[0-9A-Fa-f]{6}$/.test(textColor)) {
          textColor = ensureContrast(bgColor, textColor);
        } else {
          textColor = ensureContrast(bgColor, '#FFFFFF');
        }

        document.getElementById('bgColor').value = bgColor.toUpperCase();
        document.getElementById('bgColorPicker').value = bgColor;
        document.getElementById('textColor').value = textColor.toUpperCase();
        document.getElementById('textColorPicker').value = textColor;
      }
    }

    // Apply typography
    if (styles.typography) {
      const t = styles.typography;

      if (t.fontFamily) {
        const fontSelect = document.getElementById('fontFamily');
        // Try exact match first, then case-insensitive match
        let option = Array.from(fontSelect.options).find(o => o.value === t.fontFamily);
        if (!option) {
          option = Array.from(fontSelect.options).find(o =>
            o.value.toLowerCase() === t.fontFamily.toLowerCase()
          );
        }
        if (option) {
          fontSelect.value = option.value;
          applyFontPreset(option.value);
        } else {
          console.warn('AI returned unknown font:', t.fontFamily);
        }
      }
      if (typeof t.fontScale === 'number' && t.fontScale >= 0.5 && t.fontScale <= 1.5) {
        document.getElementById('fontScale').value = t.fontScale;
      }
      if (typeof t.letterSpacing === 'number' && t.letterSpacing >= -0.05 && t.letterSpacing <= 0.15) {
        document.getElementById('letterSpacing').value = t.letterSpacing;
      }
    }

    // Apply effects from library (AI returns arrays of effect names)
    if (styles.effects) {
      ['background', 'text', 'foreground'].forEach(layer => {
        let effects = styles.effects[layer];
        if (!effects) return;

        // Normalize to array (AI may return string or array)
        if (!Array.isArray(effects)) effects = [effects];

        effects.forEach(effectName => {
          if (effectName && effectName !== 'none' && EFFECT_LIBRARY[layer]?.[effectName]) {
            canvasDecorations.push({
              layer,
              draw: EFFECT_LIBRARY[layer][effectName],
              effectName
            });
          }
        });
      });
    }

    // Apply sample copy (only if checkbox is checked)
    if (updateCopy && styles.copy) {
      const c = styles.copy;
      if (c.intro) document.getElementById('introText').value = c.intro;
      if (c.headline1) document.getElementById('headlineText1').value = c.headline1;
      if (c.headline2) document.getElementById('headlineText2').value = c.headline2;
      if (c.offer) document.getElementById('offerText').value = c.offer;
      if (c.legend) document.getElementById('legendText').value = c.legend;
    }

    // Reset layer opacities to 100% for new style
    resetLayerOpacities();

    // Update layers card visibility
    updateLayersCardVisibility();

    // Re-render the ad with new settings and effects
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
  saveAppStateDebounced();

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

// Populate element font selects from FONT_MOODS (once, at startup)
function populateElementFontSelects() {
  const selects = document.querySelectorAll('.element-font-select');
  if (!selects.length) return;

  // Build options HTML with optgroups by mood
  let html = '<option value="">Inherit</option>';
  for (const [mood, data] of Object.entries(FONT_MOODS)) {
    const label = mood.charAt(0).toUpperCase() + mood.slice(1);
    html += `<optgroup label="${label}">`;
    for (const font of data.fonts) {
      html += `<option value="${font.name}">${font.name}</option>`;
    }
    html += '</optgroup>';
  }

  selects.forEach(select => {
    select.innerHTML = html;
  });
}

// Initialize
(async function init() {
  // Populate font selects before loading state (so values can be restored)
  populateElementFontSelects();
  const hasStoredState = loadAppState();
  if (!hasStoredState) {
    loadDefaults();
  }
  updateApiKeyStatus();
  loadVersions();
  renderVersions();

  // Restore active version (if any was saved) - must await to prevent race
  let restoredVersion = false;
  if (typeof window._pendingActiveVersionIndex === 'number' && savedVersions[window._pendingActiveVersionIndex]) {
    await applyVersion(window._pendingActiveVersionIndex);
    delete window._pendingActiveVersionIndex;
    restoredVersion = true;
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
  setupProductBriefSync();

  // Only call generateAd if we didn't already via applyVersion
  if (!restoredVersion) {
    document.fonts.ready.then(() => generateAd());
  }
})();

// Sync product brief between Builder and Data tabs
function setupProductBriefSync() {
  const builderBrief = document.getElementById('productBrief');
  const dataBrief = document.getElementById('productBriefData');
  const updateCopyCheckbox = document.getElementById('updateCopyCheckbox');

  if (!builderBrief || !dataBrief) return;

  // Sync from Builder to Data
  builderBrief.addEventListener('input', () => {
    dataBrief.value = builderBrief.value;
    updateProductCheckboxState();
    saveAppStateDebounced();
  });

  // Sync from Data to Builder
  dataBrief.addEventListener('input', () => {
    builderBrief.value = dataBrief.value;
    updateProductCheckboxState();
    saveAppStateDebounced();
  });

  // Checkbox change saves preference explicitly
  if (updateCopyCheckbox) {
    updateCopyCheckbox.addEventListener('change', () => {
      saveAppStateDebounced();
    });
  }

  // Initial sync and checkbox state
  if (builderBrief.value && !dataBrief.value) {
    dataBrief.value = builderBrief.value;
  } else if (dataBrief.value && !builderBrief.value) {
    builderBrief.value = dataBrief.value;
  }
  // Pass true to preserve saved checkbox preference on initial load
  updateProductCheckboxState(true);
}

// Enable/disable the "Update copy" checkbox based on product brief content
// Logic:
// - Disabled when product brief is empty (no copy generation possible)
// - Default to checked on fresh install (no saved state)
// - Persist user's explicit choice across sessions
function updateProductCheckboxState(isInitialLoad = false) {
  const brief = document.getElementById('productBrief')?.value?.trim();
  const checkbox = document.getElementById('updateCopyCheckbox');
  if (!checkbox) return;

  const hasBrief = !!brief;
  const wasDisabled = checkbox.disabled;
  checkbox.disabled = !hasBrief;

  if (!hasBrief) {
    // No brief = disabled and unchecked (ignored)
    checkbox.checked = false;
  } else if (isInitialLoad || wasDisabled) {
    // On initial load OR when transitioning from disabled to enabled,
    // check if we have a saved preference. If no saved state exists
    // (fresh install), default to checked.
    const savedState = localStorage.getItem('ad_studio_state');
    if (!savedState) {
      checkbox.checked = true;
    }
    // Otherwise, the value was already restored by loadAppState()
  }
  // User interactions are handled by the change event listener
}
