---
name: Aether Wealth
colors:
  surface: '#0d1322'
  surface-dim: '#0d1322'
  surface-bright: '#33394a'
  surface-container-lowest: '#080e1d'
  surface-container-low: '#151b2b'
  surface-container: '#191f2f'
  surface-container-high: '#242a3a'
  surface-container-highest: '#2f3445'
  on-surface: '#dde2f8'
  on-surface-variant: '#c9c4d8'
  inverse-surface: '#dde2f8'
  inverse-on-surface: '#2a3040'
  outline: '#938ea1'
  outline-variant: '#484555'
  surface-tint: '#cabeff'
  primary: '#cabeff'
  on-primary: '#31009a'
  primary-container: '#947dff'
  on-primary-container: '#2a0088'
  inverse-primary: '#603ce2'
  secondary: '#47ffb8'
  on-secondary: '#003824'
  secondary-container: '#00e29d'
  on-secondary-container: '#005f40'
  tertiary: '#ffb2ba'
  on-tertiary: '#670020'
  tertiary-container: '#f85775'
  on-tertiary-container: '#5a001b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cabeff'
  on-primary-fixed: '#1c0062'
  on-primary-fixed-variant: '#4816cb'
  secondary-fixed: '#47ffb8'
  secondary-fixed-dim: '#00e29d'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#ffb2ba'
  on-tertiary-fixed: '#400011'
  on-tertiary-fixed-variant: '#910030'
  background: '#0d1322'
  on-background: '#dde2f8'
  surface-variant: '#2f3445'
typography:
  display-currency:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-currency-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
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
    lineHeight: 16px
    letterSpacing: 0.01em
  metric-tabular:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-uppercase:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  badge-label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-precision, institutional-grade atmosphere tailored for high-net-worth investors and active retail participants in the Indian financial markets. The experience balances financial gravitas with contemporary digital craft, delivering instant clarity across aggregated brokerage positions (Zerodha, Groww, AngelOne, Upstox).

### Visual Direction
- **Style Archetype:** Dark Glassmorphism coupled with High-Contrast Precision Data Visuals.
- **Aesthetic Pillars:** Optical depth achieved through deep navy layering, razor-thin translucent borders (`rgba(255, 255, 255, 0.08)`), subtle luminescent halos behind major figures, and strict geometric precision.
- **Tone & Mood:** Confident, sovereign, calculated, and real-time responsive. It replaces cluttered financial interfaces with spatial tranquility and hyper-legible quantitative density.

## Colors

The palette relies on a luminance hierarchy built on cold, light-absorbent midnight backdrops that allow active chromatic accents to emit light-like data signals.

### Color Tiers & Semantic Mapping
- **Canvas & Backgrounds:**
  - `Base Canvas`: `#070B14` (Midnight Navy — the root viewport level).
  - `Layer Canvas`: `#0B1120` (Sub-canvas and structural module containers).
  - `Surface Glass`: `#111B2E` at 70% opacity with backdrop-filter blur (cards, dialogs, drawers).
  - `Border Stroke`: `rgba(255, 255, 255, 0.08)` for default divisions; `rgba(124, 92, 255, 0.3)` for focused/active states.
- **Brand & Action Signals:**
  - `Primary Action`: `#7C5CFF` (Electric Violet — used for core primary actions, selected tabs, synced broker states, and interactive focal points).
- **Market & Financial Telemetry:**
  - `Positive / Gain`: `#10E5A0` (Emerald Green — intraday gains, all-time positive P&L, bull trends).
  - `Negative / Loss`: `#FF5C7A` (Coral Pink — intraday drops, negative balance deltas, bear trends).
  - `Asset: Mutual Funds & SIPs`: `#00D2FF` (Cyan).
  - `Asset: Commodities & Gold`: `#F59E0B` (Amber).
  - `Asset: Equities`: `#7C5CFF` (Electric Violet).
- **Text & Quantitative Contrast:**
  - `Primary Readout`: `#FFFFFF` (Values, monetary rollups, primary titles).
  - `Secondary Text`: `#94A3B8` (Soft Slate — table headers, metadata, broker sync timestamps).
  - `Tertiary / Disabled`: `#475569` (Inactive icons, structural rules).

## Typography

The type architecture relies entirely on `Inter` to provide structural unity. Strict numerical vertical alignment is critical for continuous price refreshes:

- **Tabular Figures Feature:** All currency levels (`₹`), ticker movements, percentage changes, and order quantities must use `font-variant-numeric: tabular-nums lining-nums`. This prevents micro-jitter when real-time WebSocket feeds update.
- **Indian Rupee Standard:** The ₹ symbol matches the font-weight of the following numerical string but renders with an opacity of 0.85 to maintain proportional emphasis on the numerical volume.
- **Label Letter Spacing:** All small descriptive labels, ticker codes (e.g., `NSE:RELIANCE`, `BSE:TCS`), and column titles take `label-uppercase` with extended letter-spacing (`0.08em`) to guarantee quick peripheral scanning.

## Layout & Spacing

The layout model implements a structured 12-column responsive fluid grid with strict containment boundaries to prevent high-density dashboards from causing cognitive fatigue.

### Grid & Breakpoints
- **Desktop (≥ 1280px):** 12 columns, 24px (`1.5rem`) gutters, 32px (`2rem`) margins. Max container constraint: 1440px centered.
- **Tablet (768px – 1279px):** 8 columns, 16px (`1rem`) gutters, 24px (`1.5rem`) margins. Secondary market widgets drop beneath primary P&L streams.
- **Mobile (< 768px):** 4 columns, 12px (`0.75rem`) gutters, 16px (`1rem`) margins. Multi-broker aggregate balances stack into swipeable horizontal cards.

