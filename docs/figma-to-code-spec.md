# Figma → Code Spec

**Date:** 2026-09-07
**Figma file:** `IeY23kkW263ZvuyJqiV2kD` — bryancampana.com — Design System + Screens
**Status:** Design decided in Figma; code not yet updated. This document is the handoff.
**Audience:** the session implementing these changes. Bryan is handling code in a separate chat.

The Figma file and `src/styles/tokens.css` are meant to map 1:1. Right now **Figma is ahead of
the code** in exactly the places listed below. Nothing here has been implemented.

---

## 1. Design tokens — `src/styles/tokens.css`

### 1.1 No new custom properties

No new colour, spacing, or radius tokens were created. The 26 existing Figma variables still map
1:1 to the existing custom properties, unchanged.

### 1.2 Responsive display type (the only token change)

Two existing tokens gain a small-screen value. In Figma this is a second variable mode
(`Desktop` / `Mobile`); in CSS it is one media query.

| Token | Desktop (unchanged) | Under 40rem (new) |
|---|---|---|
| `--size-xl` | `2rem` (32px) | `1.5rem` (24px) |
| `--size-2xl` | `3rem` (48px) | `2rem` (32px) |

```css
/* append to tokens.css */
@media (max-width: 39.999rem) {
  :root {
    --size-xl: 1.5rem;
    --size-2xl: 2rem;
  }
}
```

**Why:** at 390px the landing statement rendered as an 8-line, 296px block. With the step-down it
is 168px. The same problem affects the `Work` heading and every project-page title at `--size-2xl`.

**Note on the breakpoint literal.** `tokens.css` documents that `40rem` and `64rem` are the only
literals permitted outside the file because custom properties cannot be used in media queries.
This new query uses `40rem` and stays within that rule.

**Note on modes.** The Figma collection's single mode was renamed `Light` → `Desktop`, and a
`Mobile` mode added. The mode axis is now *breakpoint*, not *theme*. If dark mode is later brought
into Figma it needs its own collection rather than another mode on this one. The dark palette
already in `tokens.css` is unaffected and still switches on `prefers-color-scheme`.

---

## 2. Content schema — `src/content.config.ts`

### 2.1 `category` → `keywords`

The work index becomes filterable by keyword. Project types are the keyword values for now; real
keywords come later without another schema change.

```ts
// replace: category: z.enum(['design', 'art', 'photography']),
keywords: z.array(z.string()).default([]),
```

Seed each project's `keywords` with its current category (`['Design']`, `['Art']`,
`['Photography']`). Grouping headings on the index are removed, so nothing else reads `category`.

If a discipline-specific page layout is wanted (§5), keep a single canonical discipline value —
either the first entry in `keywords` or a separate `discipline` field. **Decide which; do not infer
layout from an unordered array.**

### 2.2 New fields the archive requires

`archive/content/*.md` shows the live site carries fields the schema does not. Photography projects
in particular:

```ts
completed: z.string().nullable().default(null),   // "2019", "September 2025" — a string, not a number
discipline: z.string().nullable().default(null),  // "Photography", "Visual Communications"
medium: z.string().nullable().default(null),      // "Silver Gelatin prints…  Shot on 35mm."
prints: z.string().nullable().default(null),      // "Set of 6, Edition of 1"
dimensions: z.string().nullable().default(null),  // "Print: 8 × 10 in. Image: 6⅜ × 9½ in."
```

`images[].caption` already exists and is what Oscuro's six image titles map to.

**`year: number` vs `completed: string`.** The live site says *September 2025* for Dura and *2019*
for Oscuro. The current `year: z.number()` cannot hold the former. Either widen it or add
`completed` and let `year` remain a sort key.

### 2.3 `featured` changes meaning

`featured` currently controls **both** whether a page is generated and how the project is
presented. It should control presentation only (see §3).

---

## 3. Routing — `src/pages/work/[slug].astro`

Every project gets a page, not only featured ones.

```ts
// before
const featured = (await getCollection('projects')).filter(p => p.data.featured)
return featured.map(...)

// after
const all = await getCollection('projects')
return all.map(p => ({ params: { slug: p.id }, props: { project: p } }))
```

This takes generated routes from 4 to 14. Ten of those projects have no Markdown body, so
`<Content />` renders empty — the template must not assume a body exists (no empty wrappers,
margins, or rules left behind).

**Consequence in `ProjectCard.astro`:** `href` is currently `undefined` when `featured` is false,
making ten cards inert. Every card must now link:

```ts
const href = `/work/${project.id}`
```

---

## 4. `ProjectCard.astro`

One component serves both the landing page and the work index. Field visibility differs by context,
not by component.

| Field | Featured (landing) | Index | Source |
|---|---|---|---|
| Image | yes | yes | `Placeholder` / `images[0]` |
| Keyword | **pending — see §7** | **pending — see §7** | `keywords[0]` |
| Title | yes | yes | `title` |
| Year | yes | yes | `year` / `completed` |
| Description | yes | **no** | `scope` |
| Design question | **never** | **never** | — |

