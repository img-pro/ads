# Ad Studio

A browser-based tool for creating text-on-solid-background advertisements. Design once, generate AI copy variations, export multiple sizes.

**[Live Demo](https://ads.img.pro)**

## Features

- **Visual Builder** — Real-time canvas preview with full typography controls, 42 Google Fonts, and platform-specific size presets
- **AI Copy Generation** — Generate emotional, high-converting ad copy using Claude (bring your own API key)
- **AI Style Generation** — Describe a visual style in plain English and let AI apply colors, effects, and typography
- **Template System** — Save, export, and import design templates to share across projects
- **Batch Export** — Export all variation × size combinations as a ZIP file
- **Per-Element Typography** — Override fonts and colors for individual text elements
- **Layer Effects** — AI-generated background, text, and foreground effects with opacity controls
- **CSV Import/Export** — Bulk manage copy variations via spreadsheet
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

**Canvas Setup**
- Choose a platform preset (Reddit, Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Display Ads)
- Or set custom dimensions

**Style with AI**
- Describe your desired visual style (e.g., "Dark moody neon", "Clean minimal white", "Bold red and black")
- Click Apply to generate colors, typography, and effects
- Adjust layer opacities to fine-tune the AI effects

**Typography**
- Choose from 42 fonts organized by mood (Bold, Modern, Warm, Condensed, Classic, Premium, Geometric)
- Global settings cascade to all elements
- Override individual elements with per-element font and color controls

**Text Hierarchy**
- **Intro** (Whisper) — Short qualifier (e.g., "For Developers")
- **Headline** (Shout) — Two-line emotional hook
- **Offer** (Speak) — Clear CTA
- **Legend** (Murmur) — Trust signal / fine print

**Templates**
- Click [+] in the thumbnail strip to save your current design
- Export templates as JSON to share
- Import templates from files

### 2. Generate Variations (Data Tab)

**Setup**
- Enter your Anthropic API key (stored locally, only sent to Anthropic)
- Customize the system prompt if needed

**Generate**
- Describe your product, target audience, and key benefits
- Select language and number of variations (5-20)
- Click Generate Copy

**Manage**
- Edit variations inline in the spreadsheet
- Export/import as CSV for bulk editing
- Select which variations to include in export

### 3. Export (Export Tab)

- Select variations to export (checkboxes)
- Choose target sizes for the platform
- Preview any variation with arrow key navigation
- Download as ZIP with all combinations

## AI Features

### Copy Generation

The AI generates copy using proven emotional advertising principles:

- Emotional hooks over feature lists
- Identity-based qualifiers ("For Creators", "Finally")
- Clear value propositions
- Trust signals that remove friction

The system prompt is fully customizable.

### Style Generation

Describe a visual style and the AI will:

- Set background and text colors with WCAG-compliant contrast
- Choose appropriate fonts from the library
- Apply layered effects (gradients, vignettes, shadows, borders)
- Configure typography sizing and transforms

## Effect Library

AI selects from a curated library of pre-tested effects:

**Background Effects**
- Gradients (subtle, radial, diagonal)
- Vignettes (standard, light)
- Glows (center, spotlight)
- Duotones (warm, cool)
- Noise texture

**Text Effects**
- Shadows (soft, medium, hard, dramatic)
- Glows (soft, medium, strong)
- Outlines (thin, medium)

**Foreground Effects**
- Borders (thin, medium, bold)
- Corner brackets
- Bottom line accent
- Gradient fade

## Platform Presets

| Platform | Sizes |
|----------|-------|
| Reddit | 1200×628, 1080×1080, 1200×675, 1440×1080 |
| Facebook | 1200×628, 1080×1080, 1080×1350, 1080×1920 |
| Instagram | 1080×1080, 1080×1350, 1080×1920, 1200×628 |
| LinkedIn | 1200×627, 1080×1080, 1080×1350 |
| X/Twitter | 1200×628, 1080×1080, 1600×900 |
| TikTok | 1080×1920, 1080×1080 |
| YouTube | 1920×1080, 1080×1920, 1280×720 |
| Display | 300×250, 336×280, 728×90, 300×600, 160×600, 320×100 |

## Self-Hosting

### Cloudflare Pages (Recommended)

1. Fork this repository
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create project → Connect to Git
3. Configure:
   - **Build command**: `bash deploy.sh` (for cache busting) or leave empty
   - **Build output directory**: `src`
4. Deploy

### Other Platforms

The `src` folder is a static site. Deploy to any static host:

- **Netlify**: Set publish directory to `src`
- **Vercel**: Set output directory to `src`
- **GitHub Pages**: Serve from `src` folder

## Project Structure

```
ads/
├── src/
│   ├── index.html      # Main application (single-page app)
│   ├── app.js          # Application logic (~3200 lines)
│   ├── config.js       # Effect library, font moods, defaults
│   ├── styles.css      # Jet black interface theme
│   ├── icon/           # Favicons and app icons
│   ├── _headers        # Cloudflare security headers
│   └── _redirects      # Cloudflare routing
├── deploy.sh           # Cache-busting build script
├── LICENSE             # MIT
└── README.md
```

## Technical Details

- Pure vanilla JavaScript (no frameworks, no build step)
- Canvas API for rendering
- CSS custom properties for theming
- LocalStorage for persistence
- Direct API calls to Anthropic (no proxy)
- JSZip for batch exports

## Browser Support

Modern browsers with Canvas API:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+

## Privacy

- **No tracking** — No analytics, no cookies
- **No backend** — All processing happens in your browser
- **Local storage only** — Your designs, data, and API key stay on your device
- **Direct API calls** — AI requests go directly from your browser to Anthropic

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE) — Copyright (c) 2025 img.pro
