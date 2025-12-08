# Ad Studio - Warm Up

Hi Claude,

You are my senior engineer and pair programmer.

Before making ANY changes, I want you to fully understand the Ad Studio codebase and explain it back to me. We will treat this as a warm-up / context phase.

## Project Location

```
/Users/cristian/GitHub/img-pro/ads
```

This is a single-repo, zero-build browser application. No npm, no bundler - just open `src/index.html` in a browser.

## High-Level Intent

Ad Studio is a browser-based ad generator for creating text-on-solid-background advertisements. The core workflow is:

1. **Design** - Configure typography, colors, layout, and AI-generated visual effects in the Builder tab
2. **Vary** - Create multiple copy variations manually or via AI generation
3. **Export** - Batch export all variations × sizes as a ZIP of PNGs

The tool targets performance marketers who need to produce many ad variations across multiple platforms (Reddit, Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Display Ads) with consistent visual identity.

## Project Structure

```
ads/
├── src/
│   ├── index.html    # Single-page app shell, all HTML
│   ├── app.js        # Application logic (~3200 lines)
│   ├── config.js     # Effect library, font moods, contrast utilities, defaults (~700 lines)
│   ├── styles.css    # Full design system (~950 lines)
│   ├── icon/         # Favicons and app icons
│   ├── _headers      # Cloudflare security headers
│   └── _redirects    # Cloudflare routing
├── .prompts/         # Claude warm-up and task prompts
├── deploy.sh         # Cache-busting build script
├── LICENSE
└── README.md
```

## YOUR WARM-UP JOB (NO CODE CHANGES YET)

### 1. Explore the Codebase

Use your tools to inspect the source files. Understand:

**index.html:**
- The three-tab structure (Builder, Data, Export)
- Left panel (design controls), canvas area with template strip, right panel (content inputs)
- Right panel sections: Layout, Typography, Colors, Template
- Modal for API key management
- Google Fonts loading strategy (42 fonts in 7 mood categories)

**app.js:**
- Tab navigation and keyboard navigation (arrow keys on Export tab)
- Canvas rendering pipeline (`generateAd()`, `renderAdToCanvas()`, `renderPreview()`)
- Typography calculations: how `fitText()` auto-scales text to fit
- Per-element typography overrides (font, color per element)
- Data management: `dataRows[]` array, CRUD operations, CSV import/export
- AI copy generation: Claude API integration with customizable system prompt
- AI style generation: `generateCanvasStyle()` for colors, effects, typography
- Effect system: `canvasDecorations[]` array, `executeCanvasCommands()`, layer opacities
- Template system: `savedVersions[]`, save/import/export/delete, thumbnail generation
- Export system: JSZip loading, batch PNG generation with DPI metadata
- State persistence: `saveAppState()`, `loadAppState()`, `saveAppStateDebounced()`

**config.js:**
- `EFFECT_LIBRARY` - Pre-tested visual effects organized by layer (background, text, foreground)
- `FONT_MOODS` - 42 fonts categorized by personality (bold, modern, warm, condensed, classic, premium, geometric)
- Contrast utilities: `getContrastRatio()`, `ensureContrast()` for WCAG compliance
- `CONFIG` object with defaults and `fontPresets` for per-font optimization

**styles.css:**
- Jet black design system (CSS custom properties)
- Surface hierarchy: `--bg-base`, `--bg-secondary`, `--bg-tertiary`, `--bg-elevated`
- Neomorphic styling: `--shadow-raised`, `--shadow-inset`, `--shadow-button`
- Component patterns: panels, sections, collapsible cards, buttons, sliders, data table
- Template thumbnail strip with save button

### 2. Build a Mental Model

**Typography Hierarchy (most important concept):**
The ad layout uses a four-voice system, each with distinct visual weight:
- **Intro** (Whisper) - Qualifier/hook, identifies the audience
- **Headline** (Shout) - Two-line emotional hook, 50% of visual weight
- **Offer** (Speak) - Clear CTA, what they get
- **Legend** (Murmur) - Trust signal, removes friction

