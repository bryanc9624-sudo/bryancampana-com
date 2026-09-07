# bryancampana.com Portfolio Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a git-based, AI-maintainable Astro portfolio at bryancampana.com that lets a hiring manager scan 14 projects and grasp each one's scope and design question without clicking.

**Architecture:** Astro static site. Every project is one Markdown file in a content collection with a zod-validated schema; pages are templates over that data. All visual decisions live in CSS custom properties in one file so Figma tokens map 1:1 later. Skeleton-first — structure and semantics are built, visual design is deliberately withheld.

**Tech Stack:** Astro 5 (static output), TypeScript, Vitest, plain CSS with custom properties, GitHub, Netlify.

**Spec:** `docs/superpowers/specs/2026-09-07-portfolio-site-design.md`

## Global Constraints

- Node >= 22 (verified: v24.20.0, npm 11.19.0).
- Repo lives at `~/Documents/bryancampana-com` — **never** inside `~/My Drive` (Google Drive sync corrupts `.git`).
- **Skeleton-first.** No invented visual flourish. Neutral type and color only, all via tokens. Placeholder imagery is plain gray boxes at correct aspect ratio — no stock photos, no generated art.
- Exactly **4** projects have `featured: true`. The other 10 are index entries only.
- Every color, size, space, and radius value is a CSS custom property in `src/styles/tokens.css`. No hardcoded values in component CSS.
- WCAG 2.1 AA: visible focus states, semantic landmarks, alt text on every image, contrast >= 4.5:1 for body text.
- No client-side JavaScript unless a task explicitly requires it.
- The live Cargo site is untouched. No DNS changes in this plan.
- Project copy comes verbatim from `archive/content/*.md`. Do not paraphrase Bryan's writing.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/content.config.ts` | Content collection definition + zod schema. Single source of truth for project shape. |
| `src/content/projects/*.md` | 14 project files. Frontmatter = data; body = case study (featured only). |
| `src/layouts/Base.astro` | HTML shell: head, meta, skip link, header/footer slots. |
| `src/components/SiteHeader.astro` | Nav landmark. |
| `src/components/SiteFooter.astro` | Contentinfo landmark. |
| `src/components/Placeholder.astro` | Gray box at a given aspect ratio. The only "image" until Phase 4. |
| `src/components/ProjectCard.astro` | One project on the work index: placeholder, title, scope, design question, meta. |
| `src/pages/index.astro` | Landing. Positioning + featured work + route to /work. |
| `src/pages/work/index.astro` | Work index. The primary scanning surface. |
| `src/pages/work/[slug].astro` | Case study template. Featured projects only. |
| `src/pages/about.astro` | Bio, résumé link, contact. |
| `src/pages/terms.astro`, `privacy.astro` | Boilerplate, copy from archive. |
| `src/pages/404.astro` | Not found. |
| `src/styles/tokens.css` | Every design decision as a custom property. The Figma handoff surface. |
| `src/styles/base.css` | Reset + element defaults, consuming tokens only. |
| `tests/content.test.ts` | Schema and data-integrity tests. |

---

## Task 1: Repo, Astro scaffold, and first deploy

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `netlify.toml`, `src/pages/index.astro`

**Interfaces:**
- Consumes: nothing
- Produces: a working `npm run build` and a live Netlify preview URL

- [ ] **Step 1: Initialize git and set the ignore rules**

```bash
cd ~/Documents/bryancampana-com
git init -b main
cat > .gitignore <<'EOF'
node_modules/
dist/
.astro/
.DS_Store
.env
.netlify/
EOF
```

- [ ] **Step 2: Scaffold Astro into the existing directory**

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --skip-houston --typescript strict
npm install
```

Expected: `package.json`, `astro.config.mjs`, `src/pages/index.astro` created. `archive/` and `docs/` are preserved.

- [ ] **Step 3: Verify the build works**

Run: `npm run build`
Expected: exits 0, creates `dist/index.html`.

- [ ] **Step 4: Add the Netlify build config**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Netlify config"
```

- [ ] **Step 6: Push to GitHub and connect Netlify**

Bryan creates an empty GitHub repo named `bryancampana-com` (no README, no .gitignore).

```bash
git remote add origin https://github.com/<username>/bryancampana-com.git
git push -u origin main
```

Then in Netlify: Add new site -> Import from GitHub -> select the repo -> deploy (settings come from `netlify.toml`).

- [ ] **Step 7: Verify the deploy**