### Spacing Rhythm
- **Micro-Gaps (`space-xs`, `space-sm`):** Reserved for icon-to-metric pairings, percentage delta badges, and live ticker pulses.
- **Component Packing (`space-md`, `space-lg`):** Internal padding for glass cards, form modules, and table row partitions.
- **Section Offsets (`space-xl`):** Vertical separation between primary overview widgets, broker distribution ribbons, and asset-class allocations.

## Elevation & Depth

Depth is treated as physical optical layers through smoked glass panes suspended above a pitch-black foundation. Shadows are not purely black; they feature soft violet and midnight tints.

### Elevation Hierarchy
1. **Level 0 (Canvas Base):** Solid `#070B14`. Non-elevated, static canvas ground.
2. **Level 1 (Card Surfaces & Modules):**
   - Background: `rgba(17, 27, 46, 0.7)`.
   - Backdrop Filter: `blur(16px) saturate(140%)`.
   - Border: `1px solid rgba(255, 255, 255, 0.08)`.
   - Shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.45)`.
3. **Level 2 (Dropdowns, Synced Modals, Floating Toolbars):**
   - Background: `rgba(17, 27, 46, 0.92)`.
   - Backdrop Filter: `blur(24px)`.
   - Border: `1px solid rgba(124, 92, 255, 0.25)`.
   - Shadow: `0 16px 48px -4px rgba(0, 0, 0, 0.65), 0 0 24px 0 rgba(124, 92, 255, 0.15)`.
4. **Luminescent Radial Halos:**
   - Underneath key metric summary cards, inject an ambient radial gradient: `radial-gradient(circle at 50% 0%, rgba(124, 92, 255, 0.12) 0%, transparent 70%)`.
   - On outperforming portfolio states (> 2% daily gain), shift ambient aura to: `radial-gradient(circle at 50% 0%, rgba(16, 229, 160, 0.1) 0%, transparent 70%)`.

## Shapes

The design uses balanced, rounded geometries with specialized radii for financial panels:

- **Surface Panels & Cards:** Fixed `20px` corner radii (`1.25rem`) create smooth boundaries that contain multi-metric data tables without visual harshness.
- **Badges, Status Tags & Action Buttons:** Full pill geometry (`9999px`) for quick tactile affordance and seamless differentiation from tabular card containers.
- **Input Fields & Segmented Selectors:** `10px` (`0.625rem`) corner radii for structured control areas.

## Components

### Buttons & Interactive Controls
- **Primary CTA:** Background `#7C5CFF`, text `#FFFFFF`, rounded pill (`9999px`), internal padding `10px 24px`. Hover state: drops ambient glow `0 0 20px rgba(124, 92, 255, 0.45)`. Active: scale transform down to `0.98`.
- **Secondary Ghost:** Background `rgba(255, 255, 255, 0.04)`, border `1px solid rgba(255, 255, 255, 0.1)`, text `#FFFFFF`. Hover: background `rgba(255, 255, 255, 0.08)`.

### Market Status Badges & Pills
- **Gain Pill:** Background `rgba(16, 229, 160, 0.12)`, border `1px solid rgba(16, 229, 160, 0.3)`, text `#10E5A0`, font style `badge-label`.
- **Loss Pill:** Background `rgba(255, 92, 122, 0.12)`, border `1px solid rgba(255, 92, 122, 0.3)`, text `#FF5C7A`, font style `badge-label`.
- **Real-Time Pulse Indicator:** `6px` circular beacon. For open Indian market hours (`9:15 AM - 3:30 PM IST`), render green `#10E5A0` with a radiating CSS ping ring animation. For closed/post-market, render muted `#94A3B8`.

### Broker Rollup Card
- **Layout:** Contained within a `20px` glass card. Includes broker insignia (Zerodha, Groww, AngelOne, Upstox), current sync status, aggregated balance in `tabular-nums`, and individual broker allocation percentage.
- **Border Treatment:** On broker connection error or re-authentication requirement, border transitions to `1px solid rgba(255, 92, 122, 0.5)` with an alert chip.

### Index Ribbon (NIFTY 50 / SENSEX)
- Flat horizontal marquee strip above primary navigation. Displays index value, absolute delta, and percentage delta with minimal `space-sm` separation, separated by thin vertical dividers (`1px solid rgba(255, 255, 255, 0.06)`).

### Input Fields & Controls
- **Input Box:** Surface `#0B1120`, border `1px solid rgba(255, 255, 255, 0.08)`, border-radius `10px`, typography `body-md`, caret `#7C5CFF`. Focus: border `1px solid #7C5CFF`, box-shadow `0 0 0 3px rgba(124, 92, 255, 0.2)`.
- **Checkboxes & Radios:** Rounded `4px` (checkbox) or circular (radio), background `#0B1120`, border `1.5px solid rgba(255, 255, 255, 0.2)`. Checked state: background `#7C5CFF`, border-color `#7C5CFF`.

### Financial Data Tables
- Header row: `#94A3B8`, `label-uppercase`, zero background fill, separated by `1px solid rgba(255, 255, 255, 0.06)`.
- Row height: `48px` default, `40px` dense. Hover state: `background: rgba(255, 255, 255, 0.02)`.
- Number columns align to the right; ticker and broker tags align to the left.