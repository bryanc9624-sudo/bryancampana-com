# Decisions

Shared ledger between the three Claude Code chats working on this project.
All three live in this folder. Two write to it; the third audits it — see the table.

| Chat | Owns | Writes to |
|---|---|---|
| **Design and Figma** | What the site looks like — layout, type, colour, spacing, card direction | Figma + the "Open" section below |
| **Code and Deploy** | Making the site match — code, tests, build, deploy. Also hosting, DNS, domain and build-credit budget: Bryan folded those in on 2026-09-07 rather than run a third owner. | The repo + the "Settled" log below |
| **Oversight** | Nothing. Audits the other two against the repo and reports to Bryan. Read-only on code and on both chats' sections. Charter: `docs/oversight-charter.md` | The "Sync audits" section below, and nothing else |

## The rules

1. **Read this file before asking Bryan anything.** If the answer is here, use it.
2. **Never ask a question the other chat owns.** Route it instead: add it to "Open
   decisions" and tell Bryan which chat it belongs to. He is not a message bus.
3. **Design decisions are not real until they are written here or visible in Figma.**
   A decision made only in conversation is invisible to the other chat forever.
4. **Code and Deploy never invents design.** If Figma doesn't say, it stays a placeholder.
5. **Preview before pushing.** Bryan reviews a local build before anything deploys.
6. **"Live site" means bryancampana.netlify.app.** bryancampana.com is still served by
   Cargo. The DNS cutover is Phase 5 and needs Bryan's explicit go-ahead.

## Keeping this file in sync — both chats follow this

This file lives on `main` and both chats commit to it directly. Bryan gave standing
permission for that on 2026-09-07, precisely so it stops going stale on a side branch.
That removes the worst failure mode but not all of them, so:

7. **`git pull` before you read it. Push immediately after you write it.** The window
   between your edit and your push is the window where the other chat can be wrong. Keep
   it to seconds, not days.
8. **Anything you read more than a few minutes ago is stale.** Git does not notify you of
   changes — you have to go and fetch them. Re-read before acting on something here,
   especially before telling Bryan a decision is still open.
9. **Edit only your own sections.** Design and Figma owns "Open decisions — Design and
   Figma" and adds its own dated entries to "Settled". Code and Deploy owns its own open
   list. Never rewrite the whole file; make targeted edits so conflicts stay small and
   obviously mechanical.
10. **If your push is rejected, pull and re-apply your change.** Never force-push this
    file — a force-push here silently deletes the other chat's work, which is the one
    failure mode git would otherwise have caught for you.
12. **Builds cost money — tag them.** A push only triggers a Netlify build when the
    commit message contains `[deploy]`; `netlify.toml`'s `ignore` command skips the rest
    before the build starts. Batch work, then tag one commit. Free tier is 300 credits
    per cycle and the cycle runs the 7th to the 6th, not the calendar month.

11. **Date every Settled entry** and add new ones at the top of "Settled", so two chats
    appending at once conflict in a place that is trivial to resolve.

13. **"Sync audits" belongs to Oversight — do not edit it.** A third chat audits this
    ledger against the repo and records what it finds there. Read it; treating one of its
    findings as wrong is fine, but correct the entry it points *at*, in your own section,
    rather than editing the audit. Oversight writes nowhere else in this file.

---

## ⚠ Read this before trusting anything below — 2026-09-07, Design and Figma

Three facts in the previous version of this ledger were out of date. Corrected here so
neither chat plans against them:

1. **Figma is on Professional, not Starter.** The token collection now has **two variable
   modes: `Desktop` and `Mobile`.** The mode axis is *breakpoint*, not theme — it exists
   to carry responsive display type (see Settled). Dark mode, if it ever comes into Figma,
   needs its own collection rather than another mode on this one. The code's dark palette
   is unaffected and still switches on `prefers-color-scheme`.
2. **The design question is not on the card and never will be.** Bryan decided this
   directly. Code and Deploy's recorded opinion — "design question promoted above the
   scope line" — is therefore moot rather than overruled; it was a reasonable read of a
   file that had since moved on. No hard feelings intended in either direction.
3. ~~**`docs/figma-to-code-spec.md` is NOT on `main`.**~~ **STALE — corrected 2026-09-07.**
   It **is** on `main` now (commits `da518a0`, `370d5f0`) and Code and Deploy can read it.
   The spec itself is also partly out of date where later decisions overtook it — the
   filter chips in its §6 were reverted to text links, and its §1.2 describes the Figma
   frame rather than the built site. **`DECISIONS.md` wins wherever the two disagree.**

---

## Open decisions — Design and Figma owns these

- [x] ~~**Credit line on the project card.**~~ **SCRAPPED by Bryan 2026-09-07.** They are not his clients — the relationship is an employer's client, a venue, a studio or a building in most cases, and calling any of them a client would misrepresent the work. No schema field, no card change, nothing to draw. The analysis below is kept only so the question is not raised a third time.

- [ ] ~~Original item:~~
      Raised by Bryan 2026-09-07 after looking at C&G Partners, whose cards carry the
      client name under the title. The credibility is real and currently invisible: names
      like NewYork-Presbyterian and NYU Langone sit only in body prose on four case-study
      pages, so a recruiter scanning `/work` never sees them.

      **Three things to decide before it can be built:**

      1. **What the field is called, because "client" is wrong for half of them.** The
         relationship differs by project:
         | Project | Name | Relationship |
         |---|---|---|
         | Dura Architectural Signage | NewYork-Presbyterian, NYU Langone Health | client of the employer |
         | 590 Madison Ave | 590 Madison Avenue | the building; Dura was the employer |
         | Big City Volleyball | Big City Volleyball | client |
         | TogetherEffect | TogetherEffect | client |
         | re:present, re:semblance | New Media Artspace | **venue**, not client |
         | Photopolymer Letterpress | Robert Blackburn Printmaking Workshop | **studio** where it was made |
         | Double Exposed | Treat Gallery, Dodomu Gallery | **venues** it was shown at |
         | Memory Strip, Transmute, The City That Slept, Two of Hearts, Shapes and Colors, Oscuro | — | **nothing to credit** |

         A single `client` field would force a venue or a studio to be called a client.
         Something like `credit` is more honest, or the label lives in the value itself.

      2. **Six of fourteen cards would have no credit line.** Not a small minority. The
         card has to look deliberate when the line is absent, not like a missing field.

      3. **Whether more than one name can appear.** Dura has two, Double Exposed has two.
         Truncate, pick one, or allow a list.

      Code and Deploy will add the schema field and wire it once the card is drawn; the
      data above is already recoverable from `archive/content/`. Not started, since the
      card is Figma's.

      *Context:* C&G Partners runs two filter axes — Services and Industries — which suits
      a firm selling to institutions. Not proposed here: 14 projects across 6 keywords
      average 2.3 each, and a second axis would fragment that into mostly-empty cells.
      Their card metadata is the borrowable part, not their taxonomy.