Expected: Netlify gives a `*.netlify.app` URL that loads. **This is the Phase 1 gate.** bryancampana.com is untouched.

---

## Task 2: Content schema

**Files:**
- Create: `src/content.config.ts`, `tests/content.test.ts`
- Modify: `package.json` (add vitest)

**Interfaces:**
- Consumes: nothing
- Produces: collection `projects` with fields `title: string`, `year: number | null`, `role: string | null`, `category: 'design' | 'art' | 'photography'`, `scope: string`, `designQuestion: string | null`, `featured: boolean`, `order: number`, `aspect: string`. Imported elsewhere as `getCollection('projects')`.

- [ ] **Step 1: Install the test runner**

```bash
npm install -D vitest
npm pkg set scripts.test="vitest run"
```

- [ ] **Step 2: Write the failing test**

```typescript
// tests/content.test.ts
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'src/content/projects'
const files = () => readdirSync(DIR).filter(f => f.endsWith('.md'))

function frontmatter(file: string): Record<string, string> {
  const raw = readFileSync(join(DIR, file), 'utf8')
  const block = raw.split('---')[1] ?? ''
  const out: Record<string, string> = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (m) out[m[1]] = m[2].trim()
  }
  return out
}

describe('project content', () => {
  it('has 14 projects', () => {
    expect(files().length).toBe(14)
  })

  it('has exactly 4 featured projects', () => {
    const featured = files().filter(f => frontmatter(f).featured === 'true')
    expect(featured.length).toBe(4)
  })

  it('gives every project a non-empty scope', () => {
    for (const f of files()) {
      expect(frontmatter(f).scope, `${f} scope`).toBeTruthy()
    }
  })

  it('uses only known categories', () => {
    const allowed = ['design', 'art', 'photography']
    for (const f of files()) {
      expect(allowed, `${f} category`).toContain(frontmatter(f).category)
    }
  })
})
```

- [ ] **Step 3: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL — `ENOENT: no such file or directory, scandir 'src/content/projects'`

- [ ] **Step 4: Write the schema**

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    year: z.number().nullable().default(null),
    role: z.string().nullable().default(null),
    category: z.enum(['design', 'art', 'photography']),
    scope: z.string(),
    designQuestion: z.string().nullable().default(null),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    aspect: z.string().default('3/2'),
  }),
})

export const collections = { projects }
```

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts tests/content.test.ts package.json package-lock.json
git commit -m "feat: add project content collection schema and tests"
```

---

## Task 3: Seed all 14 project files

**Files:**
- Create: `src/content/projects/<slug>.md` x14

**Interfaces:**
- Consumes: schema from Task 2
- Produces: 14 entries retrievable via `getCollection('projects')`

Source copy is in `archive/content/*.md` and summarized in `archive/PROJECTS.md`. Use it verbatim.

Featured (4): `dura-architectural-signage`, `590-madison-ave`, `togethereffect`, `represent-1`.
Rationale: the four strongest *design* projects, matching the job-application audience. Bryan can change this by flipping `featured` — see Task 3 Step 4.

- [ ] **Step 1: Write the test for the featured set**

Add to `tests/content.test.ts`:

```typescript
it('features only design-category projects', () => {
  for (const f of files()) {
    const fm = frontmatter(f)
    if (fm.featured === 'true') expect(fm.category, `${f}`).toBe('design')
  }
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL — 14-projects assertion still failing, directory empty.

- [ ] **Step 3: Create one featured project file**

```markdown
---
title: Dura Architectural Signage
year: 2025
role: Designer
category: design
scope: Design intent, shop drawings, and documentation standards at a signage fabricator.
designQuestion: TODO_DESIGN_QUESTION
featured: true
order: 1
aspect: 3/2
---

I joined Dura to explore how graphic design could strengthen a fabrication company
from within. What began as a technical role evolved into a design-led position
focused on clarity, process, and communication.

At Dura, I worked across every stage of signage production—from design intent through
fabrication. Our team handled a wide range of projects: ongoing standards for
NewYork-Presbyterian and NYU Langone Health, donor recognition and corporate signage
at 590 Madison Avenue, and large-scale architectural signage projects for design firms.

