---
name: Luminous Wealth
colors:
  surface: '#131029'
  surface-dim: '#131029'
  surface-bright: '#393651'
  surface-container-lowest: '#0e0a24'
  surface-container-low: '#1b1832'
  surface-container: '#1f1c36'
  surface-container-high: '#2a2741'
  surface-container-highest: '#35314c'
  on-surface: '#e5deff'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e5deff'
  inverse-on-surface: '#302d48'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#007181'
  on-tertiary-container: '#aef0ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#131029'
  on-background: '#e5deff'
  surface-variant: '#35314c'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  numeral-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  numeral-body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses ultra-premium wealth management through an ethereal, high-fidelity dark glass aesthetic. It merges the institutional rigor of private wealth advisory with the luminous atmosphere of next-generation digital assets.

### Personality & Tone
- **Atmospheric & Sovereign:** Deep ink backdrops layered with celestial ambient light nodes establish prestige and focus.
- **Precision Engineered:** High-density data readouts, crisp typography, and disciplined alignment reflect institutional certainty.
- **Tactile Vibrance:** Dynamic gradients, frosted surfaces, and prismatic boundary borders impart tangible value and forward momentum.

### Visual Architecture
The system blends refined glassmorphism with controlled ambient luminosity. Structural cards float across variable spatial depths using frosted glass backdrops, subtle iridescent border gradients, and atmospheric glow fields that respond dynamically to asset growth and market movement.

## Colors

The palette leverages an obsidian-level ink-indigo base overlaid with energetic chromatic gradients, precise semantic status signals, and distinct asset-class designations.

### Palette Architecture
- **Canvas Base:** Deep ink-indigo (`#0A0720`) serves as the foundational backdrop, absorbing low-contrast reflections and sustaining extreme luminous contrast.
- **Primary & Secondary Engines:** Violet (`#7C3AED`) and Electric Blue (`#3B82F6`) fuel principal actions, primary interactive elements, and focal lighting.
- **Atmospheric Highlights:** Magenta (`#EC4899`) and Cyan (`#22D3EE`) function as high-energy specular accents and gradient endpoints.
- **Semantics:**
  - **Gain / Surge:** Glowing Emerald (`#34D399`) with a contextual luminous aura for positive deltas.
  - **Loss / Risk:** Vibrant Coral (`#FB7185`) for deficits, drops, and liquidation warnings.
- **Asset Class Tokens:**
  - **Equities (Stocks):** Electric Blue (`#3B82F6`)
  - **Fixed Income (Bonds):** Amber (`#FBBF24`)
  - **REITs:** Magenta (`#EC4899`)
  - **InvITs / Infrastructure:** Cyan (`#22D3EE`)
  - **Liquidity & Cash:** Slate (`#94A3B8`)
  - **Commodities (Gold & SGB):** Deep Gold (`#F59E0B`)

### Surface Luminance Guidelines
Background surfaces never use pure greys. All neutral card surfaces inherit tint values from white alpha steps (`rgba(255, 255, 255, 0.03)` to `rgba(255, 255, 255, 0.07)`) suspended over the base `#0A0720`, maintaining color harmony across differing display calibrations.

## Typography

The typographical hierarchy pairs the structural elegance of **Plus Jakarta Sans** with the dense, tabular readability of **Inter**.

### Type Roles
- **Headings & Key Metrics:** Plus Jakarta Sans delivers commanding hierarchy across wealth totals, portfolio titles, and major card headlines. Its generous aperture balances technical confidence with high-end luxury.
- **Financial Metrics & Numerals:** Hero valuations apply Plus Jakarta Sans with negative letter spacing and gradient fill overlays (`linear-gradient(135deg, #FFFFFF 30%, #93C5FD 100%)`). Standard data tables switch to Inter with `tabular-nums` enforced to guarantee absolute vertical digit alignment across real-time price updates.
- **Interface Copy & Meta Labels:** Inter provides micro-legibility at 11px to 14px sizes across dense data layouts, allocations, fee breakdowns, and compliance disclosures.

## Layout & Spacing

Layouts follow an adaptable 12-column responsive grid underpinned by an 8pt spatial baseline. 

### Grid Configuration
- **Desktop (>= 1280px):** 12-column fluid grid, max container width 1440px, 40px outer margins, 24px column gutters.
- **Tablet (768px – 1279px):** 8-column layout, 24px outer margins, 16px column gutters. Multi-tier asset modules collapse to dual columns.
- **Mobile (< 768px):** 4-column single-stack structure, 20px outer margins, 16px column gutters. Key balance readouts pin to the upper screen zone while transactional lists adopt edge-to-edge card stacks.

### Content Spacing
Component interiors use standard rhythm tiers:
- Compact data rows and inline metrics scale via `space-xs` (4px) and `space-sm` (8px).
- Standard card interiors and control groupings utilize `space-md` (16px) and `space-lg` (24px).
- Structural section separations and hero portfolio card envelopes span `space-xl` (40px).

## Elevation & Depth

Visual hierarchy does not rely on opaque grey tiers. Instead, depth is constructed via **translucent glass refraction, multi-layered ambient light diffusion, and hairline specular borders**.

