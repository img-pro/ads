// ==========================================
// AD STUDIO - Main Application
// ==========================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
// GLOBAL DEFAULTS & FONT PRESETS
// ==========================================

const globalDefaults = {
  width: 1200,
  height: 628,
  bgColor: '#0033FF',
  textColor: '#FFFFFF',
  introText: 'WordPress User?',
  headlineText1: 'Stop Paying for',
  headlineText2: 'Bandwidth',
  offerText: 'FREE: 100 GB / Mo',
  legendText: 'Cloudflare-level speed without touching DNS'
};

const fontPresets = {
  'Bebas Neue': {
    fontWeight: '400', fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.04,
    introSize: 0.32, introWeight: '400', introTransform: 'uppercase',
    headlineSize: 0.18, offerSize: 0.55, offerWeight: '400', offerTransform: 'uppercase',
    legendSize: 0.20, legendWeight: '400', legendTransform: 'uppercase'
  },
  'Anton': {
    fontWeight: '400', fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.02,
    introSize: 0.30, introWeight: '400', introTransform: 'uppercase',
    headlineSize: 0.17, offerSize: 0.52, offerWeight: '400', offerTransform: 'uppercase',
    legendSize: 0.18, legendWeight: '400', legendTransform: 'uppercase'
  },
  'Archivo Black': {
    fontWeight: '400', fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.01,
    introSize: 0.28, introWeight: '400', introTransform: 'uppercase',
    headlineSize: 0.14, offerSize: 0.48, offerWeight: '400', offerTransform: 'uppercase',
    legendSize: 0.18, legendWeight: '400', legendTransform: 'none'
  },
  'Oswald': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.02,
    introSize: 0.32, introWeight: '400', introTransform: 'uppercase',
    headlineSize: 0.16, offerSize: 0.55, offerWeight: '700', offerTransform: 'uppercase',
    legendSize: 0.20, legendWeight: '400', legendTransform: 'none'
  },
  'Barlow Condensed': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.03,
    introSize: 0.34, introWeight: '500', introTransform: 'uppercase',
    headlineSize: 0.18, offerSize: 0.58, offerWeight: '800', offerTransform: 'uppercase',
    legendSize: 0.22, legendWeight: '400', legendTransform: 'none'
  },
  'Inter': {
    fontWeight: '800', fontStyle: 'normal', textTransform: 'none', letterSpacing: -0.025,
    introSize: 0.40, introWeight: '600', introTransform: 'none',
    headlineSize: 0.17, offerSize: 0.70, offerWeight: '900', offerTransform: 'uppercase',
    legendSize: 0.23, legendWeight: '400', legendTransform: 'none'
  },
  'Montserrat': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: -0.01,
    introSize: 0.35, introWeight: '500', introTransform: 'none',
    headlineSize: 0.14, offerSize: 0.60, offerWeight: '800', offerTransform: 'uppercase',
    legendSize: 0.20, legendWeight: '400', legendTransform: 'none'
  },
  'Poppins': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: -0.01,
    introSize: 0.36, introWeight: '500', introTransform: 'none',
    headlineSize: 0.14, offerSize: 0.58, offerWeight: '700', offerTransform: 'uppercase',
    legendSize: 0.20, legendWeight: '400', legendTransform: 'none'
  },
  'Space Grotesk': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: -0.02,
    introSize: 0.36, introWeight: '500', introTransform: 'none',
    headlineSize: 0.15, offerSize: 0.62, offerWeight: '700', offerTransform: 'uppercase',
    legendSize: 0.22, legendWeight: '400', legendTransform: 'none'
  },
  'DM Sans': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: -0.01,
    introSize: 0.36, introWeight: '500', introTransform: 'none',
    headlineSize: 0.15, offerSize: 0.60, offerWeight: '700', offerTransform: 'uppercase',
    legendSize: 0.22, legendWeight: '400', legendTransform: 'none'
  },
  'Raleway': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: 0.01,
    introSize: 0.34, introWeight: '500', introTransform: 'none',
    headlineSize: 0.14, offerSize: 0.58, offerWeight: '800', offerTransform: 'uppercase',
    legendSize: 0.20, legendWeight: '400', legendTransform: 'none'
  },
  'Roboto': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: 0,
    introSize: 0.36, introWeight: '500', introTransform: 'none',
    headlineSize: 0.15, offerSize: 0.60, offerWeight: '900', offerTransform: 'uppercase',
    legendSize: 0.22, legendWeight: '400', legendTransform: 'none'
  },
  'Open Sans': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: 0,
    introSize: 0.36, introWeight: '500', introTransform: 'none',
    headlineSize: 0.14, offerSize: 0.58, offerWeight: '800', offerTransform: 'uppercase',
    legendSize: 0.22, legendWeight: '400', legendTransform: 'none'
  },
  'Lato': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: 0.01,
    introSize: 0.36, introWeight: '400', introTransform: 'none',
    headlineSize: 0.15, offerSize: 0.60, offerWeight: '900', offerTransform: 'uppercase',
    legendSize: 0.22, legendWeight: '400', legendTransform: 'none'
  },
  'Playfair Display': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: 0,
    introSize: 0.32, introWeight: '400', introTransform: 'none',
    headlineSize: 0.14, offerSize: 0.55, offerWeight: '800', offerTransform: 'uppercase',
    legendSize: 0.20, legendWeight: '400', legendTransform: 'none'
  },
  'Helvetica': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: -0.01,
    introSize: 0.36, introWeight: '400', introTransform: 'none',
    headlineSize: 0.15, offerSize: 0.62, offerWeight: '700', offerTransform: 'uppercase',
    legendSize: 0.22, legendWeight: '400', legendTransform: 'none'
  },
  'Impact': {
    fontWeight: '400', fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.02,
    introSize: 0.30, introWeight: '400', introTransform: 'uppercase',
    headlineSize: 0.16, offerSize: 0.50, offerWeight: '400', offerTransform: 'uppercase',
    legendSize: 0.18, legendWeight: '400', legendTransform: 'uppercase'
  },
  'Arial Black': {
    fontWeight: '400', fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: 0.01,
    introSize: 0.28, introWeight: '400', introTransform: 'uppercase',
    headlineSize: 0.13, offerSize: 0.45, offerWeight: '400', offerTransform: 'uppercase',
    legendSize: 0.18, legendWeight: '400', legendTransform: 'none'
  },
  'Arial': {
    fontWeight: '700', fontStyle: 'normal', textTransform: 'none', letterSpacing: 0,
    introSize: 0.36, introWeight: '400', introTransform: 'none',
    headlineSize: 0.15, offerSize: 0.60, offerWeight: '700', offerTransform: 'uppercase',
    legendSize: 0.22, legendWeight: '400', legendTransform: 'none'
  }
};

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

  const gapIntroToHeadline = baseHeadlineSize * 0.27;
  const gapHeadlineLines = baseHeadlineSize * 0.07;
  const gapHeadlineToOffer = baseHeadlineSize * 0.70;
  const gapOfferToLegend = baseHeadlineSize * 0.42;

  const elements = [];
  let contentHeight = 0;

  if (introText) {
    elements.push({ type: 'intro', text: introText, fontSize: introFontSize, weight: introWeight !== 'normal' ? introWeight : globalWeight });
    contentHeight += introFontSize;
    if (headlineText1 || headlineText2) contentHeight += gapIntroToHeadline;
  }

  if (headlineText1) {
    elements.push({ type: 'headline1', text: headlineText1, fontSize: headline1FontSize, weight: globalWeight });
    contentHeight += headline1FontSize;
  }

  if (headlineText2) {
    if (headlineText1) contentHeight += gapHeadlineLines;
    elements.push({ type: 'headline2', text: headlineText2, fontSize: headline2FontSize, weight: globalWeight });
    contentHeight += headline2FontSize;
  }

  if (offerText) {
    if (headlineText1 || headlineText2) contentHeight += gapHeadlineToOffer;
    elements.push({ type: 'offer', text: offerText, fontSize: offerFontSize, weight: offerWeight });
    contentHeight += offerFontSize;
  }

  if (legendText) {
    if (offerText) contentHeight += gapOfferToLegend;
    else if (headlineText1 || headlineText2) contentHeight += gapHeadlineToOffer;
    elements.push({ type: 'legend', text: legendText, fontSize: legendFontSize, weight: legendWeight !== 'normal' ? legendWeight : globalWeight });
    contentHeight += legendFontSize;
  }

  function render(targetCtx, scale) {
    targetCtx.save();
    targetCtx.scale(scale, scale);

    targetCtx.fillStyle = bgColor;
    targetCtx.fillRect(0, 0, width, height);

    const opticalOffset = height * 0.04;
    let currentY = (height - contentHeight) / 2 - opticalOffset;

    targetCtx.fillStyle = textColor;
    targetCtx.textAlign = 'center';
    targetCtx.textBaseline = 'top';

    elements.forEach((el, index) => {
      targetCtx.font = `${globalStyle} ${el.weight} ${el.fontSize}px "${fontFamily}"`;

      if (letterSpacing !== 0) {
        const spacing = el.fontSize * letterSpacing;
        const text = el.text;
        if (text) {
          const totalWidth = targetCtx.measureText(text).width + (text.length - 1) * spacing;
          let charX = width / 2 - totalWidth / 2;
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charWidth = targetCtx.measureText(char).width;
            targetCtx.fillText(char, charX + charWidth / 2, currentY);
            charX += charWidth + spacing;
          }
        }
      } else {
        targetCtx.fillText(el.text, width / 2, currentY);
      }

      currentY += el.fontSize;

      const next = elements[index + 1];
      if (el.type === 'intro' && next) currentY += gapIntroToHeadline;
      else if (el.type === 'headline1' && next?.type === 'headline2') currentY += gapHeadlineLines;
      else if ((el.type === 'headline1' || el.type === 'headline2') && next?.type === 'offer') currentY += gapHeadlineToOffer;
      else if ((el.type === 'headline1' || el.type === 'headline2') && next?.type === 'legend') currentY += gapHeadlineToOffer;
      else if (el.type === 'offer' && next?.type === 'legend') currentY += gapOfferToLegend;
    });

    targetCtx.restore();
  }

  render(ctx, dpr);
  render(exportCtx, 1);
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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are an expert ad copywriter. Generate ad copy variations based on this brief:

