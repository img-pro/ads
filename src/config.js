// ==========================================
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

// ==========================================
// EFFECT LIBRARY - Pre-tested visual effects
// ==========================================
// Each effect is tested across color combinations for reliability.
// AI selects effects by name instead of writing arbitrary code.

const EFFECT_LIBRARY = {
  background: {
    'none': null,
    'gradient-subtle': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, 'rgba(255,255,255,0.08)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.08)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'gradient-radial': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.7);
      gradient.addColorStop(0, 'rgba(255,255,255,0.12)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.12)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'gradient-diagonal': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
      gradient.addColorStop(0.5, 'rgba(128,128,128,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'vignette': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createRadialGradient(w/2, h/2, Math.min(w, h) * 0.2, w/2, h/2, Math.max(w, h) * 0.8);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'vignette-light': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createRadialGradient(w/2, h/2, Math.min(w, h) * 0.3, w/2, h/2, Math.max(w, h) * 0.7);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'glow-center': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.6);
      gradient.addColorStop(0, 'rgba(255,255,255,0.15)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.05)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'spotlight-top': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createRadialGradient(w/2, -h*0.2, 0, w/2, -h*0.2, h * 1.2);
      gradient.addColorStop(0, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,0.05)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'duotone-warm': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, 'rgba(255,100,50,0.1)');
      gradient.addColorStop(1, 'rgba(150,50,200,0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'duotone-cool': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, 'rgba(0,200,255,0.1)');
      gradient.addColorStop(1, 'rgba(100,0,255,0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    },
    'noise-light': (ctx, w, h, bg, fg) => {
      // Subtle noise texture for organic feel
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.globalAlpha = 1;
    }
  },

  text: {
    'none': null,
    'shadow-soft': (ctx, w, h, bg, fg) => {
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = h * 0.03;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = h * 0.012;
    },
    'shadow-medium': (ctx, w, h, bg, fg) => {
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = h * 0.025;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = h * 0.015;
    },
    'shadow-hard': (ctx, w, h, bg, fg) => {
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = h * 0.008;
      ctx.shadowOffsetX = h * 0.005;
      ctx.shadowOffsetY = h * 0.008;
    },
    'shadow-dramatic': (ctx, w, h, bg, fg) => {
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = h * 0.05;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = h * 0.025;
    },
    'lift': (ctx, w, h, bg, fg) => {
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = h * 0.06;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = h * 0.02;
    },
    'glow-soft': (ctx, w, h, bg, fg) => {
      ctx.shadowColor = fg;
      ctx.shadowBlur = h * 0.02;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    },
    'glow-medium': (ctx, w, h, bg, fg) => {
      ctx.shadowColor = fg;
      ctx.shadowBlur = h * 0.04;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    },
    'glow-strong': (ctx, w, h, bg, fg) => {
      ctx.shadowColor = fg;
      ctx.shadowBlur = h * 0.06;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    },
    'outline-thin': (ctx, w, h, bg, fg) => {
      ctx.strokeStyle = bg;
      ctx.lineWidth = h * 0.003;
      ctx.lineJoin = 'round';
    },
    'outline-medium': (ctx, w, h, bg, fg) => {
      ctx.strokeStyle = bg;
      ctx.lineWidth = h * 0.006;
      ctx.lineJoin = 'round';
    }
  },

  foreground: {
    'none': null,
    'border-thin': (ctx, w, h, bg, fg) => {
      const inset = Math.min(w, h) * 0.04;
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
      ctx.globalAlpha = 1;
    },
    'border-medium': (ctx, w, h, bg, fg) => {
      const inset = Math.min(w, h) * 0.05;
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 2;
      ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
      ctx.globalAlpha = 1;
    },
    'border-bold': (ctx, w, h, bg, fg) => {
      const inset = Math.min(w, h) * 0.05;
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 3;
      ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
      ctx.globalAlpha = 1;
    },
    'corners': (ctx, w, h, bg, fg) => {
      const inset = Math.min(w, h) * 0.05;
      const len = Math.min(w, h) * 0.08;
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Top-left
      ctx.moveTo(inset, inset + len); ctx.lineTo(inset, inset); ctx.lineTo(inset + len, inset);
      // Top-right
      ctx.moveTo(w - inset - len, inset); ctx.lineTo(w - inset, inset); ctx.lineTo(w - inset, inset + len);
      // Bottom-right
      ctx.moveTo(w - inset, h - inset - len); ctx.lineTo(w - inset, h - inset); ctx.lineTo(w - inset - len, h - inset);
      // Bottom-left
      ctx.moveTo(inset + len, h - inset); ctx.lineTo(inset, h - inset); ctx.lineTo(inset, h - inset - len);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    'corners-bold': (ctx, w, h, bg, fg) => {
      const inset = Math.min(w, h) * 0.06;
      const len = Math.min(w, h) * 0.1;
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(inset, inset + len); ctx.lineTo(inset, inset); ctx.lineTo(inset + len, inset);
      ctx.moveTo(w - inset - len, inset); ctx.lineTo(w - inset, inset); ctx.lineTo(w - inset, inset + len);
      ctx.moveTo(w - inset, h - inset - len); ctx.lineTo(w - inset, h - inset); ctx.lineTo(w - inset - len, h - inset);
      ctx.moveTo(inset + len, h - inset); ctx.lineTo(inset, h - inset); ctx.lineTo(inset, h - inset - len);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    'line-bottom': (ctx, w, h, bg, fg) => {
      const inset = w * 0.1;
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(inset, h * 0.88);
      ctx.lineTo(w - inset, h * 0.88);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    'gradient-fade-bottom': (ctx, w, h, bg, fg) => {
      const gradient = ctx.createLinearGradient(0, h * 0.7, 0, h);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }
  }
};

// ==========================================
// FONT MOODS - Organized by personality
// ==========================================
// Each font has a description to help AI match typography to ad content.
// Format: { name, description } for rich context.

const FONT_MOODS = {
  bold: {
    description: 'Commands attention, loud, unapologetic. For sales, announcements, urgency.',
    fonts: [
      { name: 'Bebas Neue', desc: 'tall condensed, cinematic, poster-style impact' },
      { name: 'Anton', desc: 'heavy black, maximum impact, screams for attention' },
      { name: 'Archivo Black', desc: 'wide and solid, stable yet bold' },
      { name: 'Impact', desc: 'classic bold, meme-culture familiar, undeniable presence' },
      { name: 'Oswald', desc: 'refined condensed, editorial boldness' },
      { name: 'Teko', desc: 'industrial, sporty, high-energy' },
      { name: 'Russo One', desc: 'futuristic bold, gaming and tech vibes' }
    ]
  },

  modern: {
    description: 'Tech-forward, minimal, precise. For SaaS, apps, startups, innovation.',
    fonts: [
      { name: 'Inter', desc: 'UI perfection, neutral, highly legible at any size' },
      { name: 'Space Grotesk', desc: 'quirky geometric, techy personality' },
      { name: 'DM Sans', desc: 'friendly geometric, approachable tech' },
      { name: 'Outfit', desc: 'variable weight, modern versatility' },
      { name: 'Sora', desc: 'futuristic, slightly playful geometry' },
      { name: 'Manrope', desc: 'semi-rounded, friendly yet professional' },
      { name: 'Plus Jakarta Sans', desc: 'contemporary, clean startup aesthetic' }
    ]
  },

  warm: {
    description: 'Approachable, human, trustworthy. For lifestyle, wellness, community.',
    fonts: [
      { name: 'Poppins', desc: 'geometric friendly, versatile warmth' },
      { name: 'Nunito', desc: 'rounded terminals, soft and inviting' },
      { name: 'Quicksand', desc: 'light and airy, gentle personality' },
      { name: 'Rubik', desc: 'slightly rounded, casual confidence' },
      { name: 'Comfortaa', desc: 'rounded geometric, cozy and modern' },
      { name: 'Varela Round', desc: 'friendly curves, unpretentious charm' }
    ]
  },

  condensed: {
    description: 'Space-efficient, editorial, news-like. For headlines, limited space, impact.',
    fonts: [
      { name: 'Oswald', desc: 'refined narrow, editorial authority' },
      { name: 'Barlow Condensed', desc: 'industrial narrow, utilitarian elegance' },
      { name: 'Roboto Condensed', desc: 'neutral narrow, versatile workhorse' },
      { name: 'PT Sans Narrow', desc: 'humanist narrow, readable compression' },
      { name: 'Fjalla One', desc: 'strong narrow, Scandinavian boldness' },
      { name: 'Saira Condensed', desc: 'sporty narrow, dynamic energy' }
    ]
  },

  classic: {
    description: 'Safe, readable, professional. For corporate, finance, healthcare, trust.',
    fonts: [
      { name: 'Roboto', desc: 'Google standard, neutral reliability' },
      { name: 'Open Sans', desc: 'humanist clarity, universal appeal' },
      { name: 'Lato', desc: 'warm professionalism, serious but friendly' },
      { name: 'Source Sans 3', desc: 'Adobe workhorse, technical clarity' },
      { name: 'Noto Sans', desc: 'global coverage, inclusive design' },
      { name: 'IBM Plex Sans', desc: 'corporate precision, tech heritage' }
    ]
  },

  premium: {
    description: 'Luxury, sophisticated, elegant. For fashion, jewelry, high-end brands.',
    fonts: [
      { name: 'Playfair Display', desc: 'high contrast serif, editorial luxury' },
      { name: 'Cormorant Garamond', desc: 'delicate serif, refined elegance' },
      { name: 'Libre Baskerville', desc: 'classic book serif, timeless sophistication' },
      { name: 'Crimson Text', desc: 'old-style serif, literary gravitas' },
      { name: 'DM Serif Display', desc: 'modern serif, contemporary luxury' }
    ]
  },

  geometric: {
    description: 'Bauhaus-inspired, architectural, structured. For design, architecture, art.',
    fonts: [
      { name: 'Montserrat', desc: 'urban geometric, versatile modernism' },
      { name: 'Raleway', desc: 'elegant thin strokes, fashion-forward' },
      { name: 'Josefin Sans', desc: 'vintage geometric, art deco hints' },
      { name: 'Questrial', desc: 'clean geometric, quiet confidence' },
      { name: 'Jost', desc: 'Futura-inspired, timeless geometry' },
      { name: 'Albert Sans', desc: 'geometric grotesk, balanced modernism' }
    ]
  }
};

// Flat list of all available fonts (for validation)
const ALL_FONTS = [...new Set(Object.values(FONT_MOODS).flatMap(m => m.fonts.map(f => f.name)))];

// ==========================================
// CONTRAST UTILITIES
// ==========================================

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(bg, fg) {
  const l1 = getLuminance(bg);
  const l2 = getLuminance(fg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Minimum contrast for large text (WCAG AA is 3:1, we use 4.5:1 for excellence)
const MIN_CONTRAST_RATIO = 4.5;

function isContrastValid(bg, fg) {
  return getContrastRatio(bg, fg) >= MIN_CONTRAST_RATIO;
}

// Auto-fix low contrast by choosing white or black
function ensureContrast(bg, preferredFg) {
  if (isContrastValid(bg, preferredFg)) return preferredFg;

  const bgLuminance = getLuminance(bg);
  // If background is dark, use white; if light, use black
  return bgLuminance < 0.5 ? '#FFFFFF' : '#000000';
}

const CONFIG = {
  canvas: {
    width: 1200,
    height: 628
  },

  colors: {
    background: '#0033FF',
    text: '#FFFFFF'
  },

  typography: {
    fontFamily: 'Inter',
    fontScale: 1,
    letterSpacing: 0,
    opticalYOffset: 0.05
  },

  elements: {
    intro: {
      text: 'WordPress Developers',
      size: 0.042,
      weight: '500',
      transform: 'uppercase',
      marginTop: 0
    },
    headline: {
      text: ['Stop Overpaying', 'for Bandwidth'],
      size: 0.125,
      weight: '700',
      transform: 'none',
      marginTop: 0.015,
      lineHeight: 1.0
    },
    offer: {
      text: 'Start Free Today',
      size: 0.065,
      weight: '600',
      transform: 'none',
      marginTop: 0.07
    },
    legend: {
      text: 'No credit card required',
      size: 0.028,
      weight: '400',
      transform: 'none',
      marginTop: 0.025
    }
  },

  // Font presets optimized for each typeface's characteristics
  fontPresets: {
    'Inter': {
      intro: { size: 0.042, weight: '500', transform: 'uppercase' },
      headline: { size: 0.125, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.065, weight: '600', transform: 'none' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'Helvetica': {
      intro: { size: 0.042, weight: '500', transform: 'uppercase' },
      headline: { size: 0.13, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.068, weight: '700', transform: 'none' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'Montserrat': {
      intro: { size: 0.038, weight: '600', transform: 'uppercase' },
      headline: { size: 0.115, weight: '800', transform: 'uppercase', lineHeight: 0.95 },
      offer: { size: 0.058, weight: '700', transform: 'uppercase' },
      legend: { size: 0.026, weight: '500', transform: 'none' }
    },
    'Oswald': {
      intro: { size: 0.042, weight: '400', transform: 'uppercase' },
      headline: { size: 0.145, weight: '600', transform: 'uppercase', lineHeight: 0.92 },
      offer: { size: 0.072, weight: '500', transform: 'uppercase' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'Bebas Neue': {
      intro: { size: 0.05, weight: '400', transform: 'uppercase' },
      headline: { size: 0.175, weight: '400', transform: 'uppercase', lineHeight: 0.85 },
      offer: { size: 0.085, weight: '400', transform: 'uppercase' },
      legend: { size: 0.032, weight: '400', transform: 'uppercase' }
    },
    'Poppins': {
      intro: { size: 0.038, weight: '500', transform: 'uppercase' },
      headline: { size: 0.11, weight: '700', transform: 'none', lineHeight: 1.05 },
      offer: { size: 0.058, weight: '600', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },
    'Roboto': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.12, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.062, weight: '700', transform: 'none' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'Space Grotesk': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.12, weight: '700', transform: 'none', lineHeight: 0.98 },
      offer: { size: 0.062, weight: '600', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },
    'DM Sans': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.02 },
      offer: { size: 0.06, weight: '600', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },
    'Archivo Black': {
      intro: { size: 0.04, weight: '400', transform: 'uppercase' },
      headline: { size: 0.135, weight: '400', transform: 'uppercase', lineHeight: 0.92 },
      offer: { size: 0.065, weight: '400', transform: 'uppercase' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'Anton': {
      intro: { size: 0.045, weight: '400', transform: 'uppercase' },
      headline: { size: 0.16, weight: '400', transform: 'uppercase', lineHeight: 0.88 },
      offer: { size: 0.075, weight: '400', transform: 'uppercase' },
      legend: { size: 0.03, weight: '400', transform: 'uppercase' }
    },
    'Barlow Condensed': {
      intro: { size: 0.045, weight: '500', transform: 'uppercase' },
      headline: { size: 0.155, weight: '700', transform: 'uppercase', lineHeight: 0.9 },
      offer: { size: 0.075, weight: '600', transform: 'uppercase' },
      legend: { size: 0.03, weight: '400', transform: 'none' }
    },
    'Open Sans': {
      intro: { size: 0.04, weight: '600', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.02 },
      offer: { size: 0.06, weight: '700', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },
    'Lato': {
      intro: { size: 0.04, weight: '700', transform: 'uppercase' },
      headline: { size: 0.12, weight: '900', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.062, weight: '700', transform: 'none' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },

    // Bold & Impactful
    'Teko': {
      intro: { size: 0.048, weight: '500', transform: 'uppercase' },
      headline: { size: 0.17, weight: '600', transform: 'uppercase', lineHeight: 0.85 },
      offer: { size: 0.08, weight: '500', transform: 'uppercase' },
      legend: { size: 0.032, weight: '400', transform: 'none' }
    },
    'Russo One': {
      intro: { size: 0.042, weight: '400', transform: 'uppercase' },
      headline: { size: 0.14, weight: '400', transform: 'uppercase', lineHeight: 0.92 },
      offer: { size: 0.07, weight: '400', transform: 'uppercase' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },

    // Modern & Clean
    'Outfit': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.12, weight: '700', transform: 'none', lineHeight: 0.98 },
      offer: { size: 0.06, weight: '600', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },
    'Sora': {
      intro: { size: 0.038, weight: '500', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.058, weight: '600', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },
    'Manrope': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.06, weight: '600', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },
    'Plus Jakarta Sans': {
      intro: { size: 0.038, weight: '500', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.058, weight: '600', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },

    // Warm & Friendly
    'Nunito': {
      intro: { size: 0.038, weight: '600', transform: 'uppercase' },
      headline: { size: 0.11, weight: '800', transform: 'none', lineHeight: 1.02 },
      offer: { size: 0.056, weight: '700', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },
    'Quicksand': {
      intro: { size: 0.038, weight: '600', transform: 'uppercase' },
      headline: { size: 0.11, weight: '700', transform: 'none', lineHeight: 1.05 },
      offer: { size: 0.056, weight: '600', transform: 'none' },
      legend: { size: 0.026, weight: '500', transform: 'none' }
    },
    'Rubik': {
      intro: { size: 0.038, weight: '500', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.058, weight: '600', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },
    'Comfortaa': {
      intro: { size: 0.036, weight: '500', transform: 'uppercase' },
      headline: { size: 0.105, weight: '700', transform: 'none', lineHeight: 1.05 },
      offer: { size: 0.054, weight: '600', transform: 'none' },
      legend: { size: 0.025, weight: '400', transform: 'none' }
    },
    'Varela Round': {
      intro: { size: 0.038, weight: '400', transform: 'uppercase' },
      headline: { size: 0.11, weight: '400', transform: 'none', lineHeight: 1.05 },
      offer: { size: 0.056, weight: '400', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },

    // Condensed & Efficient
    'Roboto Condensed': {
      intro: { size: 0.042, weight: '500', transform: 'uppercase' },
      headline: { size: 0.14, weight: '700', transform: 'uppercase', lineHeight: 0.92 },
      offer: { size: 0.07, weight: '600', transform: 'uppercase' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'PT Sans Narrow': {
      intro: { size: 0.042, weight: '400', transform: 'uppercase' },
      headline: { size: 0.14, weight: '700', transform: 'uppercase', lineHeight: 0.95 },
      offer: { size: 0.07, weight: '700', transform: 'uppercase' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'Fjalla One': {
      intro: { size: 0.044, weight: '400', transform: 'uppercase' },
      headline: { size: 0.15, weight: '400', transform: 'uppercase', lineHeight: 0.9 },
      offer: { size: 0.072, weight: '400', transform: 'uppercase' },
      legend: { size: 0.03, weight: '400', transform: 'none' }
    },
    'Saira Condensed': {
      intro: { size: 0.044, weight: '500', transform: 'uppercase' },
      headline: { size: 0.15, weight: '700', transform: 'uppercase', lineHeight: 0.9 },
      offer: { size: 0.072, weight: '600', transform: 'uppercase' },
      legend: { size: 0.03, weight: '400', transform: 'none' }
    },

    // Classic & Universal
    'Source Sans 3': {
      intro: { size: 0.04, weight: '600', transform: 'uppercase' },
      headline: { size: 0.12, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.06, weight: '600', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },
    'Noto Sans': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.06, weight: '600', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },
    'IBM Plex Sans': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.115, weight: '600', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.06, weight: '500', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },

    // Premium & Refined (Serif fonts)
    'Playfair Display': {
      intro: { size: 0.036, weight: '500', transform: 'uppercase' },
      headline: { size: 0.12, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.058, weight: '600', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },
    'Cormorant Garamond': {
      intro: { size: 0.038, weight: '500', transform: 'uppercase' },
      headline: { size: 0.13, weight: '600', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.062, weight: '500', transform: 'none' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'Libre Baskerville': {
      intro: { size: 0.034, weight: '400', transform: 'uppercase' },
      headline: { size: 0.105, weight: '700', transform: 'none', lineHeight: 1.05 },
      offer: { size: 0.052, weight: '700', transform: 'none' },
      legend: { size: 0.025, weight: '400', transform: 'none' }
    },
    'Crimson Text': {
      intro: { size: 0.036, weight: '600', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.02 },
      offer: { size: 0.056, weight: '600', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },
    'DM Serif Display': {
      intro: { size: 0.036, weight: '400', transform: 'uppercase' },
      headline: { size: 0.12, weight: '400', transform: 'none', lineHeight: 0.98 },
      offer: { size: 0.058, weight: '400', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },

    // Geometric & Structured
    'Raleway': {
      intro: { size: 0.038, weight: '500', transform: 'uppercase' },
      headline: { size: 0.115, weight: '700', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.058, weight: '600', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },
    'Josefin Sans': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.125, weight: '700', transform: 'none', lineHeight: 0.95 },
      offer: { size: 0.062, weight: '600', transform: 'none' },
      legend: { size: 0.028, weight: '400', transform: 'none' }
    },
    'Questrial': {
      intro: { size: 0.038, weight: '400', transform: 'uppercase' },
      headline: { size: 0.115, weight: '400', transform: 'none', lineHeight: 1.0 },
      offer: { size: 0.058, weight: '400', transform: 'none' },
      legend: { size: 0.026, weight: '400', transform: 'none' }
    },
    'Jost': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.12, weight: '700', transform: 'none', lineHeight: 0.98 },
      offer: { size: 0.06, weight: '600', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    },
    'Albert Sans': {
      intro: { size: 0.04, weight: '500', transform: 'uppercase' },
      headline: { size: 0.12, weight: '700', transform: 'none', lineHeight: 0.98 },
      offer: { size: 0.06, weight: '600', transform: 'none' },
      legend: { size: 0.027, weight: '400', transform: 'none' }
    }
  }
};
