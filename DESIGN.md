---
name: Catnip Skill Hub
description: A spatial, editorial gallery for discovering Chinese Agent Skills.
status: implemented
source: src/app/public-web.css
---

# Design System: Catnip Skill Hub

## Overview

**Creative North Star: "Spatial Skill Gallery"**

Catnip Skill Hub should feel like a carefully edited native content gallery brought to the web: Skill artwork leads, information appears exactly when it becomes useful, and navigation has the quiet confidence and spatial continuity associated with Apple's best interfaces. This is an Apple-inspired interaction and craft direction, not an imitation of Apple branding, layouts, icons, or proprietary assets.

The world is calm, precise, image-driven, and tactile. Large areas of visual quiet make selected Skill artwork feel valuable, while compact editorial groupings keep useful content in the first viewport. Translucent material is reserved for chrome that needs spatial separation, never used as a decorative treatment on every card.

Motion communicates origin, continuity, and feedback. It remains brief and interruptible, and it disappears or becomes a simple crossfade when users request reduced motion. The working design dials are `DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 5`, and `VISUAL_DENSITY: 5`.

**Key Characteristics:**

- Editorial asymmetry inside a rigorous responsive grid.
- Skill imagery before metadata, with no fake interface screenshots.
- Porcelain and graphite surfaces with one Catnip mint interface accent.
- System-native Chinese sans-serif typography and optical hierarchy.
- A small number of spatial materials, clear focus, and restrained physical feedback.

## Colors

The interface uses a neutral light and dark system with a single Catnip mint accent. The implemented public tokens live under `.public-site`, preventing this visual system from leaking into the administrator interface.

### Primary

- **Catnip Mint:** `#24764f`; primary actions, selection and restrained brand recognition.
- **Catnip Mint Strong:** `#155c3a`; strong action state and high-contrast mint text.
- **Focus:** `#0d7444`; three-pixel visible focus outline with a three-pixel offset.

### Neutral

- **Porcelain:** `#f3f5f4`; light-mode canvas.
- **Soft White:** `#fbfcfb` and `#fcfdfc`; raised content and opaque material fallback.
- **Graphite:** `#18201c`; primary light-mode text.
- **Slate:** `#526059`; secondary text, source metadata and unavailable states.
- **Dark Canvas:** `#0d100f`; dark-mode canvas, with `#161a18` and `#1c211e` surfaces.

**The One Accent Rule.** Mint is rare and functional. It does not become a full-page wash, gradient fog, or default card background.

**The Artwork Exception Rule.** Authored Skill covers may use broader palettes, but navigation, controls, focus, and status stay within the system palette.

## Typography

**Display Font:** System UI display stack with `-apple-system`, `BlinkMacSystemFont`, and Chinese sans-serif fallbacks.

**Body Font:** System UI text stack with `PingFang SC`, `Noto Sans SC`, and sans-serif fallbacks.

**Label/Mono Font:** System monospace stack for CLI commands and technical identifiers only.

**Character:** Typography is precise, contemporary, and highly legible. Hierarchy comes from optical size, weight, spacing, and measure rather than decorative serif switching or repeated uppercase eyebrow labels.

### Hierarchy

- **Display:** Short editorial statements and selected Skill titles; compact leading and responsive size, never a full-screen slogan.
- **Headline:** Section and detail headings with strong weight contrast but natural Chinese line breaks.
- **Title:** Card titles and important action labels; optimized for fast scanning.
- **Body:** Explanations and long-form detail with comfortable measure and line height.
- **Label:** Metadata and controls in sentence case; uppercase is limited to established CLI names or source identifiers.

**The Native Clarity Rule.** Do not download or impersonate proprietary Apple fonts. Use the visitor's system stack and preserve readable Chinese fallbacks.

**The No Decorative Serif Rule.** Serif type is not used merely to imply premium quality; hierarchy must survive in one coherent sans-serif family.

## Layout

The public site uses a wide responsive canvas with strong safe-area padding and an asymmetric editorial grid. The home page is an Experience surface: a compact introduction and a featured Skill composition lead directly into discoverable content. The Skill detail page is a Read surface with an Operate action zone. The recommendation page is an Operate surface with a focused single-column form.

Desktop compositions may vary column spans and image ratios while preserving a clear reading order. Tablet collapses secondary columns without changing semantic order. Mobile becomes a single flow with edge-to-edge artwork inside safe padding, reachable controls, and no horizontal clipping. Search and category controls remain compact and must not displace the catalog with a large hero.