My work centered on developing visual systems that improved precision and consistency.
I created templates, workflows, and documentation standards that accelerated approvals
and unified how information moved between project teams and fabrication. These systems
allowed us to approach projects not just as fabricators, but as signage consultants
contributing to the design conversation.
```

- [ ] **Step 4: Create one non-featured project file**

```markdown
---
title: Shapes and Colors
year: 2021
role: Photographer
category: photography
scope: Landscapes and architecture through abstract, colorful compositions.
designQuestion: TODO_DESIGN_QUESTION
featured: false
order: 12
aspect: 3/2
---
```

Non-featured files have frontmatter only — no body.

- [ ] **Step 5: Create the remaining 12 files**

Follow the same two patterns. `order` runs 1-6 for design, 7-10 for art, 11-14 for photography, matching `archive/PROJECTS.md`. Featured: `590-madison-ave` (order 2), `togethereffect` (order 4), `represent-1` (order 5) get bodies from their archive files. All others are frontmatter-only.

`oscuro.md` has no usable scope line in the archive — use `scope: TODO_SCOPE` and flag it for Bryan.

- [ ] **Step 6: Run tests and the build**

Run: `npm test && npm run build`
Expected: all 5 tests PASS; build exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/content/projects tests/content.test.ts
git commit -m "feat: seed 14 projects from Cargo archive"
```

---

## Task 4: Design tokens and base layout

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/layouts/Base.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`

**Interfaces:**
- Consumes: nothing
- Produces: `Base.astro` accepting props `{ title: string, description?: string }` and a default `<slot />`

- [ ] **Step 1: Write the tokens**

```css
/* src/styles/tokens.css
   Every visual decision lives here. Figma variables map 1:1 to these names.
   Values are deliberately neutral placeholders — Phase 6 replaces them. */
:root {
  --color-bg: #ffffff;
  --color-fg: #141414;
  --color-muted: #6b6b6b;
  --color-line: #e4e4e4;
  --color-placeholder: #e8e8e8;
  --color-focus: #0044cc;

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-body: var(--font-sans);
  --font-display: var(--font-sans);

  --size-xs: 0.8125rem;
  --size-sm: 0.9375rem;
  --size-base: 1.0625rem;
  --size-lg: 1.375rem;
  --size-xl: 2rem;
  --size-2xl: 3rem;

  --leading-tight: 1.15;
  --leading-body: 1.55;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2.5rem;
  --space-6: 4rem;
  --space-7: 6rem;

  --radius-sm: 0;
  --radius-md: 0;

  --measure-prose: 68ch;
  --page-max: 1200px;
  --page-pad: var(--space-4);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #101010;
    --color-fg: #f2f2f2;
    --color-muted: #a0a0a0;
    --color-line: #2a2a2a;
    --color-placeholder: #222222;
    --color-focus: #7aa7ff;
  }
}
```

- [ ] **Step 2: Write the base stylesheet**

```css
/* src/styles/base.css — element defaults. Tokens only, no literal values. */
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
  font-size: var(--size-base);
  line-height: var(--leading-body);
}
h1, h2, h3 { font-family: var(--font-display); line-height: var(--leading-tight); margin: 0; }
p { margin: 0 0 var(--space-3); max-width: var(--measure-prose); }
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }

.page { max-width: var(--page-max); margin: 0 auto; padding: 0 var(--page-pad); }
.skip-link {
  position: absolute; left: -9999px;
  background: var(--color-bg); color: var(--color-fg);
  padding: var(--space-2) var(--space-3);
}
.skip-link:focus { left: var(--space-3); top: var(--space-3); z-index: 10; }
```

- [ ] **Step 3: Write the base layout**

```astro
---
// src/layouts/Base.astro
import '../styles/base.css'
import SiteHeader from '../components/SiteHeader.astro'
import SiteFooter from '../components/SiteFooter.astro'
interface Props { title: string; description?: string }
const { title, description = 'Portfolio of Bryan Campana.' } = Astro.props
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site ?? 'https://bryancampana.com')} />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main" class="page"><slot /></main>
    <SiteFooter />
  </body>
</html>
```

- [ ] **Step 4: Write header and footer**

```astro
---
// src/components/SiteHeader.astro
const links = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
]
const path = Astro.url.pathname
---
<header class="page site-header">
  <a href="/" class="site-header__name">Bryan Campana</a>
  <nav aria-label="Primary">
    <ul>
      {links.map(l => (
        <li>
          <a href={l.href} aria-current={path.startsWith(l.href) ? 'page' : undefined}>{l.label}</a>
        </li>
      ))}
    </ul>
  </nav>
</header>

