---
name: design-guide
description: Enforce minimal modern design — 8px grid, clean typography, cool monochrome palette, mobile-first. Use when creating components, layouts, or reviewing UI.
---

# Minimal Modern Design Guide — Finding My Zen

## Color Palette (Cool Monochrome)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f7f7f7` | Page background |
| `--bg-subtle` | `#efefef` | Card/section backgrounds |
| `--border` | `#e0e0e0` | Borders, dividers |
| `--text` | `#1a1a1a` | Primary text |
| `--text-secondary` | `#6b6b6b` | Secondary/muted text |
| `--text-tertiary` | `#999999` | Placeholder, caption |
| `--accent` | `#4a4a4a` | Buttons, interactive |
| `--accent-hover` | `#333333` | Hover states |
| `--coin` | `#b8b8b8` | Coin surface (silver/pewter) |
| `--coin-edge` | `#8a8a8a` | Coin edge/shadow |
| `--white` | `#ffffff` | Cards, overlays |

No bright colors. No gradients. Monochrome only with subtle warmth in neutrals.

## 8px Grid System

All spacing, padding, margins, and component dimensions MUST be multiples of 8px:
- `4px` — only for fine details (borders, small icon adjustments)
- `8px` — tight spacing (inline elements, icon gaps)
- `16px` — default spacing (component padding, list gaps)
- `24px` — section spacing
- `32px` — large gaps
- `48px` — section breaks
- `64px` — page-level spacing
- `80px`, `96px`, `128px` — hero/major sections

Never use odd or non-grid values (5px, 10px, 15px, 18px, etc.).

## Typography

Font: `Inter` (sans-serif) loaded from Google Fonts.

| Level | Size | Weight | Line-height | Letter-spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 48px | 300 (light) | 1.1 | -0.02em | Hero text |
| H1 | 32px | 400 (regular) | 1.2 | -0.01em | Page titles |
| H2 | 24px | 400 | 1.3 | 0 | Section headers |
| H3 | 18px | 500 (medium) | 1.4 | 0 | Subsections |
| Body | 16px | 400 | 1.6 | 0 | Regular text |
| Small | 14px | 400 | 1.5 | 0 | Secondary text |
| Caption | 12px | 400 | 1.4 | 0.01em | Labels, timestamps |

Keep font weights minimal: 300, 400, 500 only. No bold (700) except for strong emphasis.

## Mobile-First Breakpoints

Design for mobile first, then enhance:

| Breakpoint | Width | Target |
|------------|-------|--------|
| Default | 0px+ | Mobile (320-639px) |
| `sm` | 640px+ | Large mobile |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Desktop |

- Touch targets: minimum 48px on mobile
- Max content width: 480px (mobile), 640px (tablet), 768px (desktop) — keep it narrow and focused
- Always center content with generous whitespace

## Component Principles

- **Whitespace is a feature** — when in doubt, add more space
- **No borders unless necessary** — use spacing and subtle background shifts instead
- **Subtle shadows only** — `shadow-sm` max, never heavy drop shadows
- **Rounded corners**: 8px for cards, 50% for circular elements (coin, avatar)
- **Transitions**: 200ms ease for hover/focus, 300ms for layout changes
- **No decorative elements** — every pixel must serve a purpose
- **Opacity for hierarchy** — use opacity (0.6, 0.4) to de-emphasize secondary content

## Animation Guidelines

- Animations should feel natural and calming, never jarring
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for natural motion
- Duration: 200-400ms for micro-interactions, 800-1200ms for major transitions
- `prefers-reduced-motion`: always provide a fallback (cross-fade or instant)

## Validation Checklist

Before finalizing any UI component:
- [ ] All spacing values are multiples of 8px
- [ ] Colors use only the defined palette tokens
- [ ] Typography matches the hierarchy table
- [ ] Touch targets are 48px+ on mobile
- [ ] Works on 320px viewport width
- [ ] `prefers-reduced-motion` respected
- [ ] No decorative elements that don't serve function
