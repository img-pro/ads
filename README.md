# Ad Studio

A browser-based ad generator for creating text-on-solid-background advertisements. Design once, export multiple sizes and copy variations.

## Features

- **Visual Builder** - Real-time preview with typography controls, colors, and size presets
- **Smart Typography** - Font-specific presets with optimized settings for 19 fonts
- **Responsive Sizing** - Auto-fitting text with optical center positioning
- **High-DPI Export** - Pixel-perfect PNGs with embedded DPI metadata
- **Data Tab** - Manage multiple copy variations in a spreadsheet-like interface
- **AI Generation** - Generate copy variations using Claude API (requires your own API key)
- **Batch Export** - Export all variations × sizes as a ZIP file

## Quick Start

1. Open `src/index.html` in a browser
2. Design your ad in the Builder tab
3. Switch to Data tab to create variations
4. Export individual PNGs or batch export as ZIP

## Project Structure

```
ads/
├── src/
│   ├── index.html     # Main application
│   ├── app.js         # Application logic
│   ├── styles.css     # Styles
│   └── defaults.json  # Default settings & font presets
├── LICENSE            # MIT License
└── README.md
```

## Typography System

The ad layout uses a structured hierarchy:

- **Intro** - Short qualifier/hook (e.g., "WordPress User?")
- **Headline** - Two-line primary message
- **Offer** - CTA or value proposition
- **Legend** - Fine print/supporting text

All sizes are relative to canvas height for responsive scaling across different ad formats.

## Font Presets

Each font has optimized defaults for:
- Weight and style
- Letter spacing (tracking)
- Size ratios for each text element
- Text transforms (uppercase, etc.)

Fonts are categorized as:
- **Display/Impact** - Bebas Neue, Anton, Archivo Black, Oswald, Barlow Condensed
- **Modern Sans** - Inter, Montserrat, Poppins, Space Grotesk, DM Sans, Raleway
- **Classic Sans** - Roboto, Open Sans, Lato
- **Serif** - Playfair Display
- **System** - Helvetica, Impact, Arial Black, Arial

## AI Generation

To use AI-powered copy generation:

1. Click "Set API Key" in the Data tab toolbar
2. Enter your Anthropic API key (stored locally in browser)
3. Write a prompt describing your product/audience
4. Click "Generate" to create variations

Your API key is stored in localStorage and never sent to any server except Anthropic's API directly.

## Export Options

### Single Export (Builder tab)
- Exports current canvas as PNG
- Includes DPI metadata for correct display size on Retina screens

### Batch Export (Data tab)
- Select variations with checkboxes
- Choose target sizes
- Downloads ZIP with all combinations
- Naming: `01-1200x628.png`, `02-1200x628.png`, etc.

## Browser Support

Modern browsers with Canvas API support:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+

## License

MIT License - see [LICENSE](LICENSE) file.