All sizes are relative to canvas HEIGHT (not width) for responsive scaling. The `fontScale` slider scales everything proportionally.

**Per-Element Overrides:**
Each text element can override global settings:
- Font family (inherit or specific font)
- Color (inherit or hex/rgba)
These allow for mixed typography within a single design.

**Layer System:**
AI-generated visual effects are organized into three layers:
- **Background** - Gradients, vignettes, glows, duotones, noise (rendered first)
- **Text** - Shadows, glows, outlines (applied to text elements)
- **Foreground** - Borders, corners, accents (rendered last)
Each layer has an opacity slider. Opacity 0 disables the layer.

**Rendering Pipeline:**
1. User changes inputs → `generateAd()` called
2. Read all UI values, load required fonts
3. Call `renderAdToCanvas()` which:
   - Fills background color
   - Executes background layer effects
   - Calculates content height and positions
   - Applies text layer effects (shadows/glows)
   - Draws text elements with per-element colors
   - Executes foreground layer effects
4. Render to display canvas (scaled by `dpr`) AND export canvas (1:1 logical pixels)
5. Update config code preview

**Data Flow:**
1. Builder tab defines the visual template (colors, typography, sizing, effects)
2. Data tab stores copy variations in `dataRows[]` array
3. Export tab combines template + selected variations + selected sizes → ZIP

**Template System:**
- Templates capture the full visual state (colors, typography, effects, layer opacities)
- Saved to `savedVersions[]` with auto-generated thumbnails
- Displayed in thumbnail strip at bottom of canvas
- Can be exported as JSON and imported on other machines
- `activeVersionIndex` tracks which template is selected

**Key Technical Decisions:**
- No external dependencies in core app (JSZip loaded dynamically on export)
- DPI metadata embedded in PNGs for correct Retina display
- Letter spacing rendered character-by-character (canvas API limitation)
- Optical Y offset shifts content slightly above true center (more visually balanced)
- Effects use pre-tested library (AI selects by name, not arbitrary code)
- State persisted to localStorage with debounced saves

### 3. Summarize Your Understanding

When done exploring, provide:

**Architecture Overview:**
- How the single-file architecture works
- The relationship between Builder, Data, and Export tabs
- How the template and layer systems enable visual variety
- How the effect library ensures reliable AI styling

**Key Entry Points:**
- `generateAd()` - main render function
- `generateCanvasStyle()` - AI style generation
- `generateCopy()` - AI copy generation
- `renderDataTable()` and `renderVariationCards()` - data display
- `exportAllAds()` - batch export pipeline
- `saveCurrentVersion()`, `applyVersion()` - template management

**Important State:**
- `dataRows[]` - array of copy variations
- `savedVersions[]` - array of saved templates
- `canvasDecorations[]` - AI-generated effect commands
- `selectedExportSizes` - Set of selected size strings
- `activeVariationIndex` - currently previewed variation
- `activeVersionIndex` - currently selected template
- `CONFIG`, `EFFECT_LIBRARY`, `FONT_MOODS`

**Configuration Points:**
- `SIZE_PRESETS` - platform-specific size options
- `CONFIG.fontPresets` - per-font typography optimization
- `EFFECT_LIBRARY` - pre-tested visual effects
- `FONT_MOODS` - font personality categories
- `DEFAULT_SYSTEM_PROMPT` - AI copy generation prompt
- localStorage: `anthropic_api_key`, `ad_studio_state`, `ad_studio_versions`

### 4. Identify Risks and Questions

- Any areas that look fragile or could break under certain conditions?
- Inconsistencies between Builder preview and Export output?
- Missing error handling?
- Race conditions in async operations?
- Any TODOs or obvious improvements you notice?
- Questions about intended behavior that aren't clear from code?

## VERY IMPORTANT

- Do NOT propose or make any code changes yet
- Do NOT "quick-fix" anything
- First: explore and understand. Second: summarize and ask questions. Third: stop and wait for my next instruction.

Once you have a solid mental model and have summarized it back to me, stop and wait for further tasks.