<style>
  .site-header {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: var(--space-4); padding-block: var(--space-4);
    border-bottom: 1px solid var(--color-line);
  }
  .site-header__name { font-weight: 600; text-decoration: none; }
  ul { display: flex; gap: var(--space-4); list-style: none; margin: 0; padding: 0; }
</style>
```

```astro
---
// src/components/SiteFooter.astro
const year = new Date().getFullYear()
---
<footer class="page site-footer">
  <p>&copy; {year} Bryan Campana</p>
  <ul>
    <li><a href="/terms">Terms of Use</a></li>
    <li><a href="/privacy">Privacy Policy</a></li>
  </ul>
</footer>

<style>
  .site-footer {
    display: flex; justify-content: space-between; flex-wrap: wrap;
    gap: var(--space-3); margin-top: var(--space-7); padding-block: var(--space-4);
    border-top: 1px solid var(--color-line);
    color: var(--color-muted); font-size: var(--size-sm);
  }
  .site-footer p { margin: 0; }
  ul { display: flex; gap: var(--space-4); list-style: none; margin: 0; padding: 0; }
</style>
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/styles src/layouts src/components
git commit -m "feat: add design tokens, base layout, header and footer"
```

---

## Task 5: Placeholder and ProjectCard components

**Files:**
- Create: `src/components/Placeholder.astro`, `src/components/ProjectCard.astro`

**Interfaces:**
- Consumes: `Base.astro` styles, `projects` collection type
- Produces: `Placeholder` with props `{ aspect?: string; label?: string }`; `ProjectCard` with props `{ project: CollectionEntry<'projects'> }`

- [ ] **Step 1: Write the placeholder**

```astro
---
// src/components/Placeholder.astro
interface Props { aspect?: string; label?: string }
const { aspect = '3/2', label = 'Image placeholder' } = Astro.props
---
<div class="ph" style={`aspect-ratio:${aspect}`} role="img" aria-label={label}></div>

<style>
  .ph {
    width: 100%;
    background: var(--color-placeholder);
    border-radius: var(--radius-sm);
  }
</style>
```

- [ ] **Step 2: Write the project card**

```astro
---
// src/components/ProjectCard.astro
import type { CollectionEntry } from 'astro:content'
import Placeholder from './Placeholder.astro'
interface Props { project: CollectionEntry<'projects'> }
const { project } = Astro.props
const d = project.data
const href = d.featured ? `/work/${project.id}` : undefined
const meta = [d.role, d.year].filter(Boolean).join(' · ')
---
<article class="card">
  {href
    ? <a href={href} class="card__media"><Placeholder aspect={d.aspect} label={`${d.title} — image placeholder`} /></a>
    : <div class="card__media"><Placeholder aspect={d.aspect} label={`${d.title} — image placeholder`} /></div>}

  <h3 class="card__title">
    {href ? <a href={href}>{d.title}</a> : d.title}
  </h3>

  <p class="card__scope">{d.scope}</p>
  {d.designQuestion && <p class="card__question">{d.designQuestion}</p>}
  {meta && <p class="card__meta">{meta}</p>}
</article>

<style>
  .card { display: flex; flex-direction: column; gap: var(--space-2); }
  .card__media { display: block; }
  .card__title { font-size: var(--size-lg); margin-top: var(--space-2); }
  .card__title a { text-decoration: none; }
  .card__title a:hover { text-decoration: underline; }
  .card__scope { margin: 0; }
  .card__question { margin: 0; color: var(--color-muted); font-style: italic; }
  .card__meta { margin: 0; color: var(--color-muted); font-size: var(--size-sm); }
</style>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/Placeholder.astro src/components/ProjectCard.astro
git commit -m "feat: add Placeholder and ProjectCard components"
```

---

## Task 6: Work index

**Files:**
- Create: `src/pages/work/index.astro`

**Interfaces:**
- Consumes: `getCollection('projects')`, `ProjectCard`, `Base`
- Produces: `/work` route rendering all 14 projects grouped by category

- [ ] **Step 1: Write the page**

```astro
---
// src/pages/work/index.astro
import { getCollection } from 'astro:content'
import Base from '../../layouts/Base.astro'
import ProjectCard from '../../components/ProjectCard.astro'

