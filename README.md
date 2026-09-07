# bryancampana.com

Astro site. Content lives in plain files, so most changes are text edits — no code.

**Run it locally**

```
npm run dev
```

Then open <http://localhost:4322>. It reloads as you save. Your phone can reach it on the
same wifi at the address the terminal prints.

---

## Where things are

| I want to change… | Edit |
|---|---|
| A project's text, keywords, cover, order | `src/content/projects/<slug>.md` |
| A project's photographs | `src/assets/projects/<slug>/` |
| Colours, type sizes, spacing | `src/styles/tokens.css` |
| Bio, résumé link | `src/pages/about.astro` |
| Résumé PDF | `public/resume.pdf` |

---

## Editing a project

Every project is one file. The part between the **two `---` lines** is data; everything
below is the case-study prose.

```yaml
---
title: Dura Architectural Signage
year: 2025                        # sort order only, never displayed
completed: "September 2025"       # what actually shows under Completed
discipline: "Visual Communications"  # a label; does NOT pick the layout
layout: standard                  # standard | image-first
keywords: ["Signage"]
scope: One line describing the project. Shows on the card.
designQuestion: null              # optional; set it and it appears
medium: null                      # photography/video projects use these
prints: null
dimensions: null
cover: "02.jpg"                   # optional; which image the card uses
featured: true                    # true = appears on the landing page
order: 1                          # position on /work
aspect: "3/2"                     # placeholder shape, only used with no photos
---

Prose goes here.
```

**There are only ever two `---` lines.** A third means something is in the wrong place.

### Rules that keep YAML happy

- Quote any value containing a colon: `"Print: 8 × 10 in."`
- Use `null` for "nothing", not `""` and not a deleted line
- Keep the quotes and brackets on `keywords`

If you break it, the browser shows a red error naming the file and line. Fix, save, gone.

---

## Keywords

```yaml
keywords: ["Photography", "Film"]
```

**Adding a keyword to any project adds it to the `/work` filter automatically** — the links
and their filtering rules are both generated from the content. No code change. A project
with several keywords appears under each of them.

Current set: Photography, Identity, New Media, Signage, Digital, Fine Art.

Keep them few. A keyword matching one project does little for a visitor, and long labels
crowd the filter on a phone.

`discipline` is **not** the same thing. It is a label that appears in the facts list. It
does not affect the layout or the filter.

---

## Choosing a project page layout

```yaml
layout: image-first
```

| Value | What it looks like |
|---|---|
| `standard` *(default)* | Sticky text rail on the left, wide image column on the right. Suits work with something to read. |
| `image-first` | Header at reading width, then the images two-up, then the facts underneath. Suits work that should be looked at rather than read. |

Named for the layout rather than the kind of work, so any project can use either. The four
photography projects use `image-first`, but nothing stops an identity project from using
it, and nothing forces a photography project to.

---

## Photographs

Drop files in `src/assets/projects/<slug>/`. Create the folder if it does not exist; the
folder name must match the `.md` filename.

**Export settings**

| | |
|---|---|
| Long edge | 2400px |
| Format | JPEG, quality 85–90 (PNG for flat graphic work) |
| Colour profile | **sRGB** — not Adobe RGB. Wrong profile renders dull and shifted. |
| Metadata | strip it |

Do not compress for the web. The build produces WebP at several sizes and serves each
device the smallest one that fits — 2400px sources ship as roughly 15KB to a phone.

**Order** is filename order, so name them `01.jpg`, `02.jpg`. The card uses the first
unless `cover` says otherwise. A `cover` naming a file that does not exist fails the build
and lists what is available.

**Captions** (photography pages) come from an `images` list, matched by position:

```yaml
images:
  - caption: "the place I call home"
  - caption: "a higher power"
```

---

## Adding a project

1. Copy `docs/new-project-template.md` to `src/content/projects/your-slug.md`
2. Fill it in. The filename becomes the URL: `/work/your-slug`
3. Make `src/assets/projects/your-slug/` and add photographs
4. Give it an `order` — it sorts against the others

Nothing else. Routes, the filter, the sitemap and the landing page all follow.

---

## Publishing

Local edits are not live. The site deploys to Netlify only when a commit message contains
`[deploy]`, which keeps build credits from being spent on every change.

Ask Claude to commit and deploy — the git side is handled for you.

---

## Checks

```
npm test    # content integrity — counts, keywords, disciplines, featured bodies
npm run build
npm run todos   # what content is still missing
```
