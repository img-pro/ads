// ==========================================
// AD STUDIO - Main Application
// ==========================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Reference CONFIG from config.js (loaded before app.js)
const fontPresets = CONFIG.fontPresets;

// ==========================================
// TAB NAVIGATION
// ==========================================

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tabId}-tab`).classList.add('active');

    // Update toolbar items
    document.querySelector('.toolbar-builder-items').style.display = tabId === 'builder' ? 'flex' : 'none';
    document.querySelector('.toolbar-data-items').style.display = tabId === 'data' ? 'flex' : 'none';
  });
});

// ==========================================
// SECTION TOGGLES
// ==========================================

function toggleSection(header) {
  header.parentElement.classList.toggle('collapsed');
}

function toggleTextBlock(header) {
  header.parentElement.classList.toggle('collapsed');
}

// ==========================================
// LOAD SAVED PRESETS FROM LOCALSTORAGE
// ==========================================

// Load custom presets from localStorage
(function loadSavedPresets() {
  const savedPresets = JSON.parse(localStorage.getItem('customFontPresets') || '{}');
  Object.keys(savedPresets).forEach(fontFamily => {
    if (fontPresets[fontFamily]) {
      fontPresets[fontFamily] = { ...fontPresets[fontFamily], ...savedPresets[fontFamily] };
    }
  });
})();

// ==========================================
// CONFIG CODE BLOCKS
// ==========================================

function updateConfigCode() {
  updateConfigDefaults();
  updateConfigPreset();
}

function updateConfigDefaults() {
  const q = s => `'${s}'`; // single quote strings
  const n = v => v; // numbers as-is

  const width = parseInt(document.getElementById('width')?.value) || 1200;
  const height = parseInt(document.getElementById('height')?.value) || 628;
  const bgColor = document.getElementById('bgColor')?.value || '#0033FF';
  const textColor = document.getElementById('textColor')?.value || '#FFFFFF';
  const intro = document.getElementById('introText')?.value || '';
  const headline1 = document.getElementById('headlineText1')?.value || '';
  const headline2 = document.getElementById('headlineText2')?.value || '';
  const offer = document.getElementById('offerText')?.value || '';
  const legend = document.getElementById('legendText')?.value || '';
  const fontFamily = document.getElementById('fontFamily')?.value || 'Helvetica';
  const fontWeight = document.getElementById('fontWeight')?.value || '700';
  const fontStyle = document.getElementById('fontStyle')?.value || 'normal';
  const textTransform = document.getElementById('textTransform')?.value || 'none';
  const letterSpacing = parseFloat(document.getElementById('letterSpacing')?.value) || 0;
  const introSize = parseFloat(document.getElementById('introSize')?.value) || 0;
  const introWeight = document.getElementById('introWeight')?.value || '500';
  const introTransform = document.getElementById('introTransform')?.value || 'none';
  const headlineSize = parseFloat(document.getElementById('headlineSize')?.value) || 0;
  const offerSize = parseFloat(document.getElementById('offerSize')?.value) || 0;
  const offerWeight = document.getElementById('offerWeight')?.value || '800';
  const offerTransform = document.getElementById('offerTransform')?.value || 'uppercase';
  const legendSize = parseFloat(document.getElementById('legendSize')?.value) || 0;
  const legendWeight = document.getElementById('legendWeight')?.value || '400';
  const legendTransform = document.getElementById('legendTransform')?.value || 'none';
  const opticalYOffset = parseFloat(document.getElementById('spacingOpticalYOffset')?.value) || 0;
  const introMarginTop = parseFloat(document.getElementById('spacingIntroMarginTop')?.value) || 0;
  const headlineMarginTop = parseFloat(document.getElementById('spacingHeadlineMarginTop')?.value) || 0;
  const headlineLineHeight = parseFloat(document.getElementById('spacingHeadlineLineHeight')?.value) || 1;
  const offerMarginTop = parseFloat(document.getElementById('spacingOfferMarginTop')?.value) || 0;
  const legendMarginTop = parseFloat(document.getElementById('spacingLegendMarginTop')?.value) || 0;

  const output = `canvas: {
    width: ${n(width)},
    height: ${n(height)}
  },

  colors: {
    background: ${q(bgColor)},
    text: ${q(textColor)}
  },

  content: {
    intro: ${q(intro)},
    headline1: ${q(headline1)},
    headline2: ${q(headline2)},
    offer: ${q(offer)},
    legend: ${q(legend)}
  },

  typography: {
    fontFamily: ${q(fontFamily)},
    fontWeight: ${q(fontWeight)},
    fontStyle: ${q(fontStyle)},
    textTransform: ${q(textTransform)},
    letterSpacing: ${n(letterSpacing)},
    introSize: ${n(introSize)},
    introWeight: ${q(introWeight)},
    introTransform: ${q(introTransform)},
    headlineSize: ${n(headlineSize)},
    offerSize: ${n(offerSize)},
    offerWeight: ${q(offerWeight)},
    offerTransform: ${q(offerTransform)},
    legendSize: ${n(legendSize)},
    legendWeight: ${q(legendWeight)},
    legendTransform: ${q(legendTransform)}
  },

  spacing: {
    opticalYOffset: ${n(opticalYOffset)},
    intro: { marginTop: ${n(introMarginTop)} },
    headline: { marginTop: ${n(headlineMarginTop)}, lineHeight: ${n(headlineLineHeight)} },
    offer: { marginTop: ${n(offerMarginTop)} },
    legend: { marginTop: ${n(legendMarginTop)} }
  },`;

  const codeEl = document.getElementById('configDefaults');
  if (codeEl) {
    codeEl.textContent = output;
  }
}

function updateConfigPreset() {
  const q = s => `'${s}'`; // single quote strings
  const n = v => v; // numbers as-is

  const fontFamily = document.getElementById('fontFamily')?.value || 'Helvetica';
  const fontWeight = document.getElementById('fontWeight')?.value || '700';
  const fontStyle = document.getElementById('fontStyle')?.value || 'normal';
  const textTransform = document.getElementById('textTransform')?.value || 'none';
  const letterSpacing = parseFloat(document.getElementById('letterSpacing')?.value) || 0;
  const introSize = parseFloat(document.getElementById('introSize')?.value) || 0;
  const introWeight = document.getElementById('introWeight')?.value || '500';
  const introTransform = document.getElementById('introTransform')?.value || 'none';
  const headlineSize = parseFloat(document.getElementById('headlineSize')?.value) || 0;
  const offerSize = parseFloat(document.getElementById('offerSize')?.value) || 0;
  const offerWeight = document.getElementById('offerWeight')?.value || '800';
  const offerTransform = document.getElementById('offerTransform')?.value || 'uppercase';
  const legendSize = parseFloat(document.getElementById('legendSize')?.value) || 0;
  const legendWeight = document.getElementById('legendWeight')?.value || '400';
  const legendTransform = document.getElementById('legendTransform')?.value || 'none';

  const output = `'${fontFamily}': {
  fontWeight: ${q(fontWeight)},
  fontStyle: ${q(fontStyle)},
  textTransform: ${q(textTransform)},
  letterSpacing: ${n(letterSpacing)},
  introSize: ${n(introSize)},
  introWeight: ${q(introWeight)},
  introTransform: ${q(introTransform)},
  headlineSize: ${n(headlineSize)},
  offerSize: ${n(offerSize)},
  offerWeight: ${q(offerWeight)},
  offerTransform: ${q(offerTransform)},
  legendSize: ${n(legendSize)},
  legendWeight: ${q(legendWeight)},
  legendTransform: ${q(legendTransform)}
}`;

  const codeEl = document.getElementById('configPreset');
  if (codeEl) {
    codeEl.textContent = output;
  }
}

function copyConfigDefaults() {
  const codeEl = document.getElementById('configDefaults');
  if (codeEl && codeEl.textContent) {
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      showCopyFeedback(codeEl);
    });
  }
}

function copyConfigPreset() {
  const codeEl = document.getElementById('configPreset');
  if (codeEl && codeEl.textContent) {
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      showCopyFeedback(codeEl);
    });
  }
}

function showCopyFeedback(codeEl) {
  const btn = codeEl.nextElementSibling;
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg class="icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Copied';
    setTimeout(() => { btn.innerHTML = originalText; }, 1500);
  }
}

// ==========================================
// TYPOGRAPHY OVERRIDES
// ==========================================

const overrides = new Set();
const typographyFields = [
  'fontWeight', 'fontStyle', 'textTransform', 'letterSpacing',
  'introSize', 'introWeight', 'introTransform',
  'headlineSize', 'offerSize', 'offerWeight', 'offerTransform',
  'legendSize', 'legendWeight', 'legendTransform'
];

function getCurrentPreset() {
  const fontFamily = document.getElementById('fontFamily').value;
  return fontPresets[fontFamily] || fontPresets['Inter'];
}

function applyFontPreset(clearOverrides = false) {
  if (clearOverrides) overrides.clear();
  const preset = getCurrentPreset();
  typographyFields.forEach(field => {
    if (!overrides.has(field) && preset[field] !== undefined) {
      const el = document.getElementById(field);
      if (el) el.value = preset[field];
    }
  });
}

function markOverride(fieldId) {
  if (typographyFields.includes(fieldId)) {
    overrides.add(fieldId);
  }
}

function resetTypography() {
  overrides.clear();
  applyFontPreset();
  generateAd();
}

function saveAsFontDefault() {
  const fontFamily = document.getElementById('fontFamily').value;
  const newPreset = {};

  typographyFields.forEach(field => {
    const el = document.getElementById(field);
    if (el) {
      const value = el.value;
      // Convert numeric strings to numbers
      newPreset[field] = isNaN(value) ? value : parseFloat(value);
    }
  });

  // Update the in-memory preset
  fontPresets[fontFamily] = { ...fontPresets[fontFamily], ...newPreset };

  // Save to localStorage for persistence
  const savedPresets = JSON.parse(localStorage.getItem('customFontPresets') || '{}');
  savedPresets[fontFamily] = newPreset;
  localStorage.setItem('customFontPresets', JSON.stringify(savedPresets));

  // Clear overrides since these are now the defaults
  overrides.clear();
}

// ==========================================
// SIZE PRESETS
// ==========================================

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('width').value = btn.dataset.w;
    document.getElementById('height').value = btn.dataset.h;
    generateAd();
  });
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
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    });
  }
});

// ==========================================
// DISPLAY UPDATES
// ==========================================

function updateDisplays() {
  const w = document.getElementById('width')?.value || 1200;
  const h = document.getElementById('height')?.value || 628;

  const introSizeVal = document.getElementById('introSizeVal');
  const headlineSizeVal = document.getElementById('headlineSizeVal');
  const offerSizeVal = document.getElementById('offerSizeVal');
  const legendSizeVal = document.getElementById('legendSizeVal');
  const letterSpacingVal = document.getElementById('letterSpacingVal');
  const canvasDims = document.getElementById('canvasDims');
  const canvasInfo = document.getElementById('canvasInfo');

  if (introSizeVal) introSizeVal.textContent = parseFloat(document.getElementById('introSize')?.value || 0).toFixed(2) + '×';
  if (headlineSizeVal) headlineSizeVal.textContent = Math.round(parseFloat(document.getElementById('headlineSize')?.value || 0) * 100) + '%';
  if (offerSizeVal) offerSizeVal.textContent = parseFloat(document.getElementById('offerSize')?.value || 0).toFixed(2) + '×';
  if (legendSizeVal) legendSizeVal.textContent = parseFloat(document.getElementById('legendSize')?.value || 0).toFixed(2) + '×';
  if (letterSpacingVal) letterSpacingVal.textContent = Math.round(parseFloat(document.getElementById('letterSpacing')?.value || 0) * 100) + '%';
  if (canvasDims) canvasDims.textContent = `${w} × ${h}`;
  if (canvasInfo) canvasInfo.textContent = `${w} × ${h} px`;

  // Spacing displays
  const spacingOpticalYOffsetVal = document.getElementById('spacingOpticalYOffsetVal');
  if (spacingOpticalYOffsetVal) spacingOpticalYOffsetVal.textContent = parseFloat(document.getElementById('spacingOpticalYOffset')?.value || 0).toFixed(3);

  // Per-element spacing displays
  ['Intro', 'Headline', 'Offer', 'Legend'].forEach(el => {
    const marginTopVal = document.getElementById(`spacing${el}MarginTopVal`);
    if (marginTopVal) marginTopVal.textContent = parseFloat(document.getElementById(`spacing${el}MarginTop`)?.value || 0).toFixed(2) + '×';
  });

  // Headline lineHeight (only multi-line element)
  const headlineLineHeightVal = document.getElementById('spacingHeadlineLineHeightVal');
  if (headlineLineHeightVal) headlineLineHeightVal.textContent = parseFloat(document.getElementById('spacingHeadlineLineHeight')?.value || 1).toFixed(2);
}

// ==========================================
// TEXT UTILITIES
// ==========================================

function applyTransform(text, transform) {
  if (!text) return text;
  switch (transform) {
    case 'uppercase': return text.toUpperCase();
    case 'capitalize': return text.replace(/\b\w/g, c => c.toUpperCase());
    default: return text;
  }
}

function fitText(targetCtx, text, maxWidth, fontSize, fontWeight, fontStyle, fontFamily, letterSpacing) {
  if (!text) return fontSize;
  let size = fontSize;
  const spacing = size * letterSpacing;
  targetCtx.font = `${fontStyle} ${fontWeight} ${size}px "${fontFamily}"`;

  while ((targetCtx.measureText(text).width + (text.length - 1) * spacing) > maxWidth && size > 8) {
    size -= 1;
    targetCtx.font = `${fontStyle} ${fontWeight} ${size}px "${fontFamily}"`;
  }
  return size;
}

// ==========================================
// CANVAS RENDERING
// ==========================================

const dpr = window.devicePixelRatio || 1;
const exportCanvas = document.createElement('canvas');
const exportCtx = exportCanvas.getContext('2d');

function generateAd() {
  updateDisplays();

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

  const bgColor = document.getElementById('bgColor')?.value || '#0033FF';
  const textColor = document.getElementById('textColor')?.value || '#FFFFFF';
  const fontFamily = document.getElementById('fontFamily')?.value || 'Inter';
  const globalWeight = document.getElementById('fontWeight')?.value || '700';
  const globalStyle = document.getElementById('fontStyle')?.value || 'normal';
  const globalTransform = document.getElementById('textTransform')?.value || 'none';
  const letterSpacing = parseFloat(document.getElementById('letterSpacing')?.value) || 0;

  const headlineFactor = parseFloat(document.getElementById('headlineSize')?.value) || 0.15;
  const introFactor = parseFloat(document.getElementById('introSize')?.value) || 0.38;
  const offerFactor = parseFloat(document.getElementById('offerSize')?.value) || 0.65;
  const legendFactor = parseFloat(document.getElementById('legendSize')?.value) || 0.22;

  const introWeight = document.getElementById('introWeight')?.value || '500';
  const introTransform = document.getElementById('introTransform')?.value || 'none';
  const offerWeight = document.getElementById('offerWeight')?.value || '800';
  const offerTransform = document.getElementById('offerTransform')?.value || 'uppercase';
  const legendWeight = document.getElementById('legendWeight')?.value || '400';
  const legendTransform = document.getElementById('legendTransform')?.value || 'none';

  let introText = document.getElementById('introText')?.value || '';
  let headlineText1 = document.getElementById('headlineText1')?.value || '';
  let headlineText2 = document.getElementById('headlineText2')?.value || '';
  let offerText = document.getElementById('offerText')?.value || '';
  let legendText = document.getElementById('legendText')?.value || '';

  introText = applyTransform(introText, introTransform !== 'none' ? introTransform : globalTransform);
  headlineText1 = applyTransform(headlineText1, globalTransform);
  headlineText2 = applyTransform(headlineText2, globalTransform);
  offerText = applyTransform(offerText, offerTransform !== 'none' ? offerTransform : globalTransform);
  legendText = applyTransform(legendText, legendTransform !== 'none' ? legendTransform : globalTransform);

  const baseHeadlineSize = height * headlineFactor;
  const introSize = baseHeadlineSize * introFactor;
  const offerSize = baseHeadlineSize * offerFactor;
  const legendSize = baseHeadlineSize * legendFactor;

  const maxTextWidth = width * 0.88;

  // Use exportCtx for text measurement (1:1 scale)
  const introFontSize = fitText(exportCtx, introText, maxTextWidth, introSize,
    introWeight !== 'normal' ? introWeight : globalWeight, globalStyle, fontFamily, letterSpacing);
  const headline1FontSize = fitText(exportCtx, headlineText1, maxTextWidth, baseHeadlineSize,
    globalWeight, globalStyle, fontFamily, letterSpacing);
  const headline2FontSize = fitText(exportCtx, headlineText2, maxTextWidth, baseHeadlineSize,
    globalWeight, globalStyle, fontFamily, letterSpacing);
  const offerFontSize = fitText(exportCtx, offerText, maxTextWidth, offerSize,
    offerWeight, globalStyle, fontFamily, letterSpacing);
  const legendFontSize = fitText(exportCtx, legendText, maxTextWidth, legendSize,
    legendWeight !== 'normal' ? legendWeight : globalWeight, globalStyle, fontFamily, letterSpacing);

  // Per-element spacing
  const spacing = {
    intro: {
      marginTop: parseFloat(document.getElementById('spacingIntroMarginTop')?.value) ?? CONFIG.spacing.intro.marginTop
    },
    headline: {
      marginTop: parseFloat(document.getElementById('spacingHeadlineMarginTop')?.value) ?? CONFIG.spacing.headline.marginTop,
      lineHeight: parseFloat(document.getElementById('spacingHeadlineLineHeight')?.value) ?? CONFIG.spacing.headline.lineHeight
    },
    offer: {
      marginTop: parseFloat(document.getElementById('spacingOfferMarginTop')?.value) ?? CONFIG.spacing.offer.marginTop
    },
    legend: {
      marginTop: parseFloat(document.getElementById('spacingLegendMarginTop')?.value) ?? CONFIG.spacing.legend.marginTop
    }
  };

  const elements = [];
  let contentHeight = 0;

  if (introText) {
    const marginTop = baseHeadlineSize * spacing.intro.marginTop;
    contentHeight += marginTop;
    elements.push({ type: 'intro', text: introText, fontSize: introFontSize, weight: introWeight !== 'normal' ? introWeight : globalWeight, marginTop });
    contentHeight += introFontSize;
  }

  if (headlineText1) {
    const marginTop = baseHeadlineSize * spacing.headline.marginTop;
    contentHeight += marginTop;
    elements.push({ type: 'headline1', text: headlineText1, fontSize: headline1FontSize, weight: globalWeight, marginTop });
    contentHeight += headline1FontSize;
  }

  if (headlineText2) {
    // Second headline line uses lineHeight instead of marginTop
    const lineGap = headline1FontSize * (spacing.headline.lineHeight - 1);
    contentHeight += lineGap;
    elements.push({ type: 'headline2', text: headlineText2, fontSize: headline2FontSize, weight: globalWeight, marginTop: lineGap });
    contentHeight += headline2FontSize;
  }

  if (offerText) {
    const marginTop = baseHeadlineSize * spacing.offer.marginTop;
    contentHeight += marginTop;
    elements.push({ type: 'offer', text: offerText, fontSize: offerFontSize, weight: offerWeight, marginTop });
    contentHeight += offerFontSize;
  }

  if (legendText) {
    const marginTop = baseHeadlineSize * spacing.legend.marginTop;
    contentHeight += marginTop;
    elements.push({ type: 'legend', text: legendText, fontSize: legendFontSize, weight: legendWeight !== 'normal' ? legendWeight : globalWeight, marginTop });
    contentHeight += legendFontSize;
  }

  function render(targetCtx, scale) {
    targetCtx.save();
    targetCtx.scale(scale, scale);

    targetCtx.fillStyle = bgColor;
    targetCtx.fillRect(0, 0, width, height);

    const opticalYOffset = parseFloat(document.getElementById('spacingOpticalYOffset')?.value) || CONFIG.spacing.opticalYOffset;
    const opticalOffset = height * opticalYOffset;
    let currentY = (height - contentHeight) / 2 - opticalOffset;

    targetCtx.fillStyle = textColor;
    targetCtx.textAlign = 'center';
    targetCtx.textBaseline = 'top';

    elements.forEach((el) => {
      // Apply marginTop before drawing
      currentY += el.marginTop;

      targetCtx.font = `${globalStyle} ${el.weight} ${el.fontSize}px "${fontFamily}"`;

      if (letterSpacing !== 0) {
        const charSpacing = el.fontSize * letterSpacing;
        const text = el.text;
        if (text) {
          const totalWidth = targetCtx.measureText(text).width + (text.length - 1) * charSpacing;
          let charX = width / 2 - totalWidth / 2;
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charWidth = targetCtx.measureText(char).width;
            targetCtx.fillText(char, charX + charWidth / 2, currentY);
            charX += charWidth + charSpacing;
          }
        }
      } else {
        targetCtx.fillText(el.text, width / 2, currentY);
      }

      currentY += el.fontSize;
    });

    targetCtx.restore();
  }

  render(ctx, dpr);
  render(exportCtx, 1);
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
  Object.keys(globalDefaults).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      el.value = globalDefaults[key];
      if (key === 'bgColor') document.getElementById('bgColorPicker').value = globalDefaults[key];
      if (key === 'textColor') document.getElementById('textColorPicker').value = globalDefaults[key];
    }
  });

  document.getElementById('fontFamily').value = 'Inter';
  overrides.clear();
  applyFontPreset();

  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.size-btn[data-w="1200"][data-h="628"]')?.classList.add('active');

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

const originalGenerateAd = generateAd;
generateAd = async function() {
  const fontFamily = document.getElementById('fontFamily')?.value || 'Inter';
  await ensureFontLoaded(fontFamily);
  originalGenerateAd();
};

// ==========================================
// BUILDER EVENT LISTENERS
// ==========================================

document.querySelectorAll('#builder-tab input, #builder-tab select').forEach(input => {
  input.addEventListener('input', (e) => {
    const id = e.target.id;
    if (id === 'fontFamily') applyFontPreset();
    else if (typographyFields.includes(id)) markOverride(id);
    generateAd();
  });
});

// ==========================================
// DATA TAB - VARIATIONS MANAGEMENT
// ==========================================

let dataRows = [];

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

function renderDataTable() {
  const tbody = document.getElementById('dataTableBody');
  if (!tbody) return;

  tbody.innerHTML = dataRows.map((row, index) => `
    <tr data-id="${row.id}">
      <td class="col-check">
        <input type="checkbox" ${row.selected ? 'checked' : ''} onchange="toggleRowSelection(${index})">
      </td>
      <td class="col-intro">
        <input type="text" value="${escapeHtml(row.intro)}" onchange="updateRowField(${index}, 'intro', this.value)">
      </td>
      <td class="col-headline1">
        <input type="text" value="${escapeHtml(row.headline1)}" onchange="updateRowField(${index}, 'headline1', this.value)">
      </td>
      <td class="col-headline2">
        <input type="text" value="${escapeHtml(row.headline2)}" onchange="updateRowField(${index}, 'headline2', this.value)">
      </td>
      <td class="col-offer">
        <input type="text" value="${escapeHtml(row.offer)}" onchange="updateRowField(${index}, 'offer', this.value)">
      </td>
      <td class="col-legend">
        <input type="text" value="${escapeHtml(row.legend)}" onchange="updateRowField(${index}, 'legend', this.value)">
      </td>
      <td class="col-actions">
        <button class="row-delete" onclick="deleteRow(${index})">
          <svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </td>
    </tr>
  `).join('');

  updateDataStats();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addDataRow() {
  dataRows.push(createDataRow());
  renderDataTable();
}

function deleteRow(index) {
  dataRows.splice(index, 1);
  renderDataTable();
}

function toggleRowSelection(index) {
  dataRows[index].selected = !dataRows[index].selected;
  updateDataStats();
}

function updateRowField(index, field, value) {
  dataRows[index][field] = value;
}

function updateDataStats() {
  const selected = dataRows.filter(r => r.selected).length;
  const stats = document.getElementById('dataStats');
  if (stats) stats.textContent = `${selected} variation${selected !== 1 ? 's' : ''} selected`;
}

// Select all checkbox
document.getElementById('selectAll')?.addEventListener('change', (e) => {
  dataRows.forEach(row => row.selected = e.target.checked);
  renderDataTable();
});

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
  if (status) status.textContent = hasKey ? 'API Key Set' : 'Set API Key';
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
    alert('Please enter a prompt describing your product/service and target audience.');
    return;
  }

  const btn = document.getElementById('generateBtn');
  btn?.classList.add('loading');

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
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are an expert performance ad copywriter specializing in high-velocity social ads for WordPress developers and technical operators.
## Audience Profile
Write specifically for:
- WordPress developers and site maintainers
- WooCommerce store owners with bandwidth pain
- Agencies managing many WordPress installs
- Performance-focused engineers familiar with CDNs
- Users who avoid DNS changes and fear breaking production

These users value: clarity, speed, control, cost reduction, and zero-risk changes.

## Context
- Platforms: Reddit, X
- Visual: Bold white text on solid #0033FF blue
- Scan time: 0.6 seconds — copy must resolve instantly
- Goal: Stop the scroll → communicate value → drive installs/signups

## Design Constraints
The ad has a strict visual hierarchy:
1. INTRO (top) — Who is this for? A short qualifier that makes the right person stop.
2. HEADLINE (center, dominant) — The value punch. Two lines, stacked. This is 50% of visual weight.
3. OFFER (below headline) — The CTA or key differentiator. Uppercase, bold.
4. LEGEND (bottom, small) — Credibility signal. Quiet, trustworthy.

## Copy Rules
- Lead with value (speed, savings, simplicity)
- Use numbers when helpful (100GB, 0 DNS changes)
- Use short, punchy words — devs hate fluff
- Avoid marketing tone; write like a performance engineer
- Intros can be questions; headlines must be statements
- Offer answers: “What’s the upside?” or “What’s the catch?”
- Legend adds credibility without selling

## Brief from user:
${prompt}

## Output format
Generate 5-8 variations. Each variation must have:
- intro: 1-3 words (qualifier)
- headline1: 2-4 words (first line)
- headline2: 1-3 words (punch line)
- offer: 2-4 words, uppercase-friendly
- legend: 3-5 words (trust signal)

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

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const variations = JSON.parse(jsonMatch[0]);
      variations.forEach(v => {
        dataRows.push(createDataRow(v));
      });
      renderDataTable();
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

  const selectedSizes = Array.from(document.querySelectorAll('.size-checkbox input:checked'))
    .map(cb => cb.value.split('x').map(Number));

  if (selectedSizes.length === 0) {
    alert('Please select at least one size to export.');
    return;
  }

  // Dynamic import of JSZip
  if (!window.JSZip) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);
    await new Promise(resolve => script.onload = resolve);
  }

  const zip = new JSZip();
  const btn = document.querySelector('.toolbar-data-items .primary');
  btn?.classList.add('loading');

  // Get current template settings
  const template = {
    bgColor: document.getElementById('bgColor')?.value || '#0033FF',
    textColor: document.getElementById('textColor')?.value || '#FFFFFF',
    fontFamily: document.getElementById('fontFamily')?.value || 'Inter',
    fontWeight: document.getElementById('fontWeight')?.value || '700',
    fontStyle: document.getElementById('fontStyle')?.value || 'normal',
    textTransform: document.getElementById('textTransform')?.value || 'none',
    letterSpacing: parseFloat(document.getElementById('letterSpacing')?.value) || 0,
    headlineSize: parseFloat(document.getElementById('headlineSize')?.value) || 0.15,
    introSize: parseFloat(document.getElementById('introSize')?.value) || 0.38,
    offerSize: parseFloat(document.getElementById('offerSize')?.value) || 0.65,
    legendSize: parseFloat(document.getElementById('legendSize')?.value) || 0.22,
    introWeight: document.getElementById('introWeight')?.value || '500',
    introTransform: document.getElementById('introTransform')?.value || 'none',
    offerWeight: document.getElementById('offerWeight')?.value || '800',
    offerTransform: document.getElementById('offerTransform')?.value || 'uppercase',
    legendWeight: document.getElementById('legendWeight')?.value || '400',
    legendTransform: document.getElementById('legendTransform')?.value || 'none'
  };

  // Ensure font is loaded
  await ensureFontLoaded(template.fontFamily);

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

  let introText = applyTransform(row.intro, template.introTransform !== 'none' ? template.introTransform : template.textTransform);
  let headlineText1 = applyTransform(row.headline1, template.textTransform);
  let headlineText2 = applyTransform(row.headline2, template.textTransform);
  let offerText = applyTransform(row.offer, template.offerTransform !== 'none' ? template.offerTransform : template.textTransform);
  let legendText = applyTransform(row.legend, template.legendTransform !== 'none' ? template.legendTransform : template.textTransform);

  const baseHeadlineSize = height * template.headlineSize;
  const maxTextWidth = width * 0.88;

  const introFontSize = fitText(tempCtx, introText, maxTextWidth, baseHeadlineSize * template.introSize,
    template.introWeight, template.fontStyle, template.fontFamily, template.letterSpacing);
  const headline1FontSize = fitText(tempCtx, headlineText1, maxTextWidth, baseHeadlineSize,
    template.fontWeight, template.fontStyle, template.fontFamily, template.letterSpacing);
  const headline2FontSize = fitText(tempCtx, headlineText2, maxTextWidth, baseHeadlineSize,
    template.fontWeight, template.fontStyle, template.fontFamily, template.letterSpacing);
  const offerFontSize = fitText(tempCtx, offerText, maxTextWidth, baseHeadlineSize * template.offerSize,
    template.offerWeight, template.fontStyle, template.fontFamily, template.letterSpacing);
  const legendFontSize = fitText(tempCtx, legendText, maxTextWidth, baseHeadlineSize * template.legendSize,
    template.legendWeight, template.fontStyle, template.fontFamily, template.letterSpacing);

  // Per-element spacing
  const spacing = {
    intro: {
      marginTop: parseFloat(document.getElementById('spacingIntroMarginTop')?.value) ?? CONFIG.spacing.intro.marginTop
    },
    headline: {
      marginTop: parseFloat(document.getElementById('spacingHeadlineMarginTop')?.value) ?? CONFIG.spacing.headline.marginTop,
      lineHeight: parseFloat(document.getElementById('spacingHeadlineLineHeight')?.value) ?? CONFIG.spacing.headline.lineHeight
    },
    offer: {
      marginTop: parseFloat(document.getElementById('spacingOfferMarginTop')?.value) ?? CONFIG.spacing.offer.marginTop
    },
    legend: {
      marginTop: parseFloat(document.getElementById('spacingLegendMarginTop')?.value) ?? CONFIG.spacing.legend.marginTop
    }
  };

  const elements = [];
  let contentHeight = 0;

  if (introText) {
    const marginTop = baseHeadlineSize * spacing.intro.marginTop;
    contentHeight += marginTop;
    elements.push({ text: introText, fontSize: introFontSize, weight: template.introWeight, type: 'intro', marginTop });
    contentHeight += introFontSize;
  }
  if (headlineText1) {
    const marginTop = baseHeadlineSize * spacing.headline.marginTop;
    contentHeight += marginTop;
    elements.push({ text: headlineText1, fontSize: headline1FontSize, weight: template.fontWeight, type: 'headline1', marginTop });
    contentHeight += headline1FontSize;
  }
  if (headlineText2) {
    const lineGap = headline1FontSize * (spacing.headline.lineHeight - 1);
    contentHeight += lineGap;
    elements.push({ text: headlineText2, fontSize: headline2FontSize, weight: template.fontWeight, type: 'headline2', marginTop: lineGap });
    contentHeight += headline2FontSize;
  }
  if (offerText) {
    const marginTop = baseHeadlineSize * spacing.offer.marginTop;
    contentHeight += marginTop;
    elements.push({ text: offerText, fontSize: offerFontSize, weight: template.offerWeight, type: 'offer', marginTop });
    contentHeight += offerFontSize;
  }
  if (legendText) {
    const marginTop = baseHeadlineSize * spacing.legend.marginTop;
    contentHeight += marginTop;
    elements.push({ text: legendText, fontSize: legendFontSize, weight: template.legendWeight, type: 'legend', marginTop });
    contentHeight += legendFontSize;
  }

  // Draw
  tempCtx.fillStyle = template.bgColor;
  tempCtx.fillRect(0, 0, width, height);

  const opticalYOffset = parseFloat(document.getElementById('spacingOpticalYOffset')?.value) ?? CONFIG.spacing.opticalYOffset;
  const opticalOffset = height * opticalYOffset;
  let currentY = (height - contentHeight) / 2 - opticalOffset;

  tempCtx.fillStyle = template.textColor;
  tempCtx.textAlign = 'center';
  tempCtx.textBaseline = 'top';

  elements.forEach((el) => {
    currentY += el.marginTop;

    tempCtx.font = `${template.fontStyle} ${el.weight} ${el.fontSize}px "${template.fontFamily}"`;

    if (template.letterSpacing !== 0) {
      const charSpacing = el.fontSize * template.letterSpacing;
      const totalWidth = tempCtx.measureText(el.text).width + (el.text.length - 1) * charSpacing;
      let charX = width / 2 - totalWidth / 2;
      for (let i = 0; i < el.text.length; i++) {
        const char = el.text[i];
        const charWidth = tempCtx.measureText(char).width;
        tempCtx.fillText(char, charX + charWidth / 2, currentY);
        charX += charWidth + charSpacing;
      }
    } else {
      tempCtx.fillText(el.text, width / 2, currentY);
    }

    currentY += el.fontSize;
  });

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

  // Content
  document.getElementById('introText').value = CONFIG.content.intro;
  document.getElementById('headlineText1').value = CONFIG.content.headline1;
  document.getElementById('headlineText2').value = CONFIG.content.headline2;
  document.getElementById('offerText').value = CONFIG.content.offer;
  document.getElementById('legendText').value = CONFIG.content.legend;

  // Typography
  const t = CONFIG.typography;
  document.getElementById('fontFamily').value = t.fontFamily;
  document.getElementById('fontWeight').value = t.fontWeight;
  document.getElementById('fontStyle').value = t.fontStyle;
  document.getElementById('textTransform').value = t.textTransform;
  document.getElementById('letterSpacing').value = t.letterSpacing;
  document.getElementById('introSize').value = t.introSize;
  document.getElementById('introWeight').value = t.introWeight;
  document.getElementById('introTransform').value = t.introTransform;
  document.getElementById('headlineSize').value = t.headlineSize;
  document.getElementById('offerSize').value = t.offerSize;
  document.getElementById('offerWeight').value = t.offerWeight;
  document.getElementById('offerTransform').value = t.offerTransform;
  document.getElementById('legendSize').value = t.legendSize;
  document.getElementById('legendWeight').value = t.legendWeight;
  document.getElementById('legendTransform').value = t.legendTransform;

  // Spacing
  const s = CONFIG.spacing;
  document.getElementById('spacingOpticalYOffset').value = s.opticalYOffset;
  document.getElementById('spacingIntroMarginTop').value = s.intro.marginTop;
  document.getElementById('spacingHeadlineMarginTop').value = s.headline.marginTop;
  document.getElementById('spacingHeadlineLineHeight').value = s.headline.lineHeight;
  document.getElementById('spacingOfferMarginTop').value = s.offer.marginTop;
  document.getElementById('spacingLegendMarginTop').value = s.legend.marginTop;
}

// Initialize
loadDefaults();
updateApiKeyStatus();
renderDataTable();
document.fonts.ready.then(() => generateAd());