### Spatial Surface Tiers
- **Canvas Plane (Level 0):** Pure `#0A0720` ink-indigo. Soft radial meshes of Violet (`#7C3AED`), Cyan (`#22D3EE`), and Magenta (`#EC4899`) with 80px–140px blur are pinned at screen quadrants at 12–18% opacity to simulate cosmic underglow.
- **Frosted Containers (Level 1 - Baseline Cards):**
  - Surface: `rgba(255, 255, 255, 0.03)` backdrop filtered with `backdrop-filter: blur(24px) saturate(160%)`.
  - Border: 1px continuous hairline running `linear-gradient(135deg, rgba(124, 58, 237, 0.30) 0%, rgba(34, 211, 238, 0.20) 100%)`.
  - Shadow: Multi-layer depth shadow: `0 8px 32px -4px rgba(0, 0, 0, 0.45), 0 0 1px 1px rgba(255, 255, 255, 0.05) inset`.
- **Raised Focus (Level 2 - Hovered / Active Cards, Modals):**
  - Surface: `rgba(255, 255, 255, 0.06)` backdrop filtered with `backdrop-filter: blur(36px) saturate(180%)`.
  - Border: 1px gradient running `linear-gradient(135deg, rgba(124, 58, 237, 0.50) 0%, rgba(59, 130, 246, 0.40) 50%, rgba(34, 211, 238, 0.40) 100%)`.
  - Shadow: `0 20px 48px -8px rgba(10, 7, 32, 0.8), 0 0 24px -2px rgba(124, 58, 237, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)`.
- **Overlay Flight (Level 3 - Drawers, Toast Alerts, Dropdowns):**
  - Surface: `rgba(15, 10, 42, 0.82)` with heavy blur (`backdrop-filter: blur(40px)`).
  - Shadow: Heavy occluding floor: `0 32px 64px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)`.

## Shapes

The interface balances soft ergonomics with technical structure. The default base radius is 8px (`0.5rem`), transitioning systematically to expansive radii on high-surface-area panels.

### Radius Scale
- **Micro Elements (Badges, Checkboxes, Toggles):** `8px` (`0.5rem`).
- **Input Fields & Small Buttons:** `12px` (`0.75rem`).
- **Standard Action Triggers & Dropdowns:** `14px` (`0.875rem`).
- **Cards, Panels & Data Containers:** `24px` (`1.5rem` / `rounded-3xl`) to create smooth silhouettes against the dark atmospheric mesh.
- **Pills & Status Rings:** Fully rounded `9999px` for ticker tags, asset allocation pills, and pulse indicators.

## Components

### Buttons
- **Primary Action Button:**
  - Base: High-contrast horizontal gradient `linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)`.
  - Typography: 14px Plus Jakarta Sans, SemiBold, pure white text.
  - Border: None. Specular inner highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.25)`.
  - Elevation & Glow: `box-shadow: 0 4px 20px -2px rgba(124, 58, 237, 0.45)`.
  - Hover: Subtle scale transition (`scale-[1.02]`) and intensified violet-blue radiance.
- **Secondary (Glass) Button:**
  - Base: `rgba(255, 255, 255, 0.04)` with `backdrop-filter: blur(12px)`.
  - Border: 1px solid `rgba(255, 255, 255, 0.12)`.
  - Hover: Background shifts to `rgba(255, 255, 255, 0.08)`, border illuminates to `rgba(34, 211, 238, 0.35)`, subtle top edge gloss shine.

### Wealth Stat Cards & Surfaces
- Structural foundation: 24px border radius (`rounded-3xl`), outer frosted glass (`rgba(255, 255, 255, 0.03)` to `0.06`), inner soft glow.
- Border: Continuous 1px dual gradient (`#7C3AED` 30% to `#22D3EE` 30%).
- Integrated Sparkline: Canvas-rendered inline vector graphs using `#34D399` (gain) or `#FB7185` (loss), featuring an underlying vertical gradient fade into total opacity (`stop-opacity: 0`).
- Value Presentation: Hero financial figures use Plus Jakarta Sans Bold with an ethereal chromatic gradient fill, supported by an immediate gain/loss pill.

### Chips & Allocation Pills
- Construction: Height 24px–28px, full pill curve (`rounded-full`), `rgba(255, 255, 255, 0.04)` fill.
- Asset Tags: Prefixed with an illuminated 6px dot carrying the specific asset class token (e.g., Gold `#F59E0B`, REITS `#EC4899`) backed by a matching 4px blur halo.
- Selected State: Outlined with the asset's dedicated color and tinted with 12% asset color wash.

### Form Inputs & Selectors
- Container: 48px height, 12px corner radius, background `rgba(255, 255, 255, 0.03)`.
- Resting: Hairline border in `rgba(255, 255, 255, 0.1)`. Placeholder text in muted slate (`#64748B`).
- Focused State: Border shifts to solid Cyan/Blue gradient (`linear-gradient(90deg, #3B82F6, #22D3EE)`), backed by a faint 8px diffuse cyan glow (`box-shadow: 0 0 12px rgba(34, 211, 238, 0.2)`).

### Selection Controls (Checkboxes & Radios)
- Dimension: 18px x 18px box, 6px radius for checkboxes, circular for radios.
- Unchecked: `rgba(255, 255, 255, 0.06)` base with `rgba(255, 255, 255, 0.2)` stroke.
- Checked: Vivid fill (`linear-gradient(135deg, #7C3AED, #3B82F6)`), crisp white checkmark glyph, outer glow `0 0 8px rgba(124, 58, 237, 0.5)`.

### Dynamic Status Indicators
- Ethereal Pulse: A 8px circular signal accompanied by an animating outer concentric ripple (`ping` at 2s cycle), executing in glowing emerald (`#34D399`) for operational exchange feeds and live trade execution channels.