Motion is spatial: an element enters from its trigger or destination relationship, then exits by reversing that logic. Predetermined micro-interactions use CSS or WAAPI; gesture-driven interactions may use a spring only after a prototype proves the need. High-frequency keyboard navigation and repeated list scanning remain immediate.

**The Content in the First View Rule.** Every supported viewport must reveal real Skill content without requiring a full-screen brand or search prelude.

**The DOM Order Rule.** Visual asymmetry may not create an illogical keyboard, screen-reader, or mobile reading order.

## Elevation & Depth

Depth comes primarily from scale, overlap, tonal separation, image contrast, and a limited material hierarchy. Translucency belongs to the global header, an expanded search surface, a mobile sheet, or the detail action dock when those elements need to remain above content. Content cards are mostly opaque and image-led.

Shadows are ambient and quiet. They indicate temporary elevation or interaction state, not a permanent stack of floating panels. Backdrop filtering must have an opaque fallback and be disabled or simplified when reduced transparency is preferred.

**The Material Has a Job Rule.** Every translucent layer must explain what it separates or keeps available; otherwise it is an opaque surface.

**The Flat at Rest Rule.** Catalog cards do not float by default. Depth appears through artwork, overlap, and state response.

## Shapes

The system combines gently rounded content surfaces with fully rounded functional controls. Large Skill artwork and reading containers use a consistent soft radius family; inputs and compact panels use a smaller related radius; pills are reserved for search, segmented choices, filters, and compact actions.

Rounded forms must not erase information hierarchy. Nested surfaces step down in radius, and adjacent controls share geometry. The implemented radius family is 10px for compact fields, 16px for panels and 24px for primary artwork or feature surfaces. Functional pills use `999px` only for compact controls.

**The Functional Pill Rule.** A pill shape indicates a compact control or state. Paragraph containers, arbitrary labels, and every card do not become pills.

## Implemented Components

- **Public header:** sticky 64px chrome with one translucent layer, solid reduced-transparency fallback and compact text brand placeholder.
- **Featured Skill:** asymmetric artwork-and-copy composition, opaque surface, 24px radius and a rare explanatory entrance.
- **Catalog card:** image-first, whole-card link with varied grid spans, 120ms press feedback and pointer-capability-gated hover.
- **Skill artwork:** ten Catnip-authored geometric demo covers in `public/skill-art`; these are replaceable content artwork, not a logo, mascot or proof image.
- **Detail action panel:** download and install controls that consume existing service outputs without constructing ZIPs or commands in the UI.
- **Recommendation form:** focused single-task form with explicit status semantics and no automatic draft or publish implication.

## Motion Tokens

- Press feedback: 120ms ease-out at `scale(0.985)`.
- Hover artwork transform: 240ms with `cubic-bezier(0.23, 1, 0.32, 1)` and only on fine pointers.
- First-view editorial entrance: 460ms transform and opacity; first four catalog cards use a 280ms entrance with 55ms stagger steps.
- Repeated navigation, filtering, segmented controls and form status remain immediate or use color-only transitions under 220ms.
- `prefers-reduced-motion` removes effective movement; `prefers-reduced-transparency` replaces glass with opaque surfaces.

## Do's and Don'ts

### Do:

- **Do** let authored Skill artwork and Chinese titles create the catalog's personality.
- **Do** use origin-aware, reversible transitions and immediate pointer-down feedback for primary interactive surfaces.
- **Do** keep controls at least comfortably touchable, preserve visible focus, and support reduced motion, reduced transparency, high contrast, and system light or dark preference.
- **Do** use native CSS, View Transitions, or WAAPI before adding a motion dependency; validate any library against bundle and accessibility costs first.
- **Do** preserve source, author, License, version, Commit, and compatibility information as trust-bearing content.

### Don't:

- **Don't** copy Apple logos, product screenshots, proprietary icons, marketing copy, or trademarked visual assets.
- **Don't** use generic purple gradients, neon glow, cyberpunk decoration, glass on every card, or a giant centered hero.
- **Don't** use numbered decorative card labels, vertical decorative words, fake dashboards, browser mockups made from arbitrary divs, or generic blob art as final Skill imagery.
- **Don't** animate every hover, every text label, or frequent keyboard action; no gratuitous bounce, long easing, scale from zero, or non-interruptible sequences.
- **Don't** create a formal Catnip logo or mascot in this redesign; retain replaceable text-brand and asset slots until the team supplies them.
