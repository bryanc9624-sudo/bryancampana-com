# bryancampana.com — Portfolio Site Rebuild

**Date:** 2026-09-07
**Status:** Revision 2 — awaiting final approval
**Author:** Bryan Campana, with Claude

---

## 1. Purpose

Replace the current Cargo-hosted portfolio with a self-owned, git-based site that
Bryan can maintain conversationally with AI assistance, and design in Figma over time.

**Primary audience:** hiring managers and recruiters reviewing Bryan for design roles.

**Primary goal:** a visitor scans the work and, without clicking, understands each
project's *scope* and the *main design question* it addressed.

**Success criteria:**

- A visitor reaches the work index within one click of landing.
- Every project communicates scope + design question on the index page itself.
- Adding a new project is a content edit, not a design task.
- The site loads fast on a poor connection.
- Bryan can request a change in plain language and see it live within minutes.

## 2. Non-goals

- No live Figma-to-site sync. Figma is a design surface; code is the source of truth.
- No CMS, database, or admin UI. Content lives in files in the repo.
- No blog, newsletter, analytics dashboard, or e-commerce.
- No domain transfer away from GoDaddy.
- No password-protected work (confirmed: no NDA material).

## 3. Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro** | Content-site focused; ships near-zero JS; Markdown-native |
| Source of truth | **git**, hosted on **GitHub** | Plain files an AI agent can read and edit; full history |
| Hosting | **Netlify** | Free at this scale; deploy-on-push; instant rollback; preview URLs |
| DNS | Moves to Netlify | Currently Cargo's nameservers |
| Domain registrar | **GoDaddy** (unchanged) | Nameserver change only |
| Design surface | **Figma** (Phase 6) | Design tokens map to CSS custom properties |
| Styling | Plain CSS with custom properties | No build-tool dependency; token-driven; readable |

**Rejected:** Framer/Webflow (proprietary source, not AI-maintainable);
staying on Cargo (no file-level access); Figma Sites (walled garden, no git).

## 4. Current-state findings (verified 2026-09-07)

- `bryancampana.com` A records → `3.215.100.79`, `3.234.189.133`
- Nameservers → `ns1.cargocollective.com`, `ns2.cargocollective.com` (Cargo runs DNS)
- `Server: Cargo`, `x-powered-by: Cargo` — Cargo hosts the site
- GoDaddy is **registrar only**; domain is fully portable
- MX → Zoho Mail. **No email address or contact form appears anywhere on the site.**
  Bryan confirms the domain mailbox is unused. MX records will be dropped at cutover.
- Images served at `w/1000` — Cargo has downscaled all originals. Originals not
  recoverable from Cargo; new assets will be produced from source material in
  `~/My Drive/02 Studio/Design/bryancampana.com/`.
- Current typeface: Compagnon. **Dropped** — this is a visual reset.
- Local environment: git 2.50.1, Node v24.20.0, npm 11.19.0 — all verified present.
- Repo location: `~/Documents/bryancampana-com` (deliberately outside Google Drive).

## 5. Information architecture

```
/                     Landing        — positioning, featured work, route to /work
/work                 Work index     — all projects, scannable, scope + design question
/work/[slug]          Case study     — featured projects only
/about                About          — bio, résumé PDF download, contact
/terms                Terms of use   — boilerplate
/privacy              Privacy policy — boilerplate
```

## 6. Content model

The core architectural decision: **a project is data, not a hand-built page.**

Each project is one Markdown file in `src/content/projects/`:

```yaml
---
title: string                              # project name
year: number | null
role: string | null                        # Bryan's role
category: 'design' | 'art' | 'photography' # discipline (from Cargo archive)
scope: string                              # one line — what the project was
designQuestion: string | null              # the core question  ← the differentiator
featured: boolean                          # true = full case study; false = index entry
order: number                              # manual sort control
aspect: string                             # placeholder aspect ratio, e.g. '3/2'
---

Case study body in Markdown (rendered only when featured: true).
```

