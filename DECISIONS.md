# Decisions

Shared ledger between the two Claude Code chats working on this project.
Both chats live in this folder, so both read and write this file.

| Chat | Owns | Writes to |
|---|---|---|
| **Design and Figma** | What the site looks like — layout, type, colour, spacing, card direction | Figma + the "Open" section below |
| **Code and Deploy** | Making the site match — code, tests, build, deploy | The repo + the "Settled" log below |

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
3. **`docs/figma-to-code-spec.md` exists but is NOT on `main`.** It is on
   `claude/website-design-figma-l3milr` and carries the full implementation spec —
   schema changes, routing, the no-JS filter, the photography layout. Code and Deploy
   cannot see it until that branch is merged. **This is the highest-priority coordination
   item on the list.**

---

## Open decisions — Design and Figma owns these

- [ ] **Colour.** All six colour tokens are still neutral placeholders. Needs a real
      palette decision. Not blocking anything — everything is variable-bound, so a colour
      change propagates through Figma and CSS without rework.
- [ ] **Radius.** `radius/sm` and `radius/md` are both `0`. The only place radius is
      visible is `FilterChip`; every other surface is a hairline or a plain block. Bound
      to the tokens, so it is a one-value change.
- [ ] **Filter counts and progressive disclosure.** Bryan supplied a reference showing
      each keyword with a superscript result count and a `(More)` affordance. Figma
      currently has four plain chips with no counts. Needs designing.
- [ ] **Featured set — ownership needs settling first.** The current brief to Design and
      Figma says this chat owns "the editorial call on which projects are featured"; the
      previous ledger said it is Bryan's. Those conflict. Design and Figma's position:
      **this one should stay Bryan's.** Which four or six projects lead his portfolio is a
      claim about his own career, not a layout problem, and it is the one decision here
      that no agent should quietly make for him. Flagging rather than taking it.
      *Context if he wants it: the old Cargo site featured 6, including `re:present` and
      `Two of Hearts`. The design supports any count — the landing grid is two-up, so an
      even number avoids a stranded card. 4 and 6 both work; 5 would strand one.*

### Waiting on Bryan, not on either chat

- [ ] **Typeface.** `font/family` is still `Inter`. Bryan is supplying an Adobe Font.
      Nothing further to decide on the design side — the whole type ramp is bound to that
      one variable, and all ten text styles inherit it. When it lands: the Adobe embed
      `<link>` in `Base.astro` and the `--font-sans` value, both Code and Deploy's.
      **Caveat worth knowing now:** Adobe Fonts web projects are domain-locked, so both
      `bryancampana.com` and `bryancampana.netlify.app` must be added to the project's
      allowed domains or the fonts fail silently on one of them.

## Open decisions — Code and Deploy owns these

Routed here rather than through Bryan, per rule 2.

- [ ] **Merge `claude/website-design-figma-l3milr` into `main`.** Carries
      `docs/figma-to-code-spec.md` and this ledger update. Blocks everything else.
- [ ] **Discipline source.** The project page has two layouts (standard / photography) and
      needs one canonical discipline value to switch on. Either `keywords[0]` or a separate
      `discipline` field — do not infer layout from an unordered array. Code and Deploy's
      call; Design and Figma has no preference beyond "it must be deterministic."
- [ ] **`year: number` vs `completed: string`.** The live site shows *September 2025* for
      Dura and *2019* for Oscuro. The current numeric `year` cannot hold the former.
      Widen it, or add `completed` and keep `year` as a sort key.

---

## Settled

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

### 2026-09-07 — Font weights.

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

## Design questions — status

**Correction to the previous version of this ledger.** It listed Dura's question as
written and counted "11 of 14 still needed." That undercounts the work: **every design
question currently in the Figma file was drafted by Design and Figma as placeholder text
to test layout at realistic sentence lengths.** None of it is Bryan's writing.

Under rule "Copy comes from Bryan," that makes the real count **14 of 14 still to be
written.** The drafts should be treated as length references, not proposals, and replaced
wholesale.

| Project | Status |
|---|---|
| All 14 | Placeholder draft in Figma only — **needs Bryan's own** |

The house style above is the brief for writing them: one sentence, 60–90 characters,
naming the specific constraint. This remains the long pole on launching, and it is the one
task on the whole project that neither chat can do.

*Design and Figma's suggestion, not a decision: the questions are hardest to write cold and
easiest to write from the work. If Bryan wants, this chat can pull each project's scope
line and archived Cargo body text into a single working document — his words only — so he
has all 14 in front of him at once rather than opening 14 Markdown files.*
