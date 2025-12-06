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
    }
  }
};