**Amended 2026-09-07 after Phase 0 archive.** Added `category` — the Cargo site
organizes work into Design (6), Art (4), and Photography (4), which the original spec
missed. Dropped `cover` and `tags` as YAGNI; `aspect` carries the placeholder ratio
until real assets land in Phase 4. Display treatment for categories (grouped, filtered,
or flat) is a Phase 2 review decision.

**Two-tier presentation.** ~15 projects total:

| Tier | Count | Treatment |
|---|---|---|
| Featured | 4 | Full case study page at `/work/[slug]` |
| Selected | remainder | Index entry only: image, title, design question, year, role |

Rationale: 15 equally-weighted projects communicates no hierarchy and would require
30+ hours of writing. Tiering signals editorial confidence and cuts content work to a
weekend. Bryan has set the featured count at **4**. Promoting a project later is a one-value change (`featured: false` → `true`)
plus writing its body. No structural work required.

## 7. Design system

All visual decisions expressed as CSS custom properties in one file, so they can be
mapped 1:1 from Figma variables in Phase 6:

```
--color-*    palette
--font-*     families
--size-*     type scale
--space-*    spacing scale
--radius-*   corner radii
--measure-*  line lengths
```

Constraints from the audience goal:

- Scanning is the primary verb — hierarchy and whitespace over decoration.
- No scroll-jacking, no loading animation, no intro sequence.
- Two designed breakpoints: mobile and desktop.
- Accessibility: WCAG 2.1 AA — contrast, visible focus states, keyboard navigation,
  alt text on all project imagery.

**Skeleton-first (decided).** Phase 2 ships *structure, not styling*. Layout,
hierarchy, semantics, and the token scaffold are built; visual design is intentionally
withheld. Concretely:

- Placeholder imagery is plain neutral gray boxes at correct aspect ratios — no
  stock photos, no generated art, no decorative treatment.
- Typography and color use restrained neutral defaults, defined as tokens so they are
  single-value swaps later.
- No visual flourish invented by Claude. Every token is a slot Bryan fills from Figma.

Visual direction is a **reset** — no carry-over from the Cargo design, including the
Compagnon typeface. Direction is established by Bryan in Figma (Phase 6) and applied by
changing token values, not by rebuilding pages.

## 8. Phases

| Phase | Description | Owner | Gate |
|---|---|---|---|
| 0 | Archive Cargo site: crawl all pages, save copy, inventory images | Claude | — |
| 1 | Install Node; GitHub + Astro + Netlify; placeholder deployed; git basics taught | Both | Preview URL live |
| 2 | Structural skeleton: routes, templates, token scaffold, gray-box placeholders | Claude | Bryan reviews |
| 3 | Bryan writes case study content; Claude wires it in | **Bryan** | 4 featured done |
| 4 | Produce real image assets from Drive source material | Both | — |
| 5 | Cutover: repoint DNS, drop MX. Cargo stays live until verified | Both | Bryan's explicit go-ahead |
| 6 | Figma: learn, build token system, refine design | Bryan + Claude | ongoing |

**Sequencing decision:** build-first, Figma-concurrent. Gating the build on learning
Figma would delay launch by weeks during an active job search. Figma enters as a
refinement tool against a site that already exists — a better learning context and a
faster path to live.

## 9. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Content writing stalls the launch | **High** | Two-tier model; site launches with 4 case studies |
| Repo inside Google Drive corrupts `.git` | High | Repo at `~/Documents/bryancampana-com`, outside Drive |
| Image quality loss (originals gone) | Medium | Rebuild from Drive source material; placeholders until then |
| Bryan new to git | Medium | Claude handles commits; ~4 concepts taught in Phase 1 |
| DNS cutover error | Low | Email risk eliminated; Cargo stays live until verified |

## 10. Open items

- Visual direction — deferred to Phase 6 by decision; Phase 2 ships a neutral skeleton
- Résumé PDF — Bryan to supply
- Which 4–6 projects are Featured — Bryan to decide in Phase 3
- Terms/privacy copy — carry over from Cargo archive in Phase 0