Order within the card: **image → keyword → title → description → year**, all left-aligned. The
right-aligned year was rejected; nothing in the card is right-aligned.

**Remove the design question from this component entirely.** It renders only on the project page.
`designQuestion` stays optional in the schema and stays conditionally rendered there.

Suggested prop, replacing the implicit featured/non-featured split:

```astro
interface Props { project: CollectionEntry<'projects'>; showDescription?: boolean }
```

---

## 5. Project page — two layouts

The archive shows design and photography projects are not the same shape.

**Standard** (`Dura`, `590 Madison`, …) — current two-column layout is correct: sticky rail on the
left (back link, title, scope, design question, facts, body), image column on the right.

**Photography** (`Oscuro`, `Two of Hearts`, `Shapes and Colors`, `Double Exposed`) — image-led.
Minimal text, images at larger scale, per-image captions from `images[].caption`. Facts move below
or after the images rather than occupying a persistent rail. **Not yet designed in Figma.**

### 5.1 Fact labels are wrong in the current code and in Figma

Both use `Role / Year / Category`. The live site uses:

| Label | Applies to | Example |
|---|---|---|
| `Completed` | all | `September 2025`, `2019` |
| `Discipline` | all | `Visual Communications`, `Photography` |
| `Medium` | photography | `35mm Film, Digital Scans` |
| `Prints` | photography | `Set of 6, Edition of 1` |

`Role` does not appear on the live site at all. Build the facts list by filtering out null fields —
`[slug].astro` already does this correctly with `.filter(([, v]) => v)`; only the label set changes.

---

## 6. New UI — keyword filter on `/work`

Replaces the three `Design` / `Art` / `Photography` grouped sections with one flat grid plus a
filter control.

**No JavaScript.** Implement with radio inputs plus sibling selectors so it works with JS disabled
and keeps the near-zero-JS goal:

```html
<input type="radio" name="kw" id="kw-all" checked>
<label for="kw-all">All</label>
<!-- one pair per keyword -->
<ul class="grid"> <li data-keywords="Design"> … </li> </ul>
```

```css
.filter-chip {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  color: var(--color-muted);
  font-size: var(--size-sm);
  background: var(--color-bg);
}
input:checked + .filter-chip { border-color: var(--color-fg); color: var(--color-fg); }
```

All values are existing tokens; no new custom properties. The chips fit on one line at 342px
(390px viewport) and do not wrap.

**Reference (supplied by Bryan):** a tag list showing each keyword with a superscript result count
and a `(More)` affordance to expand beyond the first rows. Not yet designed in Figma — counts and
progressive disclosure are additional scope beyond the four chips currently drawn.

---

## 7. Pending decisions — do not implement these yet

1. **Keyword on cards.** Bryan described the index card as "title and the year". Unclear whether the
   keyword line stays on the card. The supplied reference shows a category label above each title,
   which argues for keeping it. **Awaiting confirmation.**
2. **Year on cards.** An earlier instruction removed the year from cards; the latest reinstates it on
   both card types. Table in §4 reflects the latest. **Confirm before building.**
3. **Discipline source** — first entry of `keywords`, or its own field (§2.1).
4. **`year: number` vs `completed: string`** (§2.2).
5. **Photography project page layout** — not yet designed.
6. **Filter counts and `(More)`** — not yet designed.

---

## 8. Smaller items

- **`aria-current` has no visual treatment.** `SiteHeader.astro` sets `aria-current="page"` on the
  active nav item but no CSS targets it. Figma now shows active as `--color-fg` and inactive as
  `--color-muted`:
  ```css
  nav a { color: var(--color-muted); }
  nav a[aria-current='page'] { color: var(--color-fg); }
  ```
- **Missing from the rebuild, present on the live site:** Previous/Next project navigation, and a
  Contact link in the footer.
- **`public/resume.pdf` does not exist** and `/about` links to it.
- **All 14 `designQuestion` values are still `TODO_DESIGN_QUESTION`.** Any question text currently in
  the Figma file is a placeholder draft, not Bryan's copy.
- **The desktop case-study frame on the live design had no footer** while other pages did; the
  rebuild adds one.

---

## 9. Figma reference

| Item | Detail |
|---|---|
| Components | `ProjectCard`, `Placeholder` (3:2 / 16:9 / 1:1 / 4:5), `SiteHeader` (None / Work / About), `SiteFooter`, `FilterChip` (Default / Selected), `Eyebrow`, `FactPair` |
| Text styles | Display 2XL / XL, Title Large, Body Strong, Body, Body Large, Question, Body Small, Eyebrow, Label — each with font size bound to a `size/*` variable |
| Variable modes | `Desktop`, `Mobile` — differ only in `size/xl` and `size/2xl` |
| Pages | `01 — Foundations` (untouched), `02 — Desktop`, `03 — Mobile`, `04 — Components` |

Prose measure in Figma is drawn at 600px as an approximation of `--measure-prose: 68ch`. The CSS
value is authoritative; do not hardcode 600px.