const all = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order)
const groups = [
  { key: 'design', label: 'Design' },
  { key: 'art', label: 'Art' },
  { key: 'photography', label: 'Photography' },
] as const
---
<Base title="Work — Bryan Campana" description="Selected design, art, and photography projects.">
  <h1>Work</h1>

  {groups.map(g => {
    const items = all.filter(p => p.data.category === g.key)
    return items.length > 0 && (
      <section class="group" aria-labelledby={`group-${g.key}`}>
        <h2 id={`group-${g.key}`}>{g.label}</h2>
        <ul class="grid">
          {items.map(p => <li><ProjectCard project={p} /></li>)}
        </ul>
      </section>
    )
  })}
</Base>

<style>
  h1 { font-size: var(--size-2xl); margin-block: var(--space-6) var(--space-5); }
  .group { margin-bottom: var(--space-7); }
  .group h2 {
    font-size: var(--size-sm); text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--color-muted); padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-line); margin-bottom: var(--space-5);
  }
  .grid {
    list-style: none; margin: 0; padding: 0;
    display: grid; gap: var(--space-5);
    grid-template-columns: 1fr;
  }
  @media (min-width: 40rem) { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 64rem) { .grid { grid-template-columns: repeat(3, 1fr); } }
</style>
```

- [ ] **Step 2: Verify the build produces the route**

Run: `npm run build && test -f dist/work/index.html && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add src/pages/work/index.astro
git commit -m "feat: add work index grouped by category"
```

---

## Task 7: Case study template

**Files:**
- Create: `src/pages/work/[slug].astro`

**Interfaces:**
- Consumes: `getCollection('projects')`, `render()` from astro:content, `Base`, `Placeholder`
- Produces: `/work/<slug>` for each featured project (4 routes)

- [ ] **Step 1: Write the test**

Add to `tests/content.test.ts`:

```typescript
it('gives every featured project a body', () => {
  for (const f of files()) {
    if (frontmatter(f).featured !== 'true') continue
    const body = readFileSync(join(DIR, f), 'utf8').split('---').slice(2).join('---').trim()
    expect(body.length, `${f} body`).toBeGreaterThan(200)
  }
})
```

- [ ] **Step 2: Run it**

Run: `npm test`
Expected: PASS (Task 3 gave all four featured projects bodies). If it fails, the offending file is named — fix it before continuing.

- [ ] **Step 3: Write the template**

```astro
---
// src/pages/work/[slug].astro
import { getCollection, render } from 'astro:content'
import Base from '../../layouts/Base.astro'
import Placeholder from '../../components/Placeholder.astro'

export async function getStaticPaths() {
  const featured = (await getCollection('projects')).filter(p => p.data.featured)
  return featured.map(p => ({ params: { slug: p.id }, props: { project: p } }))
}

const { project } = Astro.props
const d = project.data
const { Content } = await render(project)

const facts = [
  ['Role', d.role],
  ['Year', d.year ? String(d.year) : null],
  ['Category', d.category],
].filter(([, v]) => v) as [string, string][]
---
<Base title={`${d.title} — Bryan Campana`} description={d.scope}>
  <article class="case">
    <header class="case__head">
      <p class="case__eyebrow"><a href="/work">Work</a></p>
      <h1>{d.title}</h1>
      <p class="case__scope">{d.scope}</p>
      {d.designQuestion && <p class="case__question">{d.designQuestion}</p>}
    </header>

    <Placeholder aspect="16/9" label={`${d.title} — hero image placeholder`} />

    {facts.length > 0 && (
      <dl class="case__facts">
        {facts.map(([k, v]) => (<div><dt>{k}</dt><dd>{v}</dd></div>))}
      </dl>
    )}

    <div class="case__body"><Content /></div>

    <Placeholder aspect="3/2" label={`${d.title} — supporting image placeholder`} />

    <p class="case__back"><a href="/work">&larr; All work</a></p>
  </article>
</Base>

<style>
  .case { display: flex; flex-direction: column; gap: var(--space-5); }
  .case__head { margin-top: var(--space-6); }
  .case__eyebrow {
    margin: 0 0 var(--space-3); font-size: var(--size-sm);
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-muted);
  }
  .case h1 { font-size: var(--size-2xl); margin-bottom: var(--space-3); }
  .case__scope { font-size: var(--size-lg); max-width: var(--measure-prose); margin: 0; }
  .case__question {
    margin: var(--space-3) 0 0; color: var(--color-muted);
    font-style: italic; max-width: var(--measure-prose);
  }
  .case__facts {
    display: flex; flex-wrap: wrap; gap: var(--space-5);
    margin: 0; padding-block: var(--space-4);
    border-block: 1px solid var(--color-line);
  }
  .case__facts dt {
    font-size: var(--size-xs); text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--color-muted);
  }
  .case__facts dd { margin: var(--space-1) 0 0; }
  .case__back { margin: 0; }