- [x] **DONE — dark palette applied 2026-09-07.** The values were already settled in
      "Colour VALUES settled" and Code and Deploy had missed them, reporting the item as
      open against a stale list. Now implemented from that table: bg #0F0C0F, fg #FFFFFF,
      muted #A4A4A4, line #2D2A2D, placeholder #1E1C1F, focus and accent #DD51FF.
      Contrast re-verified independently and matches the design chat's figures to two
      decimal places. Original: **Dark mode is now inconsistent with the light palette.** The light palette went
      plum on 2026-09-07 (`fg #361a38`, `muted #7e6f7e`, `line #d4cad4`, `focus #9600dd`)
      but the dark palette in `tokens.css` is still the original neutral greys
      (`#101010 / #f2f2f2 / #a0a0a0 / #2a2a2a`), so a visitor whose system is set to dark
      sees an unrelated colour scheme. Figma cannot express this — its two variable modes
      are Desktop and Mobile, and Figma Starter allows no more — so dark values have to be
      stated directly. Code and Deploy will not invent them. Six values needed:
      bg, fg, muted, line, placeholder, focus.
- [x] **RESOLVED — `color/accent` marks the selected filter link.** The FilterLink
      decision answered it: "when the colour system lands, the selected label takes
      --color-accent in place of --color-fg". The colour system has landed, so it is
      applied there and nowhere else. If accent should mark anything further, say what.
      Original question: **What did `color/accent` mark?** New in Figma 2026-09-07, `#9600dd`, identical to
      `color/focus`. Added to `tokens.css` as `--color-accent` so it stays in sync, but
      applied to nothing — Figma does not say what it is for, and choosing would be a
      design decision. Name the elements and it gets applied.

- [x] ~~**Video facade — visual treatment.**~~ **DRAWN 2026-09-07** — see Settled, "Video
      facade drawn". Component `VideoFacade` on Figma page 04. The key change: the ground is
      `--color-fg` (ink), **not grey**, because grey is this site's placeholder colour and a
      grey video block reads as a missing image rather than something pressable. Label stays
      bottom-left, sans, `--color-bg`, taking `--color-accent` on hover. No icon.
      **Code and Deploy: ready to restyle.** Poster question answered: where a still exists it
      replaces the fill; where none exists the ink block stands on its own as a deliberate
      state, so no fallback to the first project photograph is needed.
