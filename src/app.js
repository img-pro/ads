// ==========================================
// AD STUDIO - Main Application
// ==========================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
// CONFIG CODE BLOCK
// ==========================================

function updateConfigCode() {
  const q = s => `'${s}'`;
  const n = v => v;

  const width = parseInt(document.getElementById('width')?.value) || 1200;
  const height = parseInt(document.getElementById('height')?.value) || 628;
  const bgColor = document.getElementById('bgColor')?.value || '#0033FF';
  const textColor = document.getElementById('textColor')?.value || '#FFFFFF';
  const fontFamily = document.getElementById('fontFamily')?.value || 'Helvetica';
  const letterSpacing = parseFloat(document.getElementById('letterSpacing')?.value) || 0;
  const opticalYOffset = parseFloat(document.getElementById('opticalYOffset')?.value) || 0.055;

  const intro = {
    text: document.getElementById('introText')?.value || '',
    size: parseFloat(document.getElementById('introSize')?.value) || 0.06,
    weight: document.getElementById('introWeight')?.value || '500',
    transform: document.getElementById('introTransform')?.value || 'none',
    marginTop: parseFloat(document.getElementById('introMarginTop')?.value) || 0
  };

  const headline = {
    text1: document.getElementById('headlineText1')?.value || '',
    text2: document.getElementById('headlineText2')?.value || '',
    size: parseFloat(document.getElementById('headlineSize')?.value) || 0.16,
    weight: document.getElementById('headlineWeight')?.value || '700',
    transform: document.getElementById('headlineTransform')?.value || 'uppercase',
    marginTop: parseFloat(document.getElementById('headlineMarginTop')?.value) || 0.02,
    lineHeight: parseFloat(document.getElementById('headlineLineHeight')?.value) || 1.05
  };

  const offer = {
    text: document.getElementById('offerText')?.value || '',
    size: parseFloat(document.getElementById('offerSize')?.value) || 0.11,
    weight: document.getElementById('offerWeight')?.value || '800',
    transform: document.getElementById('offerTransform')?.value || 'uppercase',
    marginTop: parseFloat(document.getElementById('offerMarginTop')?.value) || 0.15
  };

  const legend = {
    text: document.getElementById('legendText')?.value || '',
    size: parseFloat(document.getElementById('legendSize')?.value) || 0.035,
    weight: document.getElementById('legendWeight')?.value || '400',
    transform: document.getElementById('legendTransform')?.value || 'none',
    marginTop: parseFloat(document.getElementById('legendMarginTop')?.value) || 0.06
  };

  const output = `const CONFIG = {
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
  }
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

// Initial render
renderSizeList('reddit');

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
  const canvasDims = document.getElementById('canvasDims');
  const canvasInfo = document.getElementById('canvasInfo');
  if (canvasDims) canvasDims.textContent = `${w} × ${h}`;
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

  // Get values from UI
  const bgColor = document.getElementById('bgColor')?.value || '#0033FF';
  const textColor = document.getElementById('textColor')?.value || '#FFFFFF';
  const fontFamily = document.getElementById('fontFamily')?.value || 'Inter';
  const fontScale = parseFloat(document.getElementById('fontScale')?.value) || 1;
  const letterSpacing = parseFloat(document.getElementById('letterSpacing')?.value) || 0;
  const opticalYOffset = parseFloat(document.getElementById('opticalYOffset')?.value) || 0.05;

  // Get element configs
  const intro = {
    text: document.getElementById('introText')?.value || '',
    size: parseFloat(document.getElementById('introSize')?.value) || 0.06,
    weight: document.getElementById('introWeight')?.value || '500',
    transform: document.getElementById('introTransform')?.value || 'none',
    marginTop: parseFloat(document.getElementById('introMarginTop')?.value) || 0
  };

  const headline = {
    text1: document.getElementById('headlineText1')?.value || '',
    text2: document.getElementById('headlineText2')?.value || '',
    size: parseFloat(document.getElementById('headlineSize')?.value) || 0.16,
    weight: document.getElementById('headlineWeight')?.value || '700',
    transform: document.getElementById('headlineTransform')?.value || 'uppercase',
    marginTop: parseFloat(document.getElementById('headlineMarginTop')?.value) || 0.02,
    lineHeight: parseFloat(document.getElementById('headlineLineHeight')?.value) || 1.05
  };

  const offer = {
    text: document.getElementById('offerText')?.value || '',
    size: parseFloat(document.getElementById('offerSize')?.value) || 0.11,
    weight: document.getElementById('offerWeight')?.value || '800',
    transform: document.getElementById('offerTransform')?.value || 'uppercase',
    marginTop: parseFloat(document.getElementById('offerMarginTop')?.value) || 0.15
  };

  const legend = {
    text: document.getElementById('legendText')?.value || '',
    size: parseFloat(document.getElementById('legendSize')?.value) || 0.035,
    weight: document.getElementById('legendWeight')?.value || '400',
    transform: document.getElementById('legendTransform')?.value || 'none',
    marginTop: parseFloat(document.getElementById('legendMarginTop')?.value) || 0.06
  };

  // Apply text transforms
  const introText = applyTransform(intro.text, intro.transform);
  const headlineText1 = applyTransform(headline.text1, headline.transform);
  const headlineText2 = applyTransform(headline.text2, headline.transform);
  const offerText = applyTransform(offer.text, offer.transform);
  const legendText = applyTransform(legend.text, legend.transform);

  // Calculate font sizes (all as % of canvas height, scaled by fontScale)
  const maxTextWidth = width * 0.88;
  const introFontSize = fitText(exportCtx, introText, maxTextWidth, height * intro.size * fontScale, intro.weight, fontFamily, letterSpacing);
  const headline1FontSize = fitText(exportCtx, headlineText1, maxTextWidth, height * headline.size * fontScale, headline.weight, fontFamily, letterSpacing);
  const headline2FontSize = fitText(exportCtx, headlineText2, maxTextWidth, height * headline.size * fontScale, headline.weight, fontFamily, letterSpacing);
  const offerFontSize = fitText(exportCtx, offerText, maxTextWidth, height * offer.size * fontScale, offer.weight, fontFamily, letterSpacing);
  const legendFontSize = fitText(exportCtx, legendText, maxTextWidth, height * legend.size * fontScale, legend.weight, fontFamily, letterSpacing);

  // Build elements array (margins and line heights also scaled)
  const elements = [];
  let contentHeight = 0;

  if (introText) {
    const marginTop = height * intro.marginTop * fontScale;
    contentHeight += marginTop;
    elements.push({ text: introText, fontSize: introFontSize, weight: intro.weight, marginTop });
    contentHeight += introFontSize;
  }

  if (headlineText1) {
    const marginTop = height * headline.marginTop * fontScale;
    contentHeight += marginTop;
    elements.push({ text: headlineText1, fontSize: headline1FontSize, weight: headline.weight, marginTop });
    contentHeight += headline1FontSize;
  }

  if (headlineText2) {
    const lineGap = headline1FontSize * (headline.lineHeight - 1);
    contentHeight += lineGap;
    elements.push({ text: headlineText2, fontSize: headline2FontSize, weight: headline.weight, marginTop: lineGap });
    contentHeight += headline2FontSize;
  }

  if (offerText) {
    const marginTop = height * offer.marginTop * fontScale;
    contentHeight += marginTop;
    elements.push({ text: offerText, fontSize: offerFontSize, weight: offer.weight, marginTop });
    contentHeight += offerFontSize;
  }

  if (legendText) {
    const marginTop = height * legend.marginTop * fontScale;
    contentHeight += marginTop;
    elements.push({ text: legendText, fontSize: legendFontSize, weight: legend.weight, marginTop });
    contentHeight += legendFontSize;
  }

  function render(targetCtx, scale) {
    targetCtx.save();
    targetCtx.scale(scale, scale);

    targetCtx.fillStyle = bgColor;
    targetCtx.fillRect(0, 0, width, height);

    const opticalOffset = height * opticalYOffset;
    let currentY = (height - contentHeight) / 2 - opticalOffset;

    targetCtx.fillStyle = textColor;
    targetCtx.textAlign = 'center';
    targetCtx.textBaseline = 'top';

    elements.forEach((el) => {
      currentY += el.marginTop;

      targetCtx.font = `${el.weight} ${el.fontSize}px "${fontFamily}"`;

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
  loadDefaults();
  document.getElementById('sizePlatform').value = 'reddit';
  renderSizeList('reddit');
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
  const fontFamily = document.getElementById('fontFamily')?.value || 'Helvetica';
  await ensureFontLoaded(fontFamily);
  originalGenerateAd();
};

// ==========================================
// BUILDER EVENT LISTENERS
// ==========================================

document.querySelectorAll('#builder-tab input, #builder-tab select').forEach(input => {
  input.addEventListener('input', (e) => {
    // When font changes, apply preset if one exists
    if (e.target.id === 'fontFamily') {
      applyFontPreset(e.target.value);
    }
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
          content: `You are an expert performance ad copywriter. Your copy is emotional, not rational. Research shows emotional ads succeed 2x more than feature-focused ones (31% vs 16%).

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
- Goal: Stop scroll → emotional connection → action

## Brief from user:
${prompt}

## Output format
Generate 5-8 variations exploring different emotional angles (aspiration, fear, belonging, control, simplicity). Each variation must have:
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
    fontFamily: document.getElementById('fontFamily')?.value || 'Helvetica',
    letterSpacing: parseFloat(document.getElementById('letterSpacing')?.value) || 0,
    opticalYOffset: parseFloat(document.getElementById('opticalYOffset')?.value) || 0.055,
    intro: {
      size: parseFloat(document.getElementById('introSize')?.value) || 0.06,
      weight: document.getElementById('introWeight')?.value || '500',
      transform: document.getElementById('introTransform')?.value || 'none',
      marginTop: parseFloat(document.getElementById('introMarginTop')?.value) || 0
    },
    headline: {
      size: parseFloat(document.getElementById('headlineSize')?.value) || 0.16,
      weight: document.getElementById('headlineWeight')?.value || '700',
      transform: document.getElementById('headlineTransform')?.value || 'uppercase',
      marginTop: parseFloat(document.getElementById('headlineMarginTop')?.value) || 0.02,
      lineHeight: parseFloat(document.getElementById('headlineLineHeight')?.value) || 1.05
    },
    offer: {
      size: parseFloat(document.getElementById('offerSize')?.value) || 0.11,
      weight: document.getElementById('offerWeight')?.value || '800',
      transform: document.getElementById('offerTransform')?.value || 'uppercase',
      marginTop: parseFloat(document.getElementById('offerMarginTop')?.value) || 0.15
    },
    legend: {
      size: parseFloat(document.getElementById('legendSize')?.value) || 0.035,
      weight: document.getElementById('legendWeight')?.value || '400',
      transform: document.getElementById('legendTransform')?.value || 'none',
      marginTop: parseFloat(document.getElementById('legendMarginTop')?.value) || 0.06
    }
  };

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

  // Apply transforms
  const introText = applyTransform(row.intro, template.intro.transform);
  const headlineText1 = applyTransform(row.headline1, template.headline.transform);
  const headlineText2 = applyTransform(row.headline2, template.headline.transform);
  const offerText = applyTransform(row.offer, template.offer.transform);
  const legendText = applyTransform(row.legend, template.legend.transform);

  const maxTextWidth = width * 0.88;

  // Calculate font sizes
  const introFontSize = fitText(tempCtx, introText, maxTextWidth, height * template.intro.size, template.intro.weight, template.fontFamily, template.letterSpacing);
  const headline1FontSize = fitText(tempCtx, headlineText1, maxTextWidth, height * template.headline.size, template.headline.weight, template.fontFamily, template.letterSpacing);
  const headline2FontSize = fitText(tempCtx, headlineText2, maxTextWidth, height * template.headline.size, template.headline.weight, template.fontFamily, template.letterSpacing);
  const offerFontSize = fitText(tempCtx, offerText, maxTextWidth, height * template.offer.size, template.offer.weight, template.fontFamily, template.letterSpacing);
  const legendFontSize = fitText(tempCtx, legendText, maxTextWidth, height * template.legend.size, template.legend.weight, template.fontFamily, template.letterSpacing);

  // Build elements
  const elements = [];
  let contentHeight = 0;

  if (introText) {
    const marginTop = height * template.intro.marginTop;
    contentHeight += marginTop;
    elements.push({ text: introText, fontSize: introFontSize, weight: template.intro.weight, marginTop });
    contentHeight += introFontSize;
  }
  if (headlineText1) {
    const marginTop = height * template.headline.marginTop;
    contentHeight += marginTop;
    elements.push({ text: headlineText1, fontSize: headline1FontSize, weight: template.headline.weight, marginTop });
    contentHeight += headline1FontSize;
  }
  if (headlineText2) {
    const lineGap = headline1FontSize * (template.headline.lineHeight - 1);
    contentHeight += lineGap;
    elements.push({ text: headlineText2, fontSize: headline2FontSize, weight: template.headline.weight, marginTop: lineGap });
    contentHeight += headline2FontSize;
  }
  if (offerText) {
    const marginTop = height * template.offer.marginTop;
    contentHeight += marginTop;
    elements.push({ text: offerText, fontSize: offerFontSize, weight: template.offer.weight, marginTop });
    contentHeight += offerFontSize;
  }
  if (legendText) {
    const marginTop = height * template.legend.marginTop;
    contentHeight += marginTop;
    elements.push({ text: legendText, fontSize: legendFontSize, weight: template.legend.weight, marginTop });
    contentHeight += legendFontSize;
  }

  // Draw
  tempCtx.fillStyle = template.bgColor;
  tempCtx.fillRect(0, 0, width, height);

  const opticalOffset = height * template.opticalYOffset;
  let currentY = (height - contentHeight) / 2 - opticalOffset;

  tempCtx.fillStyle = template.textColor;
  tempCtx.textAlign = 'center';
  tempCtx.textBaseline = 'top';

  elements.forEach((el) => {
    currentY += el.marginTop;

    tempCtx.font = `${el.weight} ${el.fontSize}px "${template.fontFamily}"`;

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

// Initialize
loadDefaults();
updateApiKeyStatus();
renderDataTable();
document.fonts.ready.then(() => generateAd());
