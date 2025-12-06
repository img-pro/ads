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

1. **Design** - Configure typography, colors, and layout in the Builder tab
2. **Vary** - Create multiple copy variations manually or via AI generation
3. **Export** - Batch export all variations × sizes as a ZIP of PNGs

The tool targets performance marketers who need to produce many ad variations across multiple platforms (Reddit, Facebook, Instagram, etc.) with consistent visual identity.

## Project Structure

```
ads/
├── src/
│   ├── index.html    # Single-page app shell, all HTML
│   ├── app.js        # Application logic (~1500 lines)
│   ├── styles.css    # Full design system (~1500 lines)
│   └── config.js     # Default values + font presets
├── .prompts/         # Claude warm-up and task prompts
├── LICENSE
└── README.md
```

## YOUR WARM-UP JOB (NO CODE CHANGES YET)

### 1. Explore the Codebase

Use your tools to inspect the four source files. Understand:

**index.html:**
- The three-tab structure (Builder, Data, Export)
- Left panel (design controls), canvas area, right panel (content inputs)
- Modal for API key management
- Google Fonts loading strategy

**app.js:**
- Tab navigation system
- Canvas rendering pipeline (`generateAd()`, `renderPreview()`, `renderAdToDataUrl()`)
- Typography calculations: how `fitText()` auto-scales text to fit
- Data management: `dataRows[]` array, CRUD operations
- AI generation: Claude API integration for copy generation
- Export system: JSZip loading, batch PNG generation with DPI metadata

**styles.css:**
- Jet black design system (CSS custom properties)
- Surface hierarchy: `--bg-base`, `--bg-secondary`, `--bg-tertiary`, `--bg-elevated`
- Neomorphic styling: `--shadow-raised`, `--shadow-inset`
- Component patterns: panels, sections, buttons, sliders, data table

**config.js:**
- Default canvas size and colors
- Typography philosophy comment block
- Font presets: why each font has different size/weight/transform defaults

### 2. Build a Mental Model

**Typography Hierarchy (most important concept):**
The ad layout uses a four-voice system, each with distinct visual weight:
- **Intro** (Whisper) - Qualifier/hook, identifies the audience
- **Headline** (Shout) - Two-line emotional hook, 50% of visual weight
- **Offer** (Speak) - Clear CTA, what they get
- **Legend** (Murmur) - Trust signal, removes friction

All sizes are relative to canvas HEIGHT (not width) for responsive scaling. The `fontScale` slider scales everything proportionally.

**Rendering Pipeline:**
1. User changes inputs → `generateAd()` called
2. Read all UI values, calculate content height
3. Build elements array with computed font sizes
4. Render to display canvas (scaled by `dpr`) AND export canvas (1:1 logical pixels)
5. Update config code preview

**Data Flow:**
1. Builder tab defines the visual template (colors, typography, sizing)
2. Data tab stores copy variations in `dataRows[]` array
3. Export tab combines template + selected variations + selected sizes → ZIP

**Key Technical Decisions:**
- No external dependencies in core app (JSZip loaded dynamically on export)
- DPI metadata embedded in PNGs for correct Retina display
- Letter spacing rendered character-by-character (canvas API limitation)
- Optical Y offset shifts content slightly above true center (more visually balanced)

### 3. Summarize Your Understanding

When done exploring, provide:

**Architecture Overview:**
- How the single-file architecture works
- The relationship between Builder, Data, and Export tabs
- How the template system enables batch generation

**Key Entry Points:**
- Main render function and what triggers it
- Data table and variation card rendering
- AI generation flow
- Export pipeline

**Important State:**
- `dataRows[]` - array of copy variations
- `selectedExportSizes` - Set of selected size strings
- `activeVariationIndex` - currently previewed variation
- `CONFIG` and font presets

**Configuration Points:**
- `SIZE_PRESETS` - platform-specific size options
- `CONFIG.fontPresets` - per-font typography optimization
- localStorage: `anthropic_api_key`

### 4. Identify Risks and Questions

- Any areas that look fragile or could break under certain conditions?
- Inconsistencies between Builder preview and Export output?
- Missing error handling?
- Any TODOs or obvious improvements you notice?
- Questions about intended behavior that aren't clear from code?

## VERY IMPORTANT

- Do NOT propose or make any code changes yet
- Do NOT "quick-fix" anything
- First: explore and understand. Second: summarize and ask questions. Third: stop and wait for my next instruction.

Once you have a solid mental model and have summarized it back to me, stop and wait for further tasks.