${prompt}

Generate variations in JSON format. Each variation should have:
- intro: A short qualifier/hook (2-4 words, e.g., "WordPress User?", "Slow Website?")
- headline1: First line of headline (3-5 words)
- headline2: Second line of headline (1-3 words, the punch)
- offer: The CTA/offer (3-6 words, e.g., "FREE: 100 GB / Mo", "Try Free for 30 Days")
- legend: Fine print/supporting text (5-10 words)

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

  const gapIntroToHeadline = baseHeadlineSize * 0.27;
  const gapHeadlineLines = baseHeadlineSize * 0.07;
  const gapHeadlineToOffer = baseHeadlineSize * 0.70;
  const gapOfferToLegend = baseHeadlineSize * 0.42;

  const elements = [];
  let contentHeight = 0;

  if (introText) {
    elements.push({ text: introText, fontSize: introFontSize, weight: template.introWeight, type: 'intro' });
    contentHeight += introFontSize;
    if (headlineText1 || headlineText2) contentHeight += gapIntroToHeadline;
  }
  if (headlineText1) {
    elements.push({ text: headlineText1, fontSize: headline1FontSize, weight: template.fontWeight, type: 'headline1' });
    contentHeight += headline1FontSize;
  }
  if (headlineText2) {
    if (headlineText1) contentHeight += gapHeadlineLines;
    elements.push({ text: headlineText2, fontSize: headline2FontSize, weight: template.fontWeight, type: 'headline2' });
    contentHeight += headline2FontSize;
  }
  if (offerText) {
    if (headlineText1 || headlineText2) contentHeight += gapHeadlineToOffer;
    elements.push({ text: offerText, fontSize: offerFontSize, weight: template.offerWeight, type: 'offer' });
    contentHeight += offerFontSize;
  }
  if (legendText) {
    if (offerText) contentHeight += gapOfferToLegend;
    else if (headlineText1 || headlineText2) contentHeight += gapHeadlineToOffer;
    elements.push({ text: legendText, fontSize: legendFontSize, weight: template.legendWeight, type: 'legend' });
    contentHeight += legendFontSize;
  }

  // Draw
  tempCtx.fillStyle = template.bgColor;
  tempCtx.fillRect(0, 0, width, height);

  const opticalOffset = height * 0.04;
  let currentY = (height - contentHeight) / 2 - opticalOffset;

  tempCtx.fillStyle = template.textColor;
  tempCtx.textAlign = 'center';
  tempCtx.textBaseline = 'top';

  elements.forEach((el, index) => {
    tempCtx.font = `${template.fontStyle} ${el.weight} ${el.fontSize}px "${template.fontFamily}"`;

    if (template.letterSpacing !== 0) {
      const spacing = el.fontSize * template.letterSpacing;
      const totalWidth = tempCtx.measureText(el.text).width + (el.text.length - 1) * spacing;
      let charX = width / 2 - totalWidth / 2;
      for (let i = 0; i < el.text.length; i++) {
        const char = el.text[i];
        const charWidth = tempCtx.measureText(char).width;
        tempCtx.fillText(char, charX + charWidth / 2, currentY);
        charX += charWidth + spacing;
      }
    } else {
      tempCtx.fillText(el.text, width / 2, currentY);
    }

    currentY += el.fontSize;

    const next = elements[index + 1];
    if (el.type === 'intro' && next) currentY += gapIntroToHeadline;
    else if (el.type === 'headline1' && next?.type === 'headline2') currentY += gapHeadlineLines;
    else if ((el.type === 'headline1' || el.type === 'headline2') && next?.type === 'offer') currentY += gapHeadlineToOffer;
    else if ((el.type === 'headline1' || el.type === 'headline2') && next?.type === 'legend') currentY += gapHeadlineToOffer;
    else if (el.type === 'offer' && next?.type === 'legend') currentY += gapOfferToLegend;
  });

  const effectiveDpi = 72 * dpr;
  return embedPngDpi(tempCanvas.toDataURL('image/png'), effectiveDpi);
}

// ==========================================
// INITIALIZATION
// ==========================================

updateApiKeyStatus();
renderDataTable();
document.fonts.ready.then(() => generateAd());