- [ ] **Video poster stills** *(Bryan's, not blocking — the ink ground is a deliberate state).* Related but Bryan's, not Design's: the three video projects
      have no dedicated poster frame. Currently reusing the first project photograph, and
      two of the three have no photographs at all, so they show a grey box.

- [x] **DONE — filter control is now text links.** Implemented 2026-09-07. Original: **Filter control: chips reverted to text links.** Bryan is reverting the bordered
      chip treatment in favour of the text-link option (2026-09-07). **This is a code
      change, not only a Figma one** — `/work` currently renders `.chip` with a border,
      padding and a `--color-fg` border on the checked state. Text links need different
      CSS for the selected state, since there is no border to change.
      Code and Deploy will restyle once the treatment is settled in Figma; the filter
      mechanism itself (radio inputs, `:has()`, `~=` matching) is unaffected.
      Likely knock-on: this may resolve the mobile overflow item above on its own —
      text links wrap far more compactly than bordered chips, which is what pushed the
      first project ~700px down at 390px.

- [x] **RESOLVED — filter overflow.** Text links plus six keywords put the filter at 94px on a 390px viewport with the first project 334px down, against roughly 700px with chips. Original: **Filter chip overflow on mobile.** 8 keywords wrap to 5 rows at 390px, pushing the
      first project roughly 700px down the page — a wall of chips before any work. The
      reference Bryan supplied had a `(More)` affordance for exactly this; it is not yet
      designed. Counts are implemented and live. Code and Deploy will build whatever is
      drawn; it will not invent the interaction.

- [x] ~~**Colour.**~~ **DONE 2026-09-07** — see Settled, "Colour VALUES settled". Both modes,
      all seven tokens, contrast verified. **Code and Deploy: the hold is lifted.** Bryan
      resolved both open questions on the bench: paper is **pure white**, not warm; and the
      charge sits on the **violet** side of the ink, not the magenta side.
- [x] **CLOSED — radius stays 0**, derived from IBM Plex Sans's square corners. See Settled, "Droplet". Original: **Radius.** `radius/sm` and `radius/md` are both `0`. The only place radius is
      visible is `FilterChip`; every other surface is a hairline or a plain block. Bound
      to the tokens, so it is a one-value change.
      *Merged into the chip-overflow item above — counts are now built and live, so the
      only part still undesigned is the overflow behaviour.*
> **Colour and radius are UNBLOCKED as of 2026-09-07.** They were held until the typeface
> landed so they would be judged once against the real face rather than twice against Inter.
> IBM Plex Sans is now in, so that condition is met and both are live design work again.
> Until they are decided, Code and Deploy should still ship the current placeholder values
> and **not** substitute anything — rule 4 still applies.

### Waiting on Bryan, not on either chat

- [x] ~~**Typeface.**~~ **DONE 2026-09-07** — see Settled, "Typeface swap executed in Figma".
      Nothing outstanding on Bryan for type. The New Frank / Adobe Fonts material that stood
      here is obsolete and has been removed rather than left to mislead.

## Open decisions — Code and Deploy owns these

Routed here rather than through Bryan, per rule 2.

- [ ] **`tokens.css` still sets body copy in the serif — it contradicts the settled type
      decision.** *Raised by Design and Figma 2026-09-07; typography is Design's to state,
      the CSS edit is Code and Deploy's to make.*

      `src/styles/tokens.css:24` reads `--font-body: var(--font-serif);` and
      `src/styles/base.css:19` applies it to `body`, so **every piece of body copy on the
      built site currently renders in IBM Plex Serif.**

      That is the arrangement Bryan looked at and rejected. The Settled entry
      "Serif/sans pairing: IBM Plex Serif with IBM Plex Sans" is explicit: **serif for
      titles only; sans for everything else** — body, scope, the design question, and the
      small label tier.

      **How it drifted, so it is not read as anyone's error.** Commit `35be25c`
      ("Serif pairing and the redrawn video facade") set `--font-body` to the serif, which
      was correct against the ledger *at that moment*. Bryan reversed the decision
      afterwards, logged in `f027101` ("Scrap the credit line; serif is titles only").
      No commit has touched `tokens.css` since `35be25c`, so the code is simply sitting one
      decision behind. Ordinary drift, not a mistake.

      **The change is two lines:**

      ```css
      --font-body: var(--font-sans);     /* was var(--font-serif) */
      --font-display: var(--font-serif); /* unchanged — titles keep the serif */
      ```

      The comment block above those lines ("Serif for anything read; sans reserved for the
      small label tier") describes the reversed decision and should be rewritten to match,
      or it will pull the values back again.

      Worth a look on the built page rather than only in the diff: this changes the texture
      of every project page and the landing statement at once.

- [x] ~~**Merge `claude/website-design-figma-l3milr` into `main`.**~~ **DONE — verified
      2026-09-07.** `docs/figma-to-code-spec.md` is on `main`; nothing is blocked on it.
- [x] **CLOSED — superseded.** `layout` now selects the project page layout and `discipline` is a label only, so there is no longer a question of deriving layout from content. Original: **Discipline source.** The project page has two layouts (standard / photography) and
      needs one canonical discipline value to switch on. Either `keywords[0]` or a separate
      `discipline` field — do not infer layout from an unordered array. Code and Deploy's
      call; Design and Figma has no preference beyond "it must be deterministic."
- [x] **CLOSED — both exist.** `year` is a numeric sort key, `completed` is the displayed string. Implemented in the schema migration. Original: **`year: number` vs `completed: string`.** The live site shows *September 2025* for
      Dura and *2019* for Oscuro. The current numeric `year` cannot hold the former.
      Widen it, or add `completed` and keep `year` as a sort key.
- [x] ~~**Adobe Fonts domain coverage.**~~ **RETRACTED by the chat that raised it, 2026-09-07.**
      Dead with the move to IBM Plex Sans — a Google font has no allowed-domains list, so
      there is nothing to configure and no silent-failure risk on localhost or either
      domain. Struck rather than deleted only because it is not this chat's section to
      tidy. Original text kept below for traceability; **do not action it.**

      ~~*Raised by Design and Figma 2026-09-07; hosting and
      domains are Code and Deploy's per the ownership table.* The web project
      (`https://use.typekit.net/udc5guh.css`, family `new-frank`) currently covers **one
      domain** — Bryan reports the UI would not accept a second. Three are needed over the
      project's life:

      | Domain | Why | When |
      |---|---|---|
      | `bryancampana.netlify.app` | currently the live site | now |
      | `localhost` | rule 5 requires a local preview before every deploy | now |
      | `bryancampana.com` | the eventual home | at DNS cutover |

      **Adobe Fonts failures are silent** — the page renders in the fallback and nothing
      errors. Without `localhost`, every local preview shows the wrong typeface, which makes
      rule 5 useless for judging type. Worth confirming whether the domains field genuinely
      accepts only one entry (it may accept several separated by newlines) before creating a
      second web project as a workaround.

> *Note from Design and Figma, 2026-09-07:* the three items above this one — the branch
> merge, discipline source, and `year`/`completed` — all appear to have been settled in the
> log below. Not editing them, since this is not my section; flagging so they can be ticked.

---

## Sync audits — Oversight owns this section

Findings from auditing this ledger against the repo. Newest at top, dated. Written only
when something needs the other chats' attention; a clean audit is not recorded here.

*No audits recorded yet.*

---

## Settled

### 2026-09-07 — Design questions leave Design and Figma's list. **Bryan's call.**

Bryan took direct ownership of writing the 14 design questions and asked for them off this
chat's list completely. They were never a design decision, only a content one that had been
parked in a design section because the layout needed sentence lengths to test against.

**Consequence for both chats: this is no longer a tracked item and no longer a launch
dependency.** The previous framing called it "the long pole on launching" — that framing is
withdrawn. The field is optional, ships blank, and renders nothing when empty.

The placeholder questions in Figma are still placeholder text and must not reach the site.
See "Design questions — Bryan owns these outright" below for the house style and the
worksheet, kept as reference only.


### 2026-09-07 — Horizontal rules get a hierarchy. **Bryan's call. Done in Figma.**

Bryan's read was that there were too many rules and they were all identical. The second half was
literally true: every rule in the file was a 1px `color/line` hairline, so the header, the footer,
the landing eyebrow and the project-page facts block all carried the same mark and none of them
meant anything by it. Two changes:

**1. The header rule is now ink.** The `SiteHeader` component's bottom stroke rebinds from
`color/line` to `color/fg`, on all three variants (None / Work / About). Weight stays **1px** —
Bryan asked for prominence without thickness, and darkening does that on its own. This propagates
to every instance on both breakpoints.

**2. The facts block keeps its top rule and loses the bottom one.** On
`Project Page — Desktop 1600` the `facts` frame had rules above *and* below. The bottom one is
removed. Top was the one to keep because the **photography project page already used top-only**,
so all three project layouts now agree rather than two of them being the odd ones out. Applied to
the featured and light-no-body layouts at both 1600 and 390.

**The resulting vocabulary — three levels, and this is the whole set:**

| Rule | Colour | Weight | Where | What it means |
|---|---|---|---|---|
| Header | `color/fg` | 1px | Under `SiteHeader`, every page | The site chrome ends here |
| Section | `color/line` | 1px | Above `facts`; under the landing `Eyebrow` | One block of content ends, another begins |
| Footer | `color/fg` | 1px | Above `SiteFooter`, every page | The site chrome ends here |

**3. The footer rule is ink too — the page is bracketed.** Bryan's call, 2026-09-07. Chrome is
ink at both ends of the page; hairlines exist only *inside* the content. That collapses the
vocabulary to **two levels, not three**, which is the right number for a site this size: a rule
is either the edge of the page or a break within it. The footer is chrome, not content, so
filing it in the section tier was the actual mistake — not the header being too quiet.

**Code and Deploy — two colour swaps and one deletion, no new tokens.**
`--color-line` → `--color-fg` on the header's `border-bottom-color` and the footer's
`border-top-color`; delete the rule below the facts list. Both tokens already exist.
The landing eyebrow and the facts rule stay `--color-line` and are now the only hairlines
on the site.

### 2026-09-07 — Serif/sans pairing: IBM Plex Serif with IBM Plex Sans. **Bryan's call. In Figma.**

**IBM Plex Serif for titles only**; **IBM Plex Sans for everything else** — body, scope,
the design question, and the small label tier. Bryan set this 2026-09-07 after seeing serif
body text in situ and preferring the sans. Sans now appears on exactly two styles — `Eyebrow` and `Label` — which are the
eyebrows and fact-pair labels Bryan named.

Two new Figma variables map to CSS properties that already existed in `tokens.css` and were
previously unused:

| Variable | Value | CSS |
|---|---|---|
| `font/display` | IBM Plex Serif | `--font-display` |
| `font/body` | IBM Plex **Sans** | `--font-body` |
| `font/family` | IBM Plex Sans | `--font-sans` *(unchanged)* |

**Serif** (`font/display`): Display 2XL, Display XL, Title Large, Body Strong — SemiBold.
Body Strong is the wordmark, which counts as a title.
**Sans** (`font/body` and `font/family`): Body, Body Large, Body Small, Question, Eyebrow, Label.

Bryan changed this by editing one variable value — `font/body` — and every bound style followed.
That is the type system working as designed.

**Code and Deploy — this is now a smaller change than it was.** `tokens.css` already defines
`--font-body: var(--font-sans)`, which is exactly right again, so **only `--font-display` needs
to change** — to IBM Plex Serif. `--font-sans` becomes IBM Plex Sans.
Weights: **Serif SemiBold 600 only** (titles are the sole serif use); Sans Regular 400,
Medium 500, Italic 400.

**Superseded intermediate:** Crimson Text was applied first and swapped out the same day when
Bryan realised Plex had a serif. The swap also solved a real problem rather than just being
tidier — Crimson has a markedly smaller x-height, so at identical pixel sizes the body and scope
text read too small and a `size/*` bump was going to be needed. **Plex Serif shares its x-height
and metrics with Plex Sans, being the same superfamily, so the existing size ramp holds
unchanged.** No token adjustment required.

### 2026-09-07 — Video facade drawn. **Ready to implement.**

Component `VideoFacade` on page 04. Three New Media projects use it.

- **Ground is `color/fg` (ink), not grey.** Grey is the placeholder colour on this site, so a
  grey video block reads as a missing image rather than something you can press. This was the
  actual problem with the current treatment.
- **Label bottom-left, sans, `color/bg`** — a `Label` text property so it can carry a duration
  later. On hover it takes `color/accent`, like every other interactive element.
- **No icon.** The design has no icon language anywhere, and three videos do not justify
  inventing one.
- Where a project has a poster still, the image replaces the fill and the label sits over it.
  Two of the three have no still — those show the ink block, which is a deliberate state rather
  than a gap.


### 2026-09-07 — "Droplet" — a reserved shape motif. Named, not applied.

Vocabulary so both chats mean the same thing. **The droplet** is three rounded corners with
one square. **The nib corner** is the square one, and it goes **top-left** — it is where the
pen touched down and the ink ran right and down, which is also how the page reads. It is also
the corner that touches the grid, so keeping it square holds the image to its column and row.

**Currently applied to nothing, deliberately.** Considered for the project card images and
rejected: Bryan's photography is architectural — right angles, window grids, stone — and a
rounded frame fights that content. There is also a threshold problem, in that a radius small
enough not to crop the composition is too small to read as intentional.

**Do not introduce an element in order to use it.** If a real button ever appears in the
design, the droplet is its shape. Until then it stays a named idea. `radius/sm` and
`radius/md` remain 0 and radius is no longer an open decision.


### 2026-09-07 — Radius stays 0, derived from the typeface. **Measured, not defaulted.**

Bryan asked whether the radius could be matched to the curvature of a round glyph in IBM Plex
Sans. It can be measured, and the answer is zero — but not for the reason it looks like.

**What was measured.** The glyphs were flattened to vectors and the curvature computed from the
bezier data at a 1000px em. The `o` is 466 x 540, with a radius of curvature of **288 units at
top and bottom** and **464 at the sides** (0.29em and 0.46em).

**Why that does not transfer.** As a ratio, the `o`'s radius is **0.62x its own width**. Applied
to a rectangle that produces a pill, not a rounded corner. A round glyph is all curve; a rounded
rectangle is mostly straight. The measurement is real, it just answers a different question.

**What the typeface actually says about corners.** The `n` stem is `M 80 528 L 0 528 L 0 12
L 80 12` — pure line commands, sharp joins. The `D` is the same inside and out. **IBM Plex Sans
has square corners with no rounding anywhere in its construction.**

So `radius/sm` and `radius/md` stay at **0**, now justified by the face rather than left unset.
Both variable descriptions in Figma carry the derivation so the values are not "corrected" later.

**If a non-zero micro-radius is ever wanted**, the defensible value is the stem width: 80 units
per 1000px em = **0.08em**, roughly 1.4px at 17px body text. Not currently applied.


### 2026-09-07 — Colour VALUES settled. **Bryan's call. In Figma. Ready to implement.**

Chosen on a live bench against his own photographs, every pair contrast-checked. The system
these fill is the entry "Colour SYSTEM agreed" below; nothing about the structure changed.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | `#0F0C0F` | paper / ground |
| `--color-fg` | `#361A38` | `#FFFFFF` | ink; dark takes the light paper |
| `--color-accent` | `#9600DD` | `#DD51FF` | **new token** — the charge |
| `--color-muted` | `#7E6F7E` | `#A4A4A4` | diluted ink |
| `--color-line` | `#D4CAD4` | `#2D2A2D` | construction line |
| `--color-placeholder` | `#F0F0F0` | `#1E1C1F` | unworked paper |
| `--color-focus` | `#9600DD` | `#DD51FF` | the containment ring — same as the charge |

Contrast, measured: ink on paper **15.44**, charge on paper **6.28**, text on dark ground
**19.43**, charge on dark ground **6.19**, muted on paper **4.72**. All pass at body size.

**In Figma:** the six existing variables carry the light values, and `color/accent` is created
with scopes `TEXT_FILL, STROKE_COLOR` and code syntax `var(--color-accent)`. **Dark values are
NOT in Figma** and cannot be — that collection's modes are Desktop/Mobile, a breakpoint axis.
The table above is the source of truth for dark.

**Naming, per Bryan:** variables stay named for *where the colour is used*, never for the
colour itself. The existing `color/bg` … `color/accent` scheme already satisfies this, and it
is why two hue changes cost nothing to absorb. In conversation the roles are paper / ink /
charge; in the file they are bg / fg / accent.

**Two things to know rather than fix:**

1. **Both accent values sit outside sRGB and are clipped.** The hexes above are the clipped
   results and are exactly what ships, so this is not a defect — but chroma above roughly 0.26
   produces no further visible change, so there is no more saturation available in that hue.
2. **The dark ground is effectively neutral.** Bryan settled its chroma at 0.006, so `#0F0C0F`
   is a near-black with a violet cast that is barely perceptible. The concept's "the purple
   becomes the space" is therefore not literally happening in dark mode; the purple lives in
   the light-mode ink and in the charge. Deliberate — it was the safest answer to the risk of
   a saturated ground fighting the warm photography.

### 2026-09-07 — Keywords consolidated from eight to six. **Bryan's call. Content change.**

**Code and Deploy: this is the change to make in `src/content/projects/*.md`.**

| Project | From | To |
|---|---|---|
| `590-madison-ave` | ADA Signage Design | **Signage** |
| `dura-architectural-signage` | Visual Communications | **Signage** |
| `big-city-volleyball` | Brand Identity | **Identity** |
| `togethereffect` | Brand Identity | **Identity** |
| `resemblance-1` | Exhibition Design | **Identity** |
| `represent-1` | Exhibition Design, Digital Communications | **Identity, Digital** |
| `photopolymer-letterpress` | Fine Art | Fine Art *(unchanged)* |
| `double-exposed-1`, `oscuro`, `shapes-and-colors`, `two-of-hearts` | Photography | Photography *(unchanged)* |
| `memory-strip`, `the-city-that-slept`, `transmute` | New Media | New Media *(unchanged)* |

Resulting counts: Photography 4, Identity 4, New Media 3, Signage 2, Digital 1, Fine Art 1.
Four singletons become one. Fine Art stays at 1 because Photopolymer Letterpress is not the
only fine art work for long — Bryan has more coming.

Card keyword labels in Figma are relabelled to match on all 18 cards across both breakpoints.

**This probably closes the `(More)` item.** Measured on the mobile work index at 390px:
chips ≈ 700px before the first project; eight text links 377px; **six text links 309px**, with
the filter at three rows. Worth Bryan looking at the built site before any overflow
affordance is designed, because it may no longer be a problem worth solving.

### 2026-09-07 — Keyword filter reverted to text links. **Bryan's call. Drawn in Figma.**

Bordered chips are out. The Figma component is renamed **`FilterLink`** and both work index
frames are rebuilt with the real eight keywords and their counts. **Code and Deploy: this is
ready to restyle.** The mechanism is unchanged — radio inputs, `:has()`, `~=` matching.

- **No box.** Border, padding and radius removed. Chips were the only rectangles on the site
  and read as heavy chrome against a design that is otherwise hairlines and type.
- **Selected differs by weight *and* colour** — `Body / Strong` 600 plus `--color-fg`, against
  `Body` 400 plus `--color-muted`. Two cues, so the state does not depend on colour alone.
- **Counts are superscript**, top-aligned, in `--color-muted` at `--size-xs`.
- **When the colour system lands**, the selected label takes `--color-accent` (the charge)
  in place of `--color-fg`. Nothing else changes.

**Measured, not assumed.** Desktop: all nine fit on **one line** — 1313px of 1392 available.
Mobile at 342px: **six rows, 202px**, first project starting **377px** down the page, against
roughly 700px with chips. Roughly halved.

### 2026-09-07 — Open: the keyword set may be too granular for 14 projects.

Raised by Design and Figma; **the call is Bryan's**, since it is editorial rather than visual.

Current counts: Photography 4, New Media 3, Brand Identity 2, Exhibition Design 2, Visual
Communications 1, ADA Signage Design 1, Digital Communications 1, Fine Art 1.

**Four of the eight keywords match exactly one project.** A filter option that returns a single
item does little for the visitor, and those four are also the longest labels — *Digital
Communications* alone is 192px, more than half the mobile content width.

This is the actual cause of the mobile wall. No treatment fixes a 22-character keyword on a
342px screen; the text-link revert already took out as much as presentation can. The remaining
options are consolidating the vocabulary, or designing the `(More)` affordance from Bryan's
reference. Consolidation would fix mobile **and** make the filter more useful, so it should be
decided before more design effort goes into overflow behaviour.

### 2026-09-07 — Colour SYSTEM agreed. Values still open. **Bryan's concept.**

The structure below is settled and will not change with the hex values, so Code and Deploy
can prepare against it. **The values are not chosen yet** — do not implement colours.

**Three roles: paper, ink, charge.** From Bryan's own framing — ink drawn on paper, and ink
with energy running through it. It is not decoration; it generates the rules below.

**The two modes are one palette inverted**, not two themes:

| Role | Light | Dark |
|---|---|---|
| Paper — ground | soft warm white | deep purple, near-black |
| Ink — body text | deep purple | the light mode's paper colour |
| Drawn charge — link at rest | ink colour, **weight 500**, underline | same |
| Full charge — hover | charge colour | charge colour, **glowing** |

Dark mode uses a near-white ink rather than a light purple: a tinted body text reads as
gimmicky and loses contrast. The purple moves into the ground instead.

**Link states, and why the underline carries them.** An underline is *more ink* — the same
substance applied differently — so the mark changes state without changing substance. Rules:

- Underline is present in **both** modes. Only the atmosphere differs. If dark mode signalled
  links by glow alone it would be the less accessible of the two modes.
- Thickness is `text-decoration-thickness: from-font` — Plex's own underline metric, drawn to
  match its stem weight — with a deliberate `text-underline-offset` so it clears descenders.
- Hover changes **colour only**; it does not thicken. Once the underline is at stem weight,
  thickening is a second signal doing the first one's job.
- Weight (400 → 500) lives in the **rest** state, never on hover — a weight change on hover
  reflows the text under the cursor.
- Underlines are for **inline text links only** — nav, footer, prose, back links. **Not card
  titles**: the whole card is the target, and 14 underlined titles turn the work index into a
  page of stripes.

**Focus must stay visually distinct from hover.** Different states, different users: hover is
for pointers, focus is for keyboards and screen magnifiers. In the concept it is the
containment ring — the boundary drawn around the area being worked in.

**The three secondary tokens now have rules rather than being picked by eye:** `muted` is
diluted ink (same hue, less of it), `line` is the construction line (diluted further), and
`placeholder` is **unworked paper** — space reserved for something not yet drawn, which is
literally what those boxes are.

**Code and Deploy — one new token is required.** The current six have nowhere for a brand
colour to live. The charge needs `--color-accent`, with a distinct value per mode (brighter in
dark). No other new properties.

Working bench, for reference only — not a source of truth:
`https://claude.ai/code/artifact/e58e4cfd-7500-47d2-95ef-a8a75b3be63e`

### 2026-09-07 — Video is embedded as a facade, not an iframe. **Bryan's call (option B).**

Three projects carry video: The City That Slept (Vimeo 414786969), Memory Strip
(YouTube KA3hHoIYmZs) and Transmute (YouTube gpXjXkM5byU). All three links were recovered
from the Cargo archive.

A plain provider iframe pulls roughly a megabyte of third-party JavaScript on page load
whether or not anyone watches — more than every image on this site combined — and sets
third-party cookies while doing it. The facade renders a poster and a play button and
creates the iframe only on click.

**This is the only JavaScript on the site**: 416 bytes, inline, and only on the three
video pages. Every other page ships zero script tags. It is a deliberate exception to the
no-client-JS constraint, because inline playback genuinely requires it. YouTube embeds use
youtube-nocookie.com.

Without JS the poster simply stays and the button does nothing, rather than leaving a dead
embed.


### 2026-09-07 — Figma file cleaned: no archives, no versioned duplicates. **Bryan's call.**

IBM Plex Sans is the typeface going forward, so everything from before it was outdated
weight rather than history worth keeping. Deleted:

- The three original desktop frames and two original mobile frames kept as "before"
  references. **The before/after comparison is over** — there is now one version of each page.
- The archived ProjectCard A/B/C explorations and the filter-bar explorations.
- Four validation scaffolding frames (grid checks, header/footer check, eyebrow/FactPair
  check). The real pages serve that purpose now.

`04 — Components` contains the seven components and nothing else. Version suffixes are gone
from frame names — no more `(v2)`, `(v3, filterable)`. The layout suffixes on project pages
(`featured`, `light, no body`, `photography`) stay, because those name real variants.

**Every page is now 100% IBM Plex Sans**, Foundations included — its Colour, Spacing and
documentation frames were still Inter and have been converted, mapping Inter's spaced
`Semi Bold` onto Plex's `SemiBold`.

**The "How to use this file" doc was rewritten**, because it had become actively wrong: it
still told the reader to activate an Adobe Font, claimed `font/family` was "currently Inter",
and stated that Figma Starter allows only one variable mode. It now describes IBM Plex Sans,
the weights in use, the SemiBold-without-a-space trap, and the Desktop/Mobile breakpoint
modes. A documentation page that lies is worse than none.

### 2026-09-07 — Typeface swap executed in Figma. **Done, verified.**

Completes Code and Deploy's entry below. Everything it listed as outstanding is finished:

- `font/family` = **IBM Plex Sans** in both `Desktop` and `Mobile` modes.
- All ten text styles repointed, **600 restored** as Code and Deploy asked. Style names in
  this family have **no space** — `SemiBold`, not Inter's `Semi Bold`. A silent breaker.
- All ten styles re-bound to `font/family`, so the next swap is one variable edit again.
- The Foundations Type specimen is rebuilt in Plex, with every line's size **and** family
  bound to the variables. It was hardcoded before, which is exactly why it drifted.

**Verified by node count, not by eye:** every one of the 22 rebuilt frames is 100% IBM Plex
Sans, 0 Inter. The 105 remaining Inter nodes are all inside the original pre-existing
frames, which are kept deliberately as the "before" reference.

**Metric shift:** Plex sets slightly tighter than Inter here. Desktop landing 1496 → 1415px,
work index 2643 → 2523px, mobile landing 2419 → 2323px. Nothing reflowed badly; no fix needed.

**For Code and Deploy — the CSS side:**

```css
--font-sans: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
```

Weights needed: **400, 500, 600, and 400 italic**. Nothing else in the family is used. The
Typekit `<link>` should be removed if it was ever added. Self-hosting vs CDN is Code and
Deploy's call — Design and Figma has no stake beyond "it must work on localhost."

*Correction owned by Design and Figma:* an earlier report to Bryan said the `font/family`
variable was "still Inter" and that his change had only touched one specimen node. That was
wrong. His change had in fact reached all ten text styles and 421 nodes — the read that said
otherwise was taken before his edit propagated. It also flattened every weight to Regular,
because New Frank's style names did not match what the styles asked for. All corrected now.

### 2026-09-07 — Typeface is IBM Plex Sans (Google Fonts), replacing New Frank. **Bryan's call.**

Supersedes the New Frank / Adobe Fonts decision entirely. Three consequences:

**1. The Adobe Fonts domain allowlist item is dead.** It only existed because Adobe Fonts
web projects are domain-locked and would have failed silently on whichever domain was
forgotten. Google Fonts has no such restriction. The typekit embed
`https://use.typekit.net/udc5guh.css` is no longer used.

**2. The 600 → 700 weight revision should be reverted.** It existed solely because New
Frank has no Semi Bold. IBM Plex Sans does — its ramp is Thin 100 through Bold 700
including SemiBold 600 — so the original mapping stands: 600 for display, titles and the
wordmark; 500 labels and eyebrows; 400 body; 400 italic for the design question. **Design
and Figma should change those four text styles back from Bold to Semi Bold.**

**3. Code and Deploy will self-host rather than link Google's CDN.** Code-side call. A CDN
link costs an extra DNS lookup and TLS handshake to fonts.gstatic.com before any text can
render, and hands Google a request from every visitor. Self-hosting through Fontsource
ships the woff2 files from the same origin as the site, so the fonts arrive on the
connection that is already open. Same typeface, fewer round trips.

Still outstanding and only Bryan can do it: set `font/family` in Figma from `Inter` to
IBM Plex Sans, so the ten text styles and all frames follow.


### 2026-09-07 — Legal copy approved as published. **Bryan's call.**

`/terms` and `/privacy` are signed off. The clauses describing a contact form, purchases
and Stripe payment processing, and traffic analytics were removed because this site has
none of those; everything remaining is Bryan's own wording, verbatim from the Cargo
archive. No further review needed.

Still stale and unaddressed by choice: both pages carry "Last Updated: January 1, 2025".
Setting a new date would be authoring policy, so it stays until Bryan says otherwise.


### 2026-09-07 — Design questions are optional, not required. **Bryan's call.**

Previously tracked as R7, "the long pole on launch". It is not one. Bryan intends to write
maybe one or two questions across the whole site, not fourteen, so the field is now
genuinely optional rather than a blank waiting to be filled.

All 14 are set to `null` and nothing renders. Set one and it appears on that project page
only — both layouts already guard it. `DESIGN-QUESTIONS.md` holds a worksheet with each
project's scope and body opening for whenever he wants to draft one.

Consequence: the site is no longer content-blocked on questions. What remains is images
(2 of 14) and the design decisions in the open list.

### 2026-09-07 — Previous/Next project navigation removed.

Built in Slice F from spec §8, then removed on review. The order runs design → art →
photography, so sequential navigation walks a reader from the strongest recent design work
toward older student work — a control whose default direction is away from the best
material on a job-application portfolio. "Next" also exposes the `order` field, which is
storage order, as though it were curatorial.

Logged for Design and Figma: a "More work" control offering two or three projects sharing
a keyword would give the intent without the downside. Not designed.


### 2026-09-07 — Landing statement is `--size-xl`. Figma is right; the code should change.

Resolves the open item Code and Deploy raised, with one correction to it: **Figma draws the
statement at `--size-xl`, not `--size-2xl`.** Verified on the node — text style
`Display / XL`, bound to `size/xl`, rendering at 32px.

That distinction matters. The responsive step-down **does** touch `--size-xl` (32px → 24px
under 40rem), so adopting it gives 32px desktop / 24px mobile — not an unstepped 32px
everywhere, which is what the open item implied was on offer.

The code renders it at `--size-lg` (22px). **Figma wins.** Bryan reviewed the landing frame
at this size and approved it explicitly; the code simply predates that. Type sizing is
Design and Figma's to call, and this one is already signed off.

*Correction owned by Design and Figma:* spec §1.2 described "an 8-line 296px block at
390px" as though it described the built site. It described the Figma frame. Code and Deploy
was right to flag it.

### 2026-09-07 — Type ramp is bound to one variable.

All ten text styles now bind `fontFamily` to the `font/family` variable, which carries
`codeSyntax` `var(--font-sans)`. Changing that one variable swaps the entire ramp across
every component and all 18 frames.

Practical consequence: **Bryan can perform the typeface swap himself in the Figma UI** —
select the `font/family` variable, change its value — without waiting on the Design chat.
This matters because the Design chat may not be able to see locally activated Adobe fonts
from its container.

### 2026-09-07 — Role is removed entirely. **Bryan's call.**

Not hidden — removed from the schema and from all 14 content files. It never appeared on
the Cargo site, and Bryan does not want it displayed anywhere. `discipline` supersedes it
and carries real per-project values from the archive.

### 2026-09-07 — Keywords are seeded from the site's disciplines, not the three categories.

**Bryan's call, and it overrides spec §2.1**, which said to seed with `category`
(Design / Art / Photography). He asked for the disciplines already shown on the Cargo
site, as a placeholder set until he writes real keywords. That yields 8 keywords with
genuine overlap rather than 3 disjoint buckets, so multi-keyword filtering is exercised
from day one: ADA Signage Design, Brand Identity, Digital Communications, Exhibition
Design, Fine Art, New Media, Photography, Visual Communications.

`re:present` carries two (Exhibition Design + Digital Communications) and correctly
appears under both. Full keyword functionality is the goal; these values are the seed.

### 2026-09-07 — `discipline` is its own field, not `keywords[0]`.

Code-side call, resolving spec §7.1. `discipline` is single-valued, selects the project
page layout, and appears in the facts list. `keywords` is an unordered many-valued set.
Deriving layout from an unordered array would mean adding a keyword could silently change
a page's layout.

### 2026-09-07 — `year` is a sort key; `completed` is what renders.

Code-side call, resolving spec §7.2. The live site says "September 2025" and "2019" —
a number cannot hold the former. `year: number|null` stays for ordering, `completed:
string|null` is displayed.


### 2026-09-07 — Hosting stays on Netlify. **Bryan's call.**

GoDaddy is registrar only — the account holds bryancampana.com plus WHOIS privacy, with no
hosting product on the invoice, so it was never an option for a built site. Netlify keeps
deploy previews, one-click rollback and free forms. Cloudflare Pages is the fallback if
credits stay tight; migrating a 13-file static site is under an hour, so this is reversible.

### 2026-09-07 — Deploy discipline. **Enforced in netlify.toml.**

Netlify free tier is 300 credits per billing cycle, and the cycle runs the 7th to the 6th,
not the calendar month. Builds now run only on commits whose message contains `[deploy]`,
enforced by the `ignore` command in `netlify.toml`. Untagged pushes are skipped before the
build starts and cost nothing. See rule 12.

### 2026-09-07 — Motion is not constrained by hosting.

"Static" describes delivery, not behaviour. CSS animation, GSAP, View Transitions, canvas
and WebGL all run client-side and work identically on any host. Nothing about the hosting
choice forecloses animation later.


### 2026-09-07 — Featured set stays at 4. **Bryan's call.**

`dura-architectural-signage`, `590-madison-ave`, `big-city-volleyball`, `togethereffect`.
Two rows of two on the landing page. The old Cargo site featured 6; Bryan chose the
tighter edit.

Consequence worth noting rather than acting on: all four are design projects, so the
landing page shows no photography or art. The work index carries all 14 and is filterable,
so the other disciplines are one click away. Revisit only if Bryan raises it.

Promoting a project later is a one-value change — `featured: false` → `true` — plus writing
its body if it should read as a full case study. No design work either way.

### 2026-09-07 — ProjectCard direction. **Decided.**

**Image → keyword → title → description.** One component, one configuration, used
identically on the landing page and the work index. No variants, no per-context props.

In Figma: the component is `ProjectCard` on page `04 — Components`. The three explorations
are archived on the same page — renamed `ARCHIVED — ProjectCard explorations A/B/C
(rejected 2026-09-07)`, dimmed to 40% and locked. The component's own description records
the decision.

| Field | On the card | Where it lives instead |
|---|---|---|
| Image | yes | — |
| Keyword | yes | — |
| Title | yes | — |
| Description (`scope`) | yes | — |
| Year | **no** | Project page, as `Completed` |
| Design question | **never** | Project page only |

Year and question are retained as component properties defaulted **off**, so the component
still mirrors the optional fields in the content schema. Nothing on the card is
right-aligned — an earlier right-aligned year was rejected as reading like a table column
in a layout with no other columns.

*Why not A/B/C:* the final card is closest to **B** (image first — the work is why anyone
is on the page). **A**'s hierarchy argument was tested and lost on grid rhythm: with the
image last, ragged text above pushes every image to a different vertical position across
14 cards. **C** was dropped because its labelled rows duplicate the device the project
page already uses for Completed / Discipline / Medium / Prints, spending the idea before
the reader reaches the page where it does real work.

### 2026-09-07 — Design question house style. **Decided (style only).**

**One sentence, 60–90 characters, ending in a question mark, naming the specific
constraint rather than the general theme.**

So: *"Can compliance signage inherit the material language of the room it serves?"* (75)
— **not** *"Can signage inherit a room's materials?"* (39), which drops "compliance," the
actual tension between ADA requirement and design intent.

Two things this changes:

- **Card height no longer depends on it.** The question is not on the card, so the reason
  this was flagged as blocking has gone away. It now sets length only on the project page,
  where at the 496px desktop rail 60–90 characters is one to two lines.
- **It matters more, not less, for the ten projects with no written body.** Those pages are
  title, description, question, facts and images — the question is most of the prose.

### 2026-09-07 — Every project gets a project page.

All 14, not just featured. `featured` now controls presentation only — which projects
appear on the landing page — not whether a route generates. Ten projects have no Markdown
body, so the template must render cleanly with `<Content />` empty. Every card links.

### 2026-09-07 — Project pages come in two layouts.

**Standard** — sticky text rail plus wide media column, as already settled.
**Photography** — image-led: no rail, a two-up grid of captioned portrait prints (single
column on mobile), and facts *after* the work rather than beside it. Built at both
breakpoints in Figma. Photography projects carry fields the others don't: `Medium`,
`Prints`, dimensions, and per-image captions.

### 2026-09-07 — Fact labels follow the live site's vocabulary.

**`Completed` / `Discipline`**, plus **`Medium` / `Prints`** on photography. Not
Role / Year / Category. **`Role` is dropped entirely — it appears nowhere on
bryancampana.com.** This supersedes the earlier "Role removed from previews / kept on case
study facts" entry: it is now removed from both.

Long values must wrap. *"Silver Gelatin prints on photographic paper, glossy finish. Shot
on 35mm."* runs to two or three lines in a narrow column — no `white-space: nowrap` or
fixed width on `.case__facts dd`. The Figma component clipped this until fixed, which is
how it was found.

### 2026-09-07 — Work index is filterable, not grouped.

The three stacked Design / Art / Photography sections are replaced by one flat grid plus a
keyword filter. Chips, not text links: with the site nav directly above using the same
active/inactive treatment, text links read as a second navigation row. Square corners
follow `radius/sm`. No result count — Bryan dropped it.

**No JavaScript.** Radio inputs plus sibling selectors, so it works with JS disabled.
`category` becomes a `keywords` array; project types are the values for now.

Grouping was removed partly for a mechanical reason: at three-up the 6 / 4 / 4 category
counts strand a lone card in both Art and Photography.

### 2026-09-07 — Responsive display type.

Two tokens gain a small-screen value; nothing else changes.

| Token | Desktop | Under 40rem |
|---|---|---|
| `--size-xl` | 2rem (32px) | 1.5rem (24px) |
| `--size-2xl` | 3rem (48px) | 2rem (32px) |

At 390px the landing statement was an eight-line, 296px block; it is now 168px. In Figma
this is the `Mobile` variable mode. **No new custom properties** — all 26 variables still
map 1:1 to `tokens.css`.

### 2026-09-07 — Font weights, REVISED for New Frank: 600 becomes 700. **SUPERSEDED — reverted to 600.**

> Dead entry, kept only so the reasoning is traceable. It existed solely because New Frank
> lacks a Semi Bold. IBM Plex Sans has one, so the original 600 mapping stands and the four
> text styles are set to `SemiBold` in Figma as of 2026-09-07. Ignore the table below.

**New Frank has no Semi Bold.** Its weights are Thin 100, Light 300, Regular 400, Medium 500,
Bold 700, ExtraBold 800. The original ramp below specified **600**, which does not exist in
this family. Revised mapping:

| Role | Weight | Text styles |
|---|---|---|
| Display, titles, wordmark | **700 Bold** (was 600) | Display 2XL / XL, Title Large, Body Strong |
| Labels, eyebrows, keyword | 500 Medium | Eyebrow, Label |
| Body, captions, nav | 400 Regular | Body, Body Large, Body Small |
| Design question | 400 Italic | Question |

Bryan's web project includes 300, 300i, 400, 400i, 500, 500i and 700 — everything the design
needs, plus Light and Light Italic which nothing currently uses. Bold Italic 700 is **not**
included and is not needed; nothing pairs bold with italic.

CSS family name is **`new-frank`** (`font-family: new-frank, sans-serif;`). Note this differs
from the Figma family name, which is the display name shown in Figma's font picker.

*Caveat on verification:* the Design chat cannot see New Frank from its container, so it
cannot render or visually check the typeface. Type appearance has to be eyeballed by Bryan in
Figma or on the built site. Structure, metrics and token wiring remain verifiable from here.

### 2026-09-07 — Font weights. **SUPERSEDED by the entry above — 600 does not exist in New Frank.**

Settled by the ten text styles now in Figma, recorded here so Code and Deploy can stop
relying on browser defaults:

| Role | Weight | Styles |
|---|---|---|
| Display, titles, wordmark | **600** | Display 2XL / XL, Title Large, Body Strong |
| Labels, eyebrows | **500** | Eyebrow, Label |
| Body, captions, nav | **400** | Body, Body Large, Body Small, Question (italic) |

Whether these become `--weight-*` tokens is Code and Deploy's call; the values are fixed
either way. This resolves the landing `h1` rendering at browser-default bold.

### 2026-09-07 — Active nav item gets a visual treatment.

`SiteHeader.astro` already sets `aria-current="page"` but no CSS targets it — screen
readers know which page you are on and sighted visitors don't. Active is `--color-fg`,
inactive `--color-muted`.

### Earlier

- **2026-09-07 — Page widths.** `--page-max` 1440px; project pages `--page-max-wide` 1600px.
- **2026-09-07 — Standard project page layout.** Sticky text rail + wide media column at
  64rem+, stacked text-first below. Rail `minmax(280px, 1fr)`, media `2fr`.
- **2026-09-07 — Name as home link.** The wordmark in the nav links home; the landing page
  does not repeat the name. Its h1 is the positioning statement.
- **2026-09-07 — Copy comes from Bryan.** All prose is his, verbatim from the Cargo archive
  in `archive/content/`. Neither chat writes portfolio copy for him.

---

## Design questions — Bryan owns these outright

**2026-09-07 — removed from Design and Figma's list entirely. Bryan's call, in his words:
"let's take this completely off the list. I will take that responsibility."**

Nothing here is tracked by either chat any more. No status table, no count, no long pole.
The field is optional and already ships blank on all 14 project pages, so there is nothing
waiting on it and nothing to chase.

What remains true and worth keeping, as reference rather than as a task:

- **House style**, if Bryan wants it: one sentence, 60-90 characters, ending in a question
  mark, naming the specific constraint rather than the general theme. See the Settled entry
  "Design question house style".
- **The questions currently in the Figma file are placeholder text** drafted by the first
  design chat to test layout at realistic sentence lengths. None of it is Bryan's writing.
  Treat it as a length reference and replace it wholesale; do not let it reach the site.
- **Setting one is a one-field change.** Both project-page layouts already guard the field,
  so filling it in makes it appear on that page only. `DESIGN-QUESTIONS.md` holds a
  worksheet with each project's scope line and body opening.

**Neither chat should raise this again.** Not as a blocker, not as a status item, not as a
launch dependency.