</style>
```

- [ ] **Step 4: Verify all four routes build**

Run: `npm run build && ls dist/work/`
Expected: directories for the 4 featured slugs, plus `index.html`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/work/[slug].astro tests/content.test.ts
git commit -m "feat: add case study template for featured projects"
```

---

## Task 8: Landing page

**Files:**
- Modify: `src/pages/index.astro` (replaces the Astro scaffold default)

**Interfaces:**
- Consumes: `getCollection('projects')`, `ProjectCard`, `Base`
- Produces: `/` route

The landing page routes visitors to the work. It does not try to impress.

- [ ] **Step 1: Write the page**

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content'
import Base from '../layouts/Base.astro'
import ProjectCard from '../components/ProjectCard.astro'

const featured = (await getCollection('projects'))
  .filter(p => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order)
---
<Base title="Bryan Campana — Designer" description="Designer working across signage, identity, and visual systems.">
  <section class="intro">
    <h1>Bryan Campana</h1>
    <p class="intro__lede">TODO_POSITIONING_STATEMENT</p>
    <p><a href="/work">See all work &rarr;</a></p>
  </section>

  <section class="featured" aria-labelledby="featured-heading">
    <h2 id="featured-heading">Selected work</h2>
    <ul class="grid">
      {featured.map(p => <li><ProjectCard project={p} /></li>)}
    </ul>
  </section>
</Base>

<style>
  .intro { margin-block: var(--space-7) var(--space-7); }
  .intro h1 { font-size: var(--size-2xl); margin-bottom: var(--space-4); }
  .intro__lede { font-size: var(--size-lg); max-width: var(--measure-prose); }
  .featured h2 {
    font-size: var(--size-sm); text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--color-muted); padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-line); margin-bottom: var(--space-5);
  }
  .grid {
    list-style: none; margin: 0; padding: 0;
    display: grid; gap: var(--space-5); grid-template-columns: 1fr;
  }
  @media (min-width: 40rem) { .grid { grid-template-columns: repeat(2, 1fr); } }
</style>
```

`TODO_POSITIONING_STATEMENT` is a deliberate content slot for Bryan, tracked in Task 10.

- [ ] **Step 2: Verify the build**

Run: `npm run build && test -f dist/index.html && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add landing page with featured work"
```

---

## Task 9: About, legal, and 404

**Files:**
- Create: `src/pages/about.astro`, `src/pages/terms.astro`, `src/pages/privacy.astro`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `Base`, `Placeholder`
- Produces: `/about`, `/terms`, `/privacy`, `/404` routes

Legal copy comes verbatim from `archive/content/terms-of-use.md` and `archive/content/privacy-policy-1.md`. About copy comes from `archive/content/about.md`.

- [ ] **Step 1: Write the about page**

```astro
---
// src/pages/about.astro
import Base from '../layouts/Base.astro'
import Placeholder from '../components/Placeholder.astro'
---
<Base title="About — Bryan Campana" description="About Bryan Campana.">
  <div class="about">
    <div class="about__portrait">
      <Placeholder aspect="4/5" label="Portrait placeholder" />
    </div>
    <div class="about__text">
      <h1>About</h1>
      <p>TODO_BIO — replace with copy from archive/content/about.md</p>
      <ul class="about__links">
        <li><a href="/resume.pdf" download>Download résumé (PDF)</a></li>
        <li><a href="mailto:bryanc9624@gmail.com">Email</a></li>
      </ul>
    </div>
  </div>
</Base>

<style>
  .about { display: grid; gap: var(--space-5); margin-block: var(--space-6); }
  @media (min-width: 48rem) { .about { grid-template-columns: 1fr 2fr; gap: var(--space-6); } }
  .about h1 { font-size: var(--size-2xl); margin-bottom: var(--space-4); }
  .about__links { list-style: none; margin: var(--space-5) 0 0; padding: 0; display: grid; gap: var(--space-2); }
