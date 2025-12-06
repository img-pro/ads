// ==========================================
// AD STUDIO - Configuration
// ==========================================

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
    fontFamily: 'Helvetica',
    letterSpacing: 0,
    opticalYOffset: 0.055
  },

  elements: {
    intro: {
      text: 'Bandwidth Saver',
      size: 0.06,
      weight: '500',
      transform: 'uppercase',
      marginTop: 0
    },
    headline: {
      text: ['Stop Overpaying', 'for Bandwidth'],
      size: 0.16,
      weight: '700',
      transform: 'uppercase',
      marginTop: 0.02,
      lineHeight: 1.05
    },
    offer: {
      text: 'Free: 100GB /mo',
      size: 0.11,
      weight: '800',
      transform: 'uppercase',
      marginTop: 0.15
    },
    legend: {
      text: 'Cloudflare speed without touching DNS',
      size: 0.035,
      weight: '400',
      transform: 'none',
      marginTop: 0.06
    }
  },

  // Optional: per-font presets for element styling
  // When a font is selected, these settings auto-apply (if defined)
  fontPresets: {
    'Helvetica': {
      intro: { size: 0.06, weight: '500', transform: 'uppercase' },
      headline: { size: 0.16, weight: '700', transform: 'uppercase', lineHeight: 1.05 },
      offer: { size: 0.11, weight: '800', transform: 'uppercase' },
      legend: { size: 0.035, weight: '400', transform: 'none' }
    }
  }
};
