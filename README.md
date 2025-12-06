# Ad Studio

A browser-based tool for creating text-on-solid-background advertisements. Design once, generate AI copy variations, export multiple sizes.

**[Live Demo](https://ads.img.pro)** · **[Report Bug](https://github.com/img-pro/ads/issues)**

## Features

- **Visual Builder** — Real-time preview with typography controls, colors, and platform-specific size presets
- **AI Copy Generation** — Generate emotional, high-converting copy variations using Claude (bring your own API key)
- **Batch Export** — Export all variations × sizes as a ZIP file
- **Local Storage** — Your work persists across sessions
- **No Backend** — Everything runs in your browser

## Getting Started

### Use Online

Visit [ads.img.pro](https://ads.img.pro) — no installation required.

### Run Locally

```bash
git clone https://github.com/img-pro/ads.git
cd ads
# Open src/index.html in your browser, or:
npx serve src
```

## Usage

### 1. Design (Builder Tab)

- Choose a platform preset (Reddit, Facebook, Instagram, etc.) or set custom dimensions
- Pick colors and fonts
- Write your ad copy with the 4-part hierarchy:
  - **Intro** — Short qualifier (e.g., "For Developers")
  - **Headline** — Two-line emotional hook
  - **Offer** — Clear CTA
  - **Legend** — Trust signal / fine print

### 2. Generate Variations (Data Tab)

- Enter your Anthropic API key (stored locally, never sent to any server except Anthropic)
- Describe your product, audience, and key benefits
- Generate 5-20 copy variations with one click
- Edit variations inline in the spreadsheet view

### 3. Export (Export Tab)

- Select which variations to export
- Choose target sizes for each platform
- Download as ZIP with all combinations

## AI Copy Generation

The AI generates copy using proven emotional advertising principles:

- Emotional hooks over feature lists
- Identity-based qualifiers
- Clear value propositions
- Trust signals that remove friction

You need an [Anthropic API key](https://console.anthropic.com/) to use this feature. Your key is stored in your browser's localStorage and is only sent directly to Anthropic's API.

## Self-Hosting

### Cloudflare Pages

1. Fork this repository
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create project → Connect to Git
3. Configure:
   - **Build command**: _(leave empty)_
   - **Build output directory**: `src`
4. Deploy

### Other Platforms

The `src` folder is a static site. Deploy to any static host:

- **Netlify**: Set publish directory to `src`
- **Vercel**: Set output directory to `src`
- **GitHub Pages**: Serve from `src` folder

## Project Structure

```
├── src/
│   ├── index.html      # Main application
│   ├── app.js          # Application logic
│   ├── config.js       # Default settings & font presets
│   ├── styles.css      # Styles
│   ├── favicon.svg     # Favicon
│   ├── _headers        # Cloudflare security headers
│   └── _redirects      # Cloudflare routing
├── LICENSE
└── README.md
```

## Browser Support

Modern browsers with Canvas API:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+

## Privacy

- **No tracking** — No analytics, no cookies
- **No backend** — All processing happens in your browser
- **Local storage only** — Your designs and API key stay on your device
- **Direct API calls** — AI requests go directly from your browser to Anthropic

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)