</style>
```

Note: `/resume.pdf` will 404 until Bryan supplies `public/resume.pdf`. Tracked in Task 10.

- [ ] **Step 2: Write terms and privacy**

Both follow this shape, with `<h1>` and paragraphs copied verbatim from the archive:

```astro
---
// src/pages/terms.astro
import Base from '../layouts/Base.astro'
---
<Base title="Terms of Use — Bryan Campana" description="Terms of use.">
  <div class="prose">
    <h1>Terms of Use</h1>
    <p>PASTE_VERBATIM_FROM_ARCHIVE</p>
    <!-- source: archive/content/terms-of-use.md (lines 7+) -->
  </div>
</Base>

<style>
  .prose { margin-block: var(--space-6); max-width: var(--measure-prose); }
  .prose h1 { font-size: var(--size-xl); margin-bottom: var(--space-4); }
</style>
```

`src/pages/privacy.astro` is identical with the title, heading, and body swapped to the
privacy policy copy from `archive/content/privacy-policy-1.md` (lines 7+).

- [ ] **Step 3: Write the 404**

```astro
---
// src/pages/404.astro
import Base from '../layouts/Base.astro'
---
<Base title="Not found — Bryan Campana" description="Page not found.">
  <div class="prose">
    <h1>Not found</h1>
    <p>That page doesn't exist. Try <a href="/work">the work</a>.</p>
  </div>
</Base>

<style>
  .prose { margin-block: var(--space-7); max-width: var(--measure-prose); }
  .prose h1 { font-size: var(--size-xl); margin-bottom: var(--space-4); }
</style>
```

- [ ] **Step 4: Verify all routes build**

Run: `npm run build && ls dist/about dist/terms dist/privacy dist/404.html`
Expected: all present.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro src/pages/terms.astro src/pages/privacy.astro src/pages/404.astro
git commit -m "feat: add about, legal, and 404 pages"
```

---

## Task 10: Site config, content TODO report, and verification

**Files:**
- Modify: `astro.config.mjs`
- Create: `scripts/content-todos.mjs`, `CONTENT-TODO.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: everything above
- Produces: a verified build and a checklist of Bryan's outstanding content

- [ ] **Step 1: Set the site URL and enable the sitemap**

```bash
npm install @astrojs/sitemap
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://bryancampana.com',
  integrations: [sitemap()],
})
```

- [ ] **Step 2: Write the TODO reporter**

```javascript
// scripts/content-todos.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const roots = ['src/content/projects', 'src/pages']
const hits = []

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) { walk(p); continue }
    if (!/\.(md|astro)$/.test(e.name)) continue
    readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
      const m = line.match(/TODO_[A-Z_]+|PASTE_VERBATIM_FROM_ARCHIVE/)
      if (m) hits.push(`- [ ] \`${p}:${i + 1}\` — ${m[0]}`)
    })
  }
}
roots.forEach(walk)

const body = `# Content TODO\n\nGenerated by \`npm run todos\`. ${hits.length} item(s) outstanding.\n\n${hits.join('\n')}\n\n## Also needed\n- [ ] \`public/resume.pdf\` — résumé file\n- [ ] Real images (Phase 4) to replace gray placeholders\n`
writeFileSync('CONTENT-TODO.md', body)
console.log(`${hits.length} content TODO(s) — see CONTENT-TODO.md`)
```

```bash
npm pkg set scripts.todos="node scripts/content-todos.mjs"
```

- [ ] **Step 3: Run the full verification**

Run: `npm test && npm run build && npm run todos`
Expected: all tests PASS, build exits 0, `CONTENT-TODO.md` written listing every `TODO_*` slot.

- [ ] **Step 4: Verify accessibility basics by inspection**

Confirm in `dist/work/index.html`:
- exactly one `<h1>`
- `<main id="main">` present
- skip link is the first focusable element
- every `role="img"` placeholder has a non-empty `aria-label`

- [ ] **Step 5: Commit and push**

```bash
git add -A
git commit -m "feat: add sitemap, site URL, and content TODO reporter"
git push
```

- [ ] **Step 6: Verify the Netlify deploy**

Expected: Netlify build succeeds; preview URL serves `/`, `/work`, the 4 case studies, `/about`, `/terms`, `/privacy`. **This is the Phase 2 gate — Bryan reviews structure, not styling.**

---

## Out of scope for this plan

- DNS cutover (spec Phase 5) — separate, requires Bryan's explicit go-ahead
- Real image assets (spec Phase 4) — sourced from Google Drive
- Visual design (spec Phase 6) — Figma tokens replace `tokens.css` values
- Bryan's copy: design questions, positioning statement, bio, Oscuro scope, résumé PDF
