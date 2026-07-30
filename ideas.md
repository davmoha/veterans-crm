# Nonprofit CRM Guide — Design Brainstorm

## Three Stylistic Approaches

### Approach A — "Civic Blueprint"
A technical, blueprint-inspired aesthetic evoking precision and institutional trust. Think architectural drawings meets government data portal.
**Probability:** 0.04

### Approach B — "Warm Ledger"
A warm, editorial document-style design with cream backgrounds, serif accents, and ink-like typography. Feels like a beautifully typeset reference manual.
**Probability:** 0.07

### Approach C — "Dark Intelligence" *(Selected)*
A sophisticated dark-mode SaaS reference tool. Deep navy/charcoal backgrounds with teal and amber accent colors. Feels like a premium internal tool used by a data-forward team.
**Probability:** 0.03

---

## Chosen Approach: "Dark Intelligence"

### Design Movement
Dark SaaS / Technical Documentation — inspired by tools like Linear, Vercel Docs, and Stripe Dashboard. Precision, information density, and quiet confidence.

### Core Principles
1. **Information hierarchy first** — every element has a clear rank; nothing competes for attention equally.
2. **Dark depth over flat darkness** — layered surfaces (background → card → elevated card) create spatial depth without color noise.
3. **Teal as the signal color** — one ownable accent cuts through the dark palette for all interactive and highlighted elements.
4. **Typographic restraint** — two fonts max; size and weight carry all hierarchy.

### Color Philosophy
- Background: deep charcoal `oklch(0.14 0.01 240)` — dark but not pure black, avoids harshness
- Surface: `oklch(0.19 0.012 240)` — cards and panels
- Elevated: `oklch(0.23 0.014 240)` — hover states, active rows
- Teal accent: `oklch(0.72 0.15 185)` — interactive elements, badges, highlights
- Amber accent: `oklch(0.82 0.14 80)` — formula/roll-up field badges (special data types)
- Muted text: `oklch(0.60 0.01 240)` — secondary labels

### Layout Paradigm
Left-rail sidebar navigation (fixed, 260px) + right content area. The sidebar lists all four modules with field counts. Content area shows a full-width field table per module. No centered hero layout — this is a reference tool, not a marketing page.

### Signature Elements
1. **Data-type badges** — color-coded pill badges for each field type (Text = slate, Date = blue, Formula = amber, Roll-up = teal, etc.)
2. **Field row hover glow** — subtle teal left-border glow on row hover
3. **Module header banners** — each module has a distinct icon + gradient accent strip

### Interaction Philosophy
Keyboard-first navigation. Live search filters fields across all modules in real-time. Clicking a module in the sidebar smoothly scrolls to the section. Field rows expand on click to show full validation details.

### Animation
- Sidebar active state: 150ms ease-out left-border slide
- Row expand: 200ms height transition, cubic-bezier(0.23, 1, 0.32, 1)
- Search filter: instant (no animation — keyboard action)
- Page entrance: staggered row fade-in, 30ms per row, 0→1 opacity

### Typography System
- Display/Headings: **DM Sans** (700, 600) — geometric, modern, not Inter
- Body/Tables: **IBM Plex Mono** for field names and data types; **DM Sans** (400) for descriptions
- Scale: 13px base for table content, 15px for section headers, 24px for module titles

### Brand Essence
A precision reference tool for nonprofit CRM teams who need fast, reliable field documentation. Serious. Structured. Searchable.
**Personality:** Authoritative, precise, accessible.

### Brand Voice
Headlines are declarative and technical. CTAs are action-oriented. No filler.
- Example headline: "35 Fields. 4 Modules. One Source of Truth."
- Example CTA: "Jump to Volunteer Fields"

### Wordmark & Logo
A stylized database cylinder icon with a teal accent ring — representing structured data. No wordmark text in the mark itself.

### Signature Brand Color
Teal `oklch(0.72 0.15 185)` — unmistakably this tool's identity color.

---

## Style Decisions
- Data-type badge color map: Text=slate, Email=blue, Phone=cyan, Date=indigo, Currency=green, Formula=amber, Roll-up=teal, Picklist=violet, Multi-select=purple, Checkbox=rose, Address=orange, Lookup=sky, Auto-Number=lime, Rich Text=pink
- Module icons: Core Profile=Users, Volunteer=Heart, Board=Shield, Membership=Star
- Search bar lives in the top header, always visible
- Teal is the ONLY broad brand accent; other hues (purple, amber, green) appear only in data-type badges
- Module headers are precision data panels, not decorative gradient banners
- Dashboard header is operational and data-first: field counts, auto-trigger counts, formula field counts
- Opening copy is declarative: "35 Fields · 4 Modules · One Source of Truth"
- Module color washes are minimal (teal/10 only) to avoid competing brand signals
