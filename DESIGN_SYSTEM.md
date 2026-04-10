# Design System Inspired by VoltAgent

## 1. Visual Theme & Atmosphere

VoltAgent's interface is a deep-space command terminal for the AI age — a developer-facing darkness built on near-pure-black surfaces (`#050507`) where the only interruption is the electric pulse of emerald green energy. The entire experience evokes the feeling of staring into a high-powered IDE at 2am: dark, focused, and alive with purpose. This is not a friendly SaaS landing page — it's an engineering platform that announces itself through code snippets, architectural diagrams, and raw technical confidence.

The green accent (`#00d992`) is used with surgical precision — it glows from headlines, borders, and interactive elements like a circuit board carrying a signal. Against the carbon-black canvas, this green reads as "power on" — a deliberate visual metaphor for an AI agent engineering platform. The supporting palette is built entirely from warm-neutral grays (`#3d3a39`, `#8b949e`, `#b8b3b0`) that soften the darkness without introducing color noise, creating a cockpit-like warmth that pure blue-grays would lack.

**Key Characteristics:**
- Carbon-black canvas (`#050507`) with warm-gray border containment (`#3d3a39`)
- Single-accent identity: Emerald Signal Green (`#00d992`)
- Dual-typography system: system-ui for headings, Inter for body, SFMono for code
- Ultra-tight heading line-heights (1.0–1.11)
- Warm neutral palette (`#3d3a39`, `#8b949e`, `#b8b3b0`)

## 2. Color Palette

| Name | Hex | Role |
|------|-----|------|
| Emerald Signal Green | `#00d992` | Brand accent, active borders, glow |
| VoltAgent Mint | `#2fd6a1` | Button text on dark |
| Abyss Black | `#050507` | Page background |
| Carbon Surface | `#101010` | Cards, contained elements |
| Warm Charcoal | `#3d3a39` | Borders, containment |
| Snow White | `#f2f2f2` | Primary text |
| Warm Parchment | `#b8b3b0` | Secondary text |
| Steel Slate | `#8b949e` | Tertiary text, metadata |

## 3. Typography

- **Headings**: system-ui, line-height 1.0–1.11, letter-spacing -0.65px to -0.9px
- **Body/UI**: Inter, OpenType `"calt", "rlig"`
- **Code**: SFMono-Regular

## 4. Components

### Cards
- Background: `#101010`, Border: `1px solid #3d3a39`, Radius: 8px
- Active: `2px solid #00d992`

### Buttons
- Ghost: transparent bg, `#ffffff` text, `1px solid #3d3a39` border, 6px radius
- Primary CTA: `#101010` bg, `#2fd6a1` text

### Elevation
- Level 1: `1px solid #3d3a39`
- Level 3 (Accent): `2px solid #00d992`
- Level 4 (Glow): `rgba(92,88,85,0.2) 0px 0px 15px`
