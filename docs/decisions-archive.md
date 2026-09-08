# Decisions archive

The full dated log for bryancampana.com. **This is history, not the contract.**
`DECISIONS.md` on `main` holds current state, the rules, and the open items — read that first
and come here only for the reasoning behind a specific decision.

Every entry carries a stable ID and a status. **A status other than `Accepted` means do not
act on the entry's contents** — read it to understand why something is the way it is, never to
decide what to do next.

Adapted from Architecture Decision Records (Nygard, 2011): stable IDs, an explicit status, and
supersession recorded rather than edited in place. Entries are **immutable** — to change a
decision, add a new entry in `DECISIONS.md` and set this one's status to superseded. Do not
rewrite history here; git holds it either way.

IDs are chronological: `D-001` is the oldest.

---

<a id="df-005"></a>
### DF-005 · 2026-09-07 — The keyword filter takes the eyebrow tier. The violet becomes hover-only. **Bryan's call.**

**Status:** Accepted

**1. The filter is the Eyebrow tier.** Uppercase, 15px, 8% tracking — matching the section
eyebrows rather than sitting in body type. Bryan asked for the labels to mirror the eyebrows, and
for the count to stop being distinguished by size and a raised position.

**Label and count are now the same size and weight, separated by colour alone** — label
`--color-fg`, count `--color-muted`.

**There is no colour lighter than `muted` in the palette**, which shaped this. The only lighter
value is `placeholder` `#F0F0F0`, about 1.2:1 on white — invisible as text. So rather than invent
a tier, the two that exist do the work: ink label, muted count. That makes the filter a row of
ink eyebrows, which is a real shift in the page's weight and is what "match the eyebrow" implies
now that the eyebrow is ink.

**2. `--color-accent` is hover only — this restores the settled system rather than changing it.**

The colour system entry has always said the charge appears on hover: *"drawn charge — link at
rest: ink, weight 500, underline"* and *"full charge — hover: charge colour"*. The code had it
the other way round — on **four resting elements** and one hover:

| Where | Rendered | Figma said |
|---|---|---|
| `ProjectCard` keyword | accent | `color/muted` |
| `ProjectStandard` label | accent | muted |
| `ProjectPhotography` label | accent | muted |
| Selected filter label and count | accent | accent |

**Three of the four are pure drift** — Figma has said muted all along, so no design decision was
needed to correct them. The card keyword is what made it loud: violet fourteen times on `/work`
and four more on the landing page.

**The fourth was a genuine contradiction between two settled entries.** The `FilterLink` entry
said *"the selected label takes `--color-accent` in place of `--color-fg`"*, which the colour
system's hover rule forbids. Bryan resolved it in favour of the colour system. A persistent
accent on a static control makes the charge decorative, and once it is decorative it stops
signalling anything.

**`--color-focus` keeps the value and does not change.** Same colour, different token, different
state. Hover is for pointers, focus is for keyboards, and the settled system requires them to
stay visually distinct from one another.

**3. The selected state needed a replacement cue.** With both states ink and both at the eyebrow
weight, colour and weight could not both carry it. New style **`Eyebrow / Selected`** — Bold plus
an **underline**. Two cues, no accent, and underline is the device the colour system already
reserves for text links.

Named for the role rather than `Eyebrow / Strong` because the underline is part of it, not just
the weight.

**Measured before drawing, and the numbers moved a constraint.** Uppercase at 15px with 8%
tracking costs more per character than sentence case at 17px: the row grew **17%, 696px → 813px**.
Still one desktop line, still three mobile rows — but headroom across those rows fell from ~197px
to **80px**, and an average keyword costs ~122px. **The keyword set is now full at seven links.**
Renaming inside 14 characters stays free; adding an eighth goes to four rows.
`docs/copy-constraints.md` updated.

**A Figma mechanic worth recording, since it cost two failed attempts.** `textDecoration` is a
property of a Figma **text style**, not just of a node. Setting it on a node that has a style
applied appears to work and then resolves back from the style on the next read — which looked
exactly like cross-variant propagation and was not. The underline had to go into
`Eyebrow / Selected` itself. **Read state back after a write; the return value of the write is
not evidence.**


<a id="cd-001"></a>
### CD-001 · 2026-09-07 — The filter count stays Regular. One eyebrow, one definition. **Code and Deploy.**

**Status:** Accepted

Answers both items routed in `DF-002` and `DF-003`, and settles a weight question left open
twice.

**1. The filter count stays `--weight-regular`. Figma changes, not the code.** Design asked for a
pick and offered to move whichever side lost. The count is `--size-xs` beside a `--size-base`
label, and its job is to annotate the label rather than belong to it — Regular at 13px reads as
an annotation, Medium pulls it back toward being part of the word. It is also the only weight
that has been live, through two deploys, and nobody looking at the page has objected to it.

The reason it matters more than a weight usually would: the count must never grow the line box.
The filter's hairline is one of three sanctioned rules on the site, and its position is derived
from the 26px row the 17px label sets. Every property on that element is chosen to stay inside
that row. **Design and Figma: please rebind the count node from `Label` to `Body / Small`.**

**2. `.eyebrow` is SemiBold, and it is now the only definition of that type.** `DF-003` is right
that a second implementation is a bug rather than a variant, and the weight change is what would
have exposed it: applied to `.eyebrow` alone, the landing page's `FEATURED` would have gone
SemiBold while About's `CONTACT` stayed Medium, both claiming to come from one Figma text style.

The structure mirrors Figma, since Figma already had it right:

| | Figma | CSS |
|---|---|---|
| Type only | `Eyebrow` **text style** | `.eyebrow` |
| Type plus the rule | `Eyebrow` **component** | `.eyebrow` + `.eyebrow--section` |

`about.astro` now uses `.eyebrow` with no modifier and declares no type of its own; the seven
duplicated declarations are deleted rather than updated. The `<h2>` with a CSS-uppercased
accessible name stays.

**3. Found while doing it — two `Label` nodes whose CSS did not match the style.** `DF-004`
audited that every Figma node is bound to a text style, which is true, but not that the CSS
matches the style it is bound to. Both of these are bound to `Label` — 13px Medium, 140%:

| Element | Should be | Was |
|---|---|---|
| `.card__keyword` | `--size-xs` · `--leading-label` | `--size-xs` · `--leading-eyebrow` |
| `.video__label` | `--size-xs` · `--leading-label` | `--size-sm` · `--leading-eyebrow` |

`ProjectFacts` already uses `--size-xs` with `--leading-label`, so the correct pairing was in the
codebase all along and these two drifted from it. The card keyword is corrected here, completing
the size fix made earlier today. **`.video__label` is left alone and flagged** — it is a visible
size change on a different component and was not in the routed scope.

**The `--leading-eyebrow` / `--leading-label` split is the tell.** Two tokens, 1.3 and 1.4, exist
precisely to distinguish the Eyebrow style from the Label style. Reaching for the wrong one is
silent: both are plausible small-label leadings and neither errors.

<a id="df-004"></a>
### DF-004 · 2026-09-07 — Figma audited and build-ready. Where it is 1:1 with the code, and where it must not be. **Design and Figma.**

**Status:** Accepted

Bryan asked Code and Deploy to unify the code with Figma, and asked this chat to confirm Figma is
sound enough to build from. Audited rather than asserted.

**Audit result — clean, after two fixes.**

| Check | Result |
|---|---|
| Text nodes with no text style | **0** across all three pages |
| Colours not bound to a variable | **0** across all three pages |
| Text styles bound to `fontFamily` **and** `fontSize` | **12 of 12** |
| Variables carrying a WEB `codeSyntax` | **30 of 30** |
| Components | **8**, variants intact — `SiteHeader` 3×2, `FilterLink` 2, `Placeholder` 4 |
| Frames | **9 desktop, 9 mobile** |

**Two defects found and fixed, both introduced by this chat** when it built the About contact
block programmatically:

- The `contact` frame carried an **unbound white fill**. `figma.createAutoLayout()` adds one by
  default. The 74-fill cleanup earlier the same day ran *before* this frame existed, so it slipped
  straight back in behind the fix.
- The `CONTACT` eyebrow's fill was **unbound `#000000`** — a colour that is not in the palette at
  all. `createText()` defaults to black, and applying a text style sets type but never colour, so
  it was never bound. **It read as plausibly-dark in every screenshot**, which is why review by eye
  did not catch it and an audit did.

Both are now `--color-fg` and no fill, on both breakpoints.

---

## The 1:1 question, which is the part that could mislead

**Figma and the code are 1:1 on values and structure. They are deliberately not 1:1 on
behaviour, and "unifying" those would be a regression.**

**1:1 — a mismatch is a bug:** the 30 variables against the CSS custom properties named in their
`codeSyntax`; the 12 text styles against the type rules; the 8 components against their Astro
counterparts; spacing, sizes, radii; which elements exist on a page and in what order.

**Not 1:1 — matching Figma would be the bug:**

1. **Dark mode is not in Figma and cannot be.** The collection's two modes are Desktop and
   Mobile, a breakpoint axis. The palette table in `DECISIONS.md` owns dark and has no second
   check — this was costed and rejected in the same session.
2. **Photography column counts.** The code derives them from image count — ≤2 → one column full
   width, 4 → two-up, otherwise three-up — overridable per project by `columns`. Figma draws
   two-up, which is now only the four-image case. **The layout is a rule; a frame is one instance
   of it, and will always trail.**
3. **Full-bleed chrome.** Header and footer span the viewport. Figma's widest frame is 1600, so
   full bleed and `page--wide` look identical there. The spec is written down, not drawn.
4. **The responsive continuum.** Figma has three widths; the code has one 40rem breakpoint across
   a continuum. The header stacks from 0–639px, and Figma shows only the 390 case.
5. **Imagery.** Figma holds `Placeholder` blocks; the site renders real photographs.
6. **Filter labels and counts** are generated from content at build. Figma shows a snapshot that
   is correct on the day it was drawn.

**One live item that is a genuine mismatch, not a legitimate divergence:** the eyebrow type is
implemented twice in CSS while Figma has one text style — `DF-003`, already in Code and Deploy's
list.

**How to tell the two apart:** if Figma *could* express it and doesn't match, it is a bug. If
Figma *structurally cannot* express it — because it has fixed widths, no theme axis, and no
content pipeline — the code is the source of truth and the drawing is a reference.


<a id="df-003"></a>
### DF-003 · 2026-09-07 — There is one eyebrow, in two contexts. **Design and Figma.**

**Status:** Accepted

Caught while surveying state, before it drifted rather than after — which is the first time
today that has happened in this class of problem.

**The eyebrow type is implemented twice in the code.** `.eyebrow` in `base.css` and
`.about__label` in `about.astro` both set sans, medium, `--size-sm`, `--leading-eyebrow`,
uppercase, `--tracking-wide` and `--color-fg`. Seven identical declarations, written out twice,
with nothing connecting them. The only real difference is that one carries the hairline.

**Why it matters right now:** a weight change from Medium to SemiBold is sitting in Code and
Deploy's open list. Applied to `.eyebrow` alone it splits the two — the landing's `FEATURED`
goes SemiBold while About's `CONTACT` stays Medium, and two elements drawn from a single Figma
text style stop matching on the built site.

**The design fact, which is this chat's to state:** there is **one** eyebrow. It appears in two
contexts — a section heading above a grid, which takes a hairline, and a column label, which
does not. Figma already models exactly that: the `Eyebrow` **text style** is type only; the
`Eyebrow` **component** is that style plus the rule. **A second implementation of the type is a
bug, not a variant.** How the CSS expresses it is Code and Deploy's call.

**Not a criticism of the implementation that caused it.** Code and Deploy built the About label
as an `<h2>` with the word uppercased in CSS, so the block sits in the document outline and the
accessible name stays a word rather than an acronym. That is better than the styled paragraph
this chat drew in Figma, and nothing here asks them to undo it — an `<h2>` can share a type
selector as easily as a `<p>` can.

**This is the third instance today of one decision living in two places with no link between
them** — after the Foundations swatch hexes, which showed pre-plum greys while the variables
underneath were correct, and the colour table that `tokens.css` named as its source of truth
while four of its values had moved. The pattern is consistent enough to be worth naming: **on
this project, duplicated values do not stay equal, and the duplication is always invisible until
one side changes.**


<a id="df-002"></a>
### DF-002 · 2026-09-07 — Eyebrows are section headings only. Discipline stays in the facts. Eyebrow steps to SemiBold. **Bryan's call.**

**Status:** Accepted

**1. No eyebrow on a project page, and nothing fills the slot.** The `WORK` eyebrow was removed
in `D-062`; the question left open was whether `discipline` should move up into it. **It should
not.** Eyebrows are **section headings** — `FEATURED` on the landing page, `CONTACT` on About —
and a project page has no section above its title to head. The slot stays empty and the page
opens on the title.

**This closes the discipline swap**, which was recommended by this chat and agreed in principle
earlier the same day. It does not survive Bryan's narrower definition of what an eyebrow is for,
and the narrower definition is better: a component used for one thing is easier to reason about
than one used for a heading here and a metadata label there.

**Two consequences.**

- **`discipline` keeps its `Discipline` row in the facts block** and stays a prose description of
  the practice. `DF-001` still applies — it must not carry a retired keyword string, so `Art` and
  `Visual Communications` still change.
- **`discipline` has no length limit again.** Had it moved into the eyebrow it would have been
  capped near **32 characters**, and `590 Madison Ave` was already at the edge —
  `SIGNAGE & WAYFINDING, CODE SIGNAGE` measured within a few pixels of the full mobile width in
  every weight tested. In the facts block it wraps like every other fact value.
  `docs/copy-constraints.md` is updated: that section is gone, not softened.

**2. `Eyebrow` steps up one weight class: Sans Medium 500 → SemiBold 600.** Size stays 15px,
colour stays `--color-fg`.

Bryan's reason: the ink alone was not enough separation from the keyword on project cards. It now
differs on **three** axes — SemiBold against Medium, 15px against 13px, ink against muted — where
before it differed only on size, quietly.

**This is safe where the earlier Bold was not, and the distinction is worth stating.** The
reweighting reverted in `D-064` broke because it asked for **Serif** 500 and 700, which are static
per-weight files and were not imported. SemiBold 600 is **Sans**, which is loaded as a variable
file spanning `100 700`, and 600 is already in use by four other styles. **No font import, no new
weight in the system.**

**Code and Deploy — one line, and it replaces the one in `D-064`.** `base.css`:

```css
.eyebrow { font-weight: var(--weight-semibold); color: var(--color-fg); }
```

was `var(--weight-medium)` and `var(--color-muted)`. Both tokens exist.

**Note on the standing re-measure obligation:** `Eyebrow` has now moved three times in one day —
Medium, Bold, Medium, SemiBold. None of the four limits in `copy-constraints.md` depend on it
today, but only because discipline left the eyebrow in the same breath. That is luck, not design,
and the obligation stands.


<a id="df-001"></a>
### DF-001 · 2026-09-07 — Discipline strings settled; decision ids become per-chat

**Status:** Accepted

Two things, one raised by Code and Deploy and one caused by this chat.

**1. `discipline` must not carry a retired keyword string.**

Raised from the deployed page: `photopolymer-letterpress` shows `Discipline: Art` while its
filter link says `Fine Art`, and `dura-architectural-signage` shows
`Discipline: Visual Communications` — the exact string `D-059` retired.

**The rule.** `discipline` is a prose description of the practice. It **may** coincide with a
keyword where the practice genuinely has that name — seven of fourteen already do, `Photography`
and `New Media` — and that is not a defect. **A *retired* string is different.** To a reader who
has just clicked `Fine Art` in the filter and landed on a page reading `Discipline: Art`, the site
is contradicting itself about its own vocabulary.

`Art` fails on a second count as well: it is the category error `D-059` names. Beside
`Photography` and `New Media`, which are themselves art, `Art` claims a superset. That reasoning
holds in any field it appears in.

**What replaces them is copy, not vocabulary**, so this chat recommends rather than decides:
`Printmaking` for the letterpress, which names the practice and is more informative than either
`Art` or `Fine Art`; `Signage & Wayfinding` for Dura, matching the register `590 Madison Ave`
already uses. Content and Copy's to write.

**Routing correction:** the item said Code and Deploy would make the edits. `D-063` moved
`src/content/**` to Content and Copy the same day, so they no longer can.

**2. Decision ids become per-chat: `DF-###` and `CD-###`.**

Code and Deploy raised this after resolving the **second** duplicate id in an hour — `D-060` and
then `D-061` were each allocated twice. **This chat caused it**: the `D-NNN` scheme was invented
here during the ledger restructure and shipped without an allocation rule.

Their diagnosis is right and worth keeping verbatim in substance: *a sequential id has no safe
allocation point for concurrent writers — claiming it in the same commit that uses it still
races.* This is not a carefulness problem. Two chats both computing `max(id) + 1` against a file
they both write will collide whenever they work in the same hour, and today they did, twice.

**A per-chat prefix has no shared counter to contend for**, so the failure cannot recur. Recorded
as rule 11b. `D-001`–`D-065` are frozen as the shared sequence; nobody allocates another. This
entry is `DF-001` rather than `D-066` so the convention starts by demonstrating itself.

The renumbering cost fell entirely on Code and Deploy — the build-budget entry took three
different numbers in one day — because its references were theirs to update while the colliding
entries were referenced from Figma work they could not see. That was the right call each time and
it should not have been necessary twice.


<a id="d-065"></a>
### D-065 · 2026-09-07 — The build budget is 1,000 credits a cycle, not 300. **Code and Deploy.**

**Status:** Accepted

**Corrects a figure carried in two places since the free tier.** Bryan confirmed the account from
the Netlify billing page: **Personal plan, $9/month, team `Nero`, 1,000 credits per cycle**,
period 2026-09-07 → 2026-10-06, one concurrent build. The old "300 credits" is the free tier and
understates the budget by more than 3x.

**The cost model, measured rather than quoted.** The billing page reads 984.8 of 1,000 remaining
after the single published build (`e275333`). That is **15.2 credits for one deploy**, which
reproduces D-058's figures exactly: 15 for the build, 0.2 for bandwidth and compute together.
**Builds are the entire cost.** A cycle therefore buys roughly **65 builds**, not 20.

**Changed in three places, because the figure was duplicated:**

| Where | Was | Now |
|---|---|---|
| `DECISIONS.md` rule 12 | "Free tier is 300 credits per cycle" | 1,000, pointing at the new section |
| `netlify.toml`, above `ignore` | "300 credits per cycle ... buys 20 builds" | 1,000 ... about 65 builds |
| `DECISIONS.md` Current state | *(no hosting section existed)* | new **Hosting and deploys** |

**Nothing about the gate changes.** The `ignore` command, the `%s` subject-only read and the `^`
anchor are untouched; only the comment above them. The discipline stands on its own merits — a
build is still 15 credits and still worth batching.

**Why a Current state section rather than only fixing the two figures.** The number lived in a
rules footnote and a TOML comment and nowhere authoritative, which is how it stayed wrong through
a plan change. Hosting, DNS, domain and the credit budget are Code and Deploy's per the ownership
table but had no home in the contract. They have one now.

**Two housekeeping notes on this commit, flagged rather than done silently:**

1. **The decision index was missing `D-059`** and still read "58 decisions". Both fixed here.
   Mechanical repair of a shared index, not a change to Design and Figma's content.
2. **The reminder that prompted this said 300.** It reached Code and Deploy inside the same
   message that announced D-059 — an entry about acting on a value copied from a source that had
   since moved on. Recorded because it shows that failure is structural rather than anyone's
   carelessness: the fix is a single authoritative home per fact, which is what D-059's
   Current-state split and this section both are.

**Renumbered twice, `D-060` → `D-061` → `D-065`, on the day it was written.** Design and Figma
allocated the same id twice within an hour, because nothing reserves one: both chats read "the
next number", and both reads were correct when made. This entry moved each time rather than
theirs, on the same principle each time — every reference to it is Code and Deploy's to update
(the index row and the `netlify.toml` comment), and theirs are referenced from Figma work this
chat cannot see.

**Twice is a broken convention, not bad luck.** A sequential id shared by concurrent writers has
no safe allocation point: claiming it in the same commit that uses it — which is what both chats
did — still races. A per-chat prefix (`C-012`, `D-047`) cannot collide, because no two chats draw
from one sequence. That is a change to a shared rule, so it is raised here rather than taken.


<a id="d-064"></a>
### D-064 · 2026-09-07 — Weights reverted; the eyebrow keeps its ink. **Bryan's call. Supersedes D-061.**

**Status:** Accepted

**⚠ CODE AND DEPLOY — the font imports requested in `D-061` are withdrawn. Do not add them.**
If they are already added, they are harmless but dead weight and should come out.

Bryan reverted the reweighting he had made earlier the same day, keeping only the colour change.

| Style | Briefly was | Back to |
|---|---|---|
| `Display / 2XL` | Serif Bold 700 | **Serif SemiBold 600** |
| `Display / XL` | Serif Medium 500 | **Serif SemiBold 600** |
| `Eyebrow` | Sans Bold 700 | **Sans Medium 500** |

Both styles also had the spaces removed from their names (`Display/2XL`); those are restored, so
all twelve styles use the same ` / ` convention again.

**Weights in use are back to SemiBold 600, Medium 500, Regular 400 and Serif Italic 400 — and
every one of those is already loaded.** The Sans is the variable file at `100 700`; the Serif
static files loaded are 400, 400-italic and 600. Nothing outstanding.

**What is kept: the section eyebrow is `--color-fg`.** Bryan's reason — separating it from the
keyword shown on project cards, which read as the same tier.

Two notes on that, since the description and the file disagreed slightly:

- **It is ink, not accent.** Bryan described it as "that purple text colour"; the bound variable
  is `color/fg`, `#361A38`. It reads purple because the ink on this site *is* plum. That is the
  better outcome — `--color-accent` is the charge and marks the selected filter link only, and
  spending it on static section labels would have made it decorative rather than functional.
- **The two were never the same style.** The card keyword is `Label` at 13px Medium; the section
  eyebrow is `Eyebrow` at 15px Medium. Different styles and different sizes — but both were
  uppercase, tracked and muted, so they read as one tier. Colour now separates them; size always
  did, quietly.

**Code and Deploy — one line.** `base.css` sets `.eyebrow { color: var(--color-muted) }`. It
should be `var(--color-fg)`. Nothing else changes.

**`docs/copy-constraints.md` re-measured**, which is the standing obligation after any text-style
change and its first real test. The eyebrow weight moved the discipline figures: at Bold,
`SIGNAGE & WAYFINDING, CODE SIGNAGE` measured **342px against 342px** of mobile width — no slack
at all. At Medium it is **334px**, so it fits with 8px to spare. **A weight revert turned "wraps"
into "just fits."** That is exactly why the file says re-measure rather than assume.


<a id="d-063"></a>
### D-063 · 2026-09-07 — A fourth chat for copy, which does not use this ledger. `src/content/` moves to it. **Bryan's call.**

**Status:** Accepted

**Code and Deploy: you lose `src/content/**`. That is the actionable part.**

A Content and Copy chat joins. It is deliberately shaped unlike the other three: **it does not
read or write this ledger.** It edits the source files directly, the way Bryan does between
sessions, and the rest of us adapt to what we find — which is already how both chats handle his
own edits, and it has worked all day.

**Why not make it a fourth ledger writer**, which was this chat's first proposal and was wrong:

- **The coupling between copy and design is observable in the output, not announceable.** A
  keyword too long shows up as a wrapped filter; a scope line too long shows up as a taller card.
  Nobody needs telling — someone needs to look. Code and Deploy caught the seven-vs-six keyword
  mismatch this morning by reading the built page, not by being sent a message.
- **Shared mutable state is where this project's mistakes come from.** The worst error today was
  Design acting on a stale read of this file and destroying a live routed item (`D-059`). A
  fourth writer multiplies that; a fourth *worker* does not.
- **So coordination is replaced by constraints.** Instead of "tell Design before changing a
  keyword", the rule is "a keyword label is ≤ 14 characters". A limit enforces itself. A message
  has to be sent, read, and acted on by someone who might be holding a stale file.

**`docs/copy-constraints.md` is new and is the mechanism.** Measured, not estimated — real text
nodes in the production styles at the real container widths. It carries the four limits that
actually bite and states plainly which parts of the site have no meaningful limit. **Design owns
it and must re-measure after any text-style change**, because size, weight, family and tracking
all move the numbers. Bryan's `Eyebrow` reweight to Bold earlier today already did.

**Ownership moves.** `src/content/**` is Content and Copy's exclusively. Code and Deploy edited
those files as recently as today — the keyword fix — and stops. The reason is not tidiness: two
chats editing the same files in the same working tree is a collision surface **that lives in git
rather than in this ledger, so nothing is watching it.** Content changes either chat needs go to
Bryan, who brings them to Content and Copy.

**Detection, since there is no routing.** Content and Copy regenerates `CONTENT-TODO.md`
(`npm run todos`) with any keyword or scope change and commits it. That file lists the live
keyword set with counts, read from the content itself, so drift stays visible to everyone without
a message being sent. It is the only detection there is.

**Content and Copy never tags a deploy.** Builds stay with Code and Deploy.


<a id="d-062"></a>
### D-062 · 2026-09-07 — The WORK eyebrow above the project title is removed. **Bryan's call.**

**Status:** Accepted

A project page carried **three** routes to the index: the header nav, a `WORK` eyebrow above the
title, and `← All work` at the foot. The eyebrow goes.

Removed from all six project frames — three desktop, three mobile. The `← All work` link **stays**:
it is a different affordance, offered where the reading ends rather than competing with the title
at the top.

**Worth knowing, and it slightly complicates the reasoning.** On a project page the header's
`Work` already carries `aria-current="page"`, because the route is `/work/<slug>` and the nav
matches on `path.startsWith('/work')`. So the header link the removal relies on is styled as
*"you are here"* rather than as a destination. That is defensible — section-level highlighting is
normal and a project page is inside Work — and the foot link covers the explicit return. Flagged
rather than changed.

**Option not taken, offered for later:** the eyebrow slot could carry the project's **keyword**
instead of the word `WORK`, mirroring the card on the work index and putting information where a
redundant nav link used to be. Bryan asked for removal, so that is what was drawn.

<a id="d-061"></a>
### D-061 · 2026-09-07 — Bryan reweights the display ramp and the eyebrow. **Bryan's edit, in Figma.** ⚠

**Status:** Superseded by D-064 — the weights were reverted the same day. **The two font imports it asks for are NOT needed; do not add them.**

Made directly in Figma between sessions and read back here rather than reported.

| Style | Was | Now |
|---|---|---|
| `Display/2XL` | Serif SemiBold 600 | **Serif Bold 700** |
| `Display/XL` | Serif SemiBold 600 | **Serif Medium 500** |
| `Eyebrow` | Sans Medium 500 | **Sans Bold 700** |

**The ramp is now non-monotonic, and that reads as deliberate.** Across 48 → 32 → 22 the weight
runs 700 → 500 → 600, so the lightest of the three display styles sits in the middle. That fits
what each does: 2XL is a page label (`Work`) and can carry weight; XL is the landing statement, a
sentence you actually read, so lighter suits it; Title/Large needs weight back to hold at 22px.

**⚠ CODE AND DEPLOY — two imports are required, or this renders wrong.**

`base.css` loads Serif **400, 400-italic and 600 only**:

```css
@import '@fontsource/ibm-plex-serif/500.css';   /* Display/XL  — Medium */
@import '@fontsource/ibm-plex-serif/700.css';   /* Display/2XL — Bold   */
```

The package already ships both (it ships 100–700 plus italics), so this is two lines and no
install. **The Sans needs nothing** — it is the variable file, declared `font-weight: 100 700`, so
Bold 700 for the Eyebrow is already covered. Verified by reading the `@font-face` range, not
assumed.

**What happens without them is worse than it looks.** The browser does not fail visibly — it
matches the nearest loaded face. A request for Serif 500 resolves down to **400**, and Serif 700
resolves down to **600**. So the landing statement and the work-index heading would both render a
step lighter than drawn, with nothing in the console and no visual error to notice. Some engines
additionally synthesise, which the settled rule **"No synthesised faces, ever"** forbids outright.

A `--weight-bold: 700` token is also needed; `tokens.css` currently stops at `--weight-semibold`.

**Naming, minor.** The two renamed styles dropped the spaces around their slash — `Display/2XL`
and `Display/XL` against `Title / Large`, `Body / Strong`, `Body / Small`, `Body / Large`,
`Body / Medium`. Figma groups on `/`, so the display pair now sits in a group named `Display`
while the rest sit in `Title ` and `Body ` with trailing spaces. Harmless, but it is a
half-migration: either finish it across all eight or revert the two. Design's to tidy, not urgent.


<a id="d-060"></a>
### D-060 · 2026-09-07 — Contact consolidates on About; header baseline locked; keyword counts drop to the baseline

**Status:** Accepted

Three changes routed from Code and Deploy with the built state measured rather than remembered.
Drawn across both breakpoints. **Supersedes D-049 §3 and §5.**

**1. Contact leaves the chrome.** Header nav is **Work · About**; the footer is **Terms of Use ·
Privacy Policy**. All contact lives on About. D-049 §3 moved Contact *into* the nav on the
reasoning that people do not reach the bottom of a page — that reasoning still holds, and is now
outweighed by wanting one place for contact rather than three.

**The About block, as drawn.** Desktop gains a third column: portrait `1fr`, biography `2fr`,
contact `1fr`, 64px gutters — so on a 1392px content width, 316 / 632 / 316. Mobile stacks it
after the biography. Contents:

- **`CONTACT`** in the Eyebrow text style — **not** the Eyebrow *component*, which carries a rule.
  A fourth rule would need a reason and this is not one: the block is a distinct column element,
  not a break in a flow of content. Space separates it.
- **`Based in New York City`** in muted. Bryan's addition.
- **`bryanc9624@gmail.com` · `LinkedIn` · `Download résumé (PDF)`**, in that order. Email renders
  as the **address**, not the label "Email" — copyable, and it reads as an invitation. Résumé
  stays and sits last: it is a document rather than a channel, but a recruiter landing on About
  wants it, and splitting it out would make two undersized blocks.

**Two things found while drawing.** Figma's About was missing the LinkedIn link the code has
always had — added. And the portrait kept its old height when its column narrowed; its 4:5 ratio
is restored at 316 × 395.

**Flagged for Bryan, not decided:** the last biography paragraph ends *"Lives and works in Queens,
New York."* and the new block says *"Based in New York City."* Those duplicate, and disagree on
specificity. The biography is Bryan's copy, so this chat will not edit it — one of the two should
go.

**2. The mobile stack stays, and with it the `Breakpoint` axis.** The routing document measured
306.9px against 342px at 390px and asked whether six `SiteHeader` variants could collapse to
three. They cannot: the media query runs `0–639px`, and at **320px** there is 272px of content
width against 307px of row. **The row stops fitting below a 355px viewport.** Keeping the stack.

**3. Header baseline alignment is now a spec, not a coincidence.** Verified in Figma: all three
Desktop variants are `counterAxisAlignItems: BASELINE`, as is the nav row inside them; the Mobile
variants are `MIN`, which is correct for a vertical stack. So Figma and code already agreed, and
agreed on purpose. Recorded in Current state with the reason — serif and sans share neither cap
height nor x-height, so only baseline survives the wordmark changing size.

**4. Keyword counts sit on the baseline.** `FilterLink` moves from `counterAxisAlignItems: MIN`
(which is what raised the figure above the x-height) to `BASELINE`, gap `2px → 4px` — 0.25em at
17px, widened because a baseline figure sits optically closer to the label's mass than a raised
one did.

**On the descender question, which drove the answer:** the count sits **at** the baseline, never
below it. Five of seven labels carry descenders — `Signage`, `Digital`, `Photography`, `Identity`
— and a numeral dropped below the baseline lands exactly in the space their `g` and `y` occupy.
At the baseline it clears them completely while still reading as lowered against the old
superscript. Checked on a `Signage` probe, not on `All`.

**Row height is unchanged at 26px**, before and after — the constraint that mattered, since the
filter's hairline is one of the three sanctioned rules on the site and must not drift.

**Size stays `--size-xs`.** A count at full size beside a `--size-base` label reads as part of the
label rather than an annotation of it.

**One mismatch left for Code and Deploy to reconcile:** Figma draws the count at **Medium 500**;
`work/index.astro` renders it at regular weight. Nobody has raised it, and the routing document
asked for the treatment to be preserved, so this chat changed neither. Pick one and say which.


<a id="d-059"></a>
### D-059 · 2026-09-07 — The final six keywords, and a routed item that was destroyed and restored

**Status:** Accepted

**Raised by Code and Deploy** from the built page: the site rendered **seven** keywords where the
consolidation settled six, and two were not in the agreed set.

**Design's ruling — vocabulary only.**

- **`Art` → `Fine Art`.** `Art` beside `Photography` and `New Media` is a category error; those
  are also art. `Fine Art` names a medium-specific practice rather than a superset.
- **`Visual Communications` removed** from Dura, which keeps `Signage`. It was consolidated into
  Signage already, matched one project, and at 192px was the longest label in the set — the
  string that wrapped the mobile filter to five rows and triggered the consolidation.
- **Six:** Photography 4 · Identity 4 · New Media 3 · Fine Art 3 · Signage 2 · Digital 1.
- **`Digital` stays at one** deliberately: seven characters, no wrapping cost, a real axis.

**Left to Bryan:** `represent-1` and `resemblance-1` carry Fine Art alongside Identity. The
consolidation mapped both to Identity from *Exhibition Design*, so this was added later. It may
well be the better description of New Media Artspace work. Which projects carry which keyword is
editorial; only the vocabulary was Design's to settle.

**Recorded because it matters more than the decision:** this item was **deleted by Design and
Figma** during the ledger restructure, and the restructure commit then reported "zero open items
anywhere in the file." The section was rebuilt from a hardcoded "Nothing open" taken from an audit
run *before* Code and Deploy raised the item. The pull was clean; the input was stale.

That is the same failure as the stale swatch hexes and the superseded colour table — **acting on a
value copied from a source that had since moved on** — committed by the chat that spent the day
building defences against it, at the largest available scale. Recovered verbatim from `29a3b72`.

**The lesson, and it is now rule 9a:** when rewriting a section, read that section at write time.
Never rebuild it from an earlier reading, however recent.


<a id="d-058"></a>
### D-058 · 2026-09-07 — Shipped. First deploy ran, and the domain was cut over to Netlify.

**Status:** Accepted

**The site is deployed.** `[deploy] Ship the rebuilt site` (`e275333`) published in 19s for 15
credits — **exactly one build.** Every untagged commit behind it shows *Canceled* in the deploy
log, which is the end-to-end proof the gate works that could not be had any other way. Earlier
commits show *Skipped due to account credit usage exceeded*; that is the exhausted free cycle,
not the gate.

**DNS moved off Cargo.** `bryancampana.com` is delegated to Netlify DNS —
`dns1..4.p04.nsone.net`, confirmed at the .com registry. The bare domain is canonical, which
`astro.config.mjs`, the canonical tags and `robots.txt` already assumed, so no rebuild was
needed. Netlify serves both apex and `www`.

Pre-flight before the switch: the zone was queried directly on Netlify's nameservers and the
site fetched by forcing resolution to their IPs. Both returned the shipped site, so the cutover
was verified before the registrar was touched rather than after.

**Still in progress at time of writing — the TLS certificate.** Netlify serves the site over
HTTP (200) but HTTPS fails; Let's Encrypt has not issued yet. Google's resolver still holds
Cargo's A record, which stalls domain validation. Expected, not a fault.

**A correction worth recording, because it nearly closed the item early.** This chat reported
HTTPS as working on the strength of a valid certificate for `bryancampana.com` — it was
**Cargo's** certificate, dated August, served from Cargo's IP. The lesson generalises: during a
cutover, a check against the hostname proves nothing about which server answered. Pin the IP
(`curl --resolve`) and compare both.

**Cargo must not be cancelled yet.** It currently holds the only valid HTTPS on the domain, so
visitors resolving through stale DNS still get a working site. It stays until Netlify's
certificate is issued and verified.



<a id="d-057"></a>
### D-057 · 2026-09-07 — Muted retuned and the nav gains a weight cue, in code. **Code and Deploy.**

**Status:** Accepted

Implements the routed item. Three edits, all verified in the browser in both schemes.

| | Was | Now | On its ground |
|---|---|---|---|
| `--color-muted` light | `#7E6F7E` | **`#75617A`** | 4.71 → **5.60:1** |
| `--color-muted` dark | `#A4A4A4` | **`#C9BFCD`** | 7.80 → **10.94:1** |

The dark value was pure neutral — `r = g = b` exactly — and never belonged to the palette.
Measured gaps to the ink stay deliberately unequal, **2.75 light and 1.78 dark**: a dark
surround exaggerates lightness differences, so equal perceived separation needs a smaller
measured step. Both figures reproduced exactly as the design entry predicted.

`nav a[aria-current='page']` now carries `--weight-medium` as well as `--color-fg`. Verified:
the current item computes weight 500 in both schemes, the inactive item 400. This was the only
place on the site where state rested on colour alone, and softening muted would have pushed it
toward invisible.

The stale source-of-truth comment in the dark block now points at "Current palette — THIS TABLE
WINS" rather than "Colour VALUES settled". Dark has no Figma to check it against, so that
pointer is its only guard.



<a id="d-056"></a>
### D-056 · 2026-09-07 — Closing out Design and Figma's open list before launch. **Three items, three different closes.**

**Status:** Accepted

Bryan asked for this chat's side to be clean ahead of a deploy. Nothing below changes the built
site; all of it is Figma-side or scope.

**1. Unbound white fills — removed. 74 nodes.**

Layout frames across the file carried hardcoded `#FFFFFF` fills: `nav`, `legal`, `intro`, `grid`,
`row`, `article`, `rail (sticky)`, `facts`, `body`, `media`, `prose`, `section`, `about`,
`portrait`, `text`, `links`, `image set`, `figure`, `h1`, `FilterBar`. Invisible on white, and
pure noise — a container should not paint a ground.

Cleared on all three working pages, leaving the top-level page frames (which legitimately hold the
ground) and every variable-bound fill untouched. **Verified by screenshot: the landing page is
pixel-identical before and after.** This is also what made the dark-mode question answerable —
under a theme switch those 74 fills would have rendered as white blocks over everything.

**2. The "More work" control — decided against for launch. Design and Figma's call.**

Logged when previous/next navigation was removed: *"a 'More work' control offering two or three
projects sharing a keyword would give the intent without the downside. Not designed."* It stayed
open on the grounds that it was a better version of a thing that had been removed.

**Not building it, and not because of time.** With 14 projects, every project page is one click
from a work index that is already filterable by exactly the axis such a control would use —
keyword. A "more work" rail would be a second, worse route to the same page: three projects chosen
by a rule instead of fourteen chosen by the reader. It duplicates the filter's job on a catalogue
too small to need two routes.

Revisit if the work grows past roughly thirty projects, where scanning an index stops being
pleasant and a curated tail starts earning its space. Recorded as a decision rather than a
deferral so it is not re-raised as an oversight.

**3. Figma is behind the code on photography column counts — documented, not redrawn.**

`ProjectPhotography.astro` now derives a desktop column count from image count: **≤2 images → one
column full width, 4 → two-up, otherwise three-up**, overridable per project by a `columns`
frontmatter field (`shapes-and-colors` sets `1`). Figma's photography project page draws **two-up
only**, which now describes just the four-image case.

**Deliberately not redrawing it now.** Representing four column counts across two breakpoints is a
real session's work, and the frames would need redrawing again the moment a project's image count
changes — the layout is a *rule* in code, and Figma frames are instances of a rule, so they will
always trail it.

**What matters is that nobody mistakes the drawing for the spec.** So, explicitly:

> **For photography galleries, the code is the source of truth, not Figma.** The Figma frame shows
> one case. Do not "correct" the code back to two-up on the strength of it.

Same applies to the sibling changes that landed in code and are not in Figma: full-width stacked
one- and two-image sets, letterpress running image-first, and the `cover.<ext>` card convention.
All are Bryan-approved and correct on the site.

**Still open on this chat's side after the above: nothing that blocks a deploy.** The only
outstanding design decision anywhere is `--color-muted`, which is implementation, routed to Code
and Deploy, and listed in their section.



<a id="d-055"></a>
### D-055 · 2026-09-07 — Muted is retuned, and the current nav item gains a weight cue. **Bryan's call. Applied in Figma.**

**Status:** Accepted

**Code and Deploy: two changes, at the bottom.**

Bryan: the grey on the disciplines and keyword filters does not fit the system; light is tolerable
but off, dark should sit much closer to white. His reasoning, worth keeping verbatim in spirit —
*typography is already creating the hierarchy, so colour should be subtle and let form do the
heavy lifting.* Agreed, and adopted.

**Correcting the premise, because it changes the fix.** The two modes were not the same grey.
Light `#7E6F7E` is plum-tinted (r−g = 15). Dark `#A4A4A4` is **pure neutral, r = g = b exactly**.
Light already belonged to the system; dark never did.

**Why dark could not be fixed by deriving it.** The colour system defines muted as *diluted ink —
same hue, less of it*. In dark, ink is white, so diluting toward the ground should pick up the
ground's violet. It does not: white mixed toward `#0F0C0F` lands at r−g = 1, effectively neutral.
That traces straight back to Bryan's own earlier decision to hold the dark ground's chroma at
0.006 so a saturated ground would not fight the photography. That decision was right and this is
its downstream cost: **nothing derived from the dark ground can carry the violet, so dark's muted
has to be tinted deliberately.** Recorded because the same trap waits for any future dark value.

| | Was | Now | vs ground | Gap to ink | Tint (r−g) |
|---|---|---|---|---|---|
| Light | `#7E6F7E` | **`#75617A`** | 4.71 → **5.60:1** | 3.28 → 2.75 | 15 → **20** |
| Dark | `#A4A4A4` | **`#C9BFCD`** | 7.80 → **10.94:1** | 2.49 → **1.78** | 0 → **10** |

Light gains violet *and* contrast — it was sitting at 4.71, barely over the 4.5 floor, which was
fragile for a value used on captions and card descriptions. Dark gains a real cast and moves close
to white, which is what Bryan asked for.

**The two gaps differ on purpose (2.75 light, 1.78 dark).** A dark surround exaggerates lightness
differences, so equal *perceived* separation needs a smaller measured step in dark. Same shape of
reasoning as the rule token — state the principle, derive the value — but the principle here is
perceptual rather than a fixed ratio, so the numbers deliberately do not match across modes.

**The nav needed a second cue before colour could whisper.** `nav a` was muted and
`nav a[aria-current]` was fg, with **no weight difference** — colour was the only signal. Softening
muted would have pushed that toward invisible, and "all base text white" would have erased it
outright: the exact defect the ledger fixed when it noted `aria-current` had no visual treatment.

`FilterLink` already got this right — selected is weight **and** colour, two cues, so state never
rests on colour alone. The nav is simply where that rule was never applied. New style:

**`Body / Medium`** — Sans Medium 500 at `size/base`, bound to `font/body` and `size/base`. Applied
to the current item in all six `SiteHeader` variants. **500 rather than FilterLink's 600** because
the nav sits beside a 600 serif wordmark and should not compete with it. This also fills a real gap
— Medium previously existed only at 15px (`Eyebrow`) and 13px (`Label`).

**Not changed, and deliberately:** the footer and image captions stay muted. Bryan's "all base text
white" would flatten the footer to the same voice as body copy, and captions sit under the thing
they describe and should not compete with it. Raised at the time; no objection.

**The two edits:**

| File | Change |
|---|---|
| `tokens.css` | `--color-muted` → `#75617A` light, `#C9BFCD` dark |
| `SiteHeader.astro` | `nav a[aria-current='page'] { font-weight: var(--weight-medium); }` |

Contrast figures above were computed, not estimated, and both new values clear 4.5:1 comfortably.



<a id="d-054"></a>
### D-054 · 2026-09-07 — Figma realigned to the rule token. **Design and Figma confirms Code and Deploy's solution.**

**Status:** Accepted

Checked `715147d` against the file. **Aligned, and their version is better than the spec I handed
them.** Recording the correction here so the ledger does not keep my worse answer.

**What I got wrong.** My transfer spec said: point every rule at `--color-fg`, and treat
`--color-line` as orphaned — I even offered to delete it. Both halves were wrong for one reason.
`--color-fg` means *the colour of text*. A rule bound to it asserts that a rule is text-coloured,
which is true in light and false in dark, and leaves nowhere to say so. The next rule anyone added
would have inherited that silently. I diagnosed the dark-mode problem as **brightness**; it was a
**missing semantic slot**. Same symptom, worse diagnosis.

`--color-line` already names that slot exactly, so reviving it is right and my "unused token" flag
was a misread of what the token was for.

**Their principle, adopted:** *a rule holds the same contrast ratio against its ground in both
modes.* Verified independently here rather than taken on trust — all three figures reproduce:

| | Value | On ground | Ratio |
|---|---|---|---|
| Light | `#361A38` | `#FFFFFF` | **15.42:1** |
| Dark, before | `#FFFFFF` | `#0F0C0F` | **19.45:1** — a quarter hotter, what Bryan saw |
| Dark, now | `#E5E5E5` | `#0F0C0F` | **15.44:1** |

**Figma changes made to match — the visual result is unchanged; the bindings were wrong.**

I had bound the rules to `color/fg`. In light both tokens are `#361A38`, so Figma *rendered*
correctly by coincidence while encoding the exact mistake the code now forbids — anyone editing
`color/fg` would have dragged the rules with it.

1. **`color/line` set to `#361A38`** in both modes, from `#D4CAD4`.
2. **All nine rule strokes rebound `color/fg` → `color/line`**: the `Eyebrow` component, six
   `facts` frames, and both `FilterBar` rules.
3. **The constraint is written into the variable's own description**, so it is visible at the
   point of use in Figma rather than only here: *the only token any rule may reference; never
   bind a rule to `color/fg`*, plus the dark value and the equal-contrast principle.
4. **The Foundations caption now explains both look-alike pairs.** `color/fg` and `color/line`
   are the same swatch in light and diverge in dark; `color/focus` and `color/accent` are the
   same violet on purpose. Two identical-looking chips read as a bug otherwise — and one of these
   pairs is only identical in the mode Figma can show.

**Supersedes** the five-row edit table in "The chrome rules are gone" — rows 3, 4 and 5 of it
named `--color-fg` as the target. The header and footer deletions in rows 1 and 2 stand and are
implemented. Nothing further is outstanding on either side.



<a id="d-053"></a>
### D-053 · 2026-09-07 — `--color-line` is the rule token, and its value is derived, not picked. **Bryan's call.**

**Status:** Accepted

Answers the dark-mode question raised in "The chrome rules are gone". Ink rules read heavy in
dark, and Bryan asked for a systemic answer rather than a one-off override.

**The systemic defect was not the brightness.** Three borders referenced `--color-fg` directly,
and that token means *the colour of text*. Rules had borrowed it because in light mode it
happened to look right, which left nowhere to say "a rule in dark is not text in dark" — and the
next rule anyone added would inherit the same assumption silently.

**`--color-line` is revived as the rule token.** It was orphaned by the previous entry and it
already names exactly this role. Every rule on the site points at it; **no rule may reference
`--color-fg` again.** That constraint is written into `tokens.css` and is the durable part of
this entry.

**The value follows a stated principle: a rule holds the same contrast ratio against its ground
in both modes.**

| Mode | Rule on ground | Ratio |
|---|---|---|
| Light | `#361a38` on `#ffffff` | **15.42:1** — the weight already approved, unchanged |
| Dark, before | `#ffffff` on `#0f0c0f` | 19.45:1 — 26% hotter, which is what Bryan was seeing |
| Dark, now | **`#e5e5e5`** on `#0f0c0f` | **15.44:1** |

Neutral grey rather than the violet-cast `#e9e3e9` at the same ratio — Bryan's pick. At that
lightness the chroma is below the threshold where anyone perceives it, so the cast buys nothing.

Derive any future value the same way rather than choosing by eye. WCAG 1.4.11 asks 3:1 for
non-text; this clears it five times over.

**Design and Figma:** `color/line` needs its light value set to **`#361a38`** — it currently
holds the retired hairline `#d4cad4`. The dark value cannot live in Figma, since the collection's
modes are Desktop/Mobile; this ledger stays the source of truth for it. Bryan is taking this over
himself.



<a id="d-052"></a>
### D-052 · 2026-09-07 — The deploy gate was inverted and burned the whole billing cycle. **Fixed.**

**Status:** Accepted

**Symptom.** Netlify credits hit 300/300 on the first day, with one intended deploy.
Billing shows **20 production deploys = 300 credits**; bandwidth, web requests and
compute together came to 0.2. Builds were the entire spend. Production deploys are now
paused until the cycle resets on **2026-10-07**. The published site is still up, frozen
at `main@07d3b23`.

**Not an external cause.** One project, linked to the GitHub repo. No build hooks, no
build plugins enabled, no scheduled builds. The only trigger is a push to `main`.

**Root cause — the guard fired the builds it existed to prevent.** The rule added in
`5ed32cd` read:

```
ignore = 'git log -1 --pretty=%B | grep -qF "[deploy]" && exit 1 || exit 0'
```

`%B` is the **whole commit message, body included**. Commit bodies in this repo discuss
the deploy rule — `fa56798`'s body says *"Not deployed -- no [deploy] tag."* That literal
string matched, so the commit announcing it would not deploy is the commit that deployed.
**17 commits on `main` matched. One meant to.** Roughly 11 further builds predate the rule
entirely (it landed at 10:22; the repo starts at 00:26), which accounts for the balance.

**Fix — subject line only, anchored.** Bryan chose the strict form:

```
ignore = 'git log -1 --pretty=%s | grep -q "^\[deploy\]" && exit 1 || exit 0'
```

`%s` is the subject alone, so bodies can discuss the rule freely. `^` means a subject that
merely *mentions* the tag does not trigger either. Verified against all 95 commits on
`main`: the old rule fires on 17, the new rule on 1 — `587de3c`, the intended deploy.
Edge cases checked: `docs: explain the [deploy] tag` correctly skips.

**A deploy commit's subject must now START with the tag**, e.g.
`[deploy] feat: social preview cards`. Anywhere else in the subject does nothing.

**Dry-run before pushing** — this is the check that was missing, and the reason the fault
stayed invisible for a full day:

```
git log -1 --pretty=%s | grep -q "^\[deploy\]" && echo BUILD || echo skip
```

**CLOSED — Deploy Previews are FREE and stay on. Corrected 2026-09-07.** This entry
originally said a pull-request preview was "one build out of the 20". **That was wrong**,
and it was written by this chat without checking. Netlify's docs are explicit:

> "each successful production deploy consumes 15 credits ... and you have free deployments
> for previewing, experimenting, and creating versions of your site/app"

**Only production deploys are billed.** Deploy Previews and branch deploys cost nothing.
The account's own billing page said as much and was misread — the line item reads
*"Production deploys — 20 deploys — 300 credits"*, and there is no line item for previews
because they are not charged.

Two further facts from the same source, both useful and neither previously recorded:

- **Failed deploys do not consume credits.** A broken build is free.
- **Rolling back to a previous production deploy does not consume credits.** Reverting a
  bad release is free; only rolling *forward* costs 15.

**So: Deploy Previews stay enabled.** They are the free way to look at a change on a real
URL before spending 15 credits on production — which is exactly the discipline rule 12
asks for. Nothing to turn off.

**One month of Personal, then back to Free. Bryan's call, 2026-09-07.** Free is 300 credits
(20 builds); Personal is $9 for 1,000 (66); Pro $20 for 3,000 (200). The ceiling was never
the problem — 19 of 20 builds were a bug, now fixed. Bryan is buying **one month of Personal
purely so work is not frozen until 2026-10-07**, and intends to return to Free after. This
is a scheduling decision, not a capacity one.

**Consequence for both chats: deploys are available again, and they are still scarce.** The
gate is fixed, so nothing builds unless a commit subject starts with the tag — but the
budget is one month of headroom bought with real money. Keep batching: one tagged commit at
the end of a session, not one per change.

**Action item for Bryan, not for either chat:** downgrade to Free before the Personal plan
renews, or it bills again. Worth a calendar reminder for early October.



<a id="d-051"></a>
### D-051 · 2026-09-07 — The chrome rules are gone. Every remaining rule is ink. **Bryan's call. Drawn in Figma.**

**Status:** Accepted

**Code and Deploy: this is the transfer. Five edits, listed at the bottom.**

Bryan did not like the header and footer rules once they were built full-bleed, and chose to
**remove them entirely** rather than shorten or lighten them. Then: *"make the left over rules
the same colour as the purple rules we're deleting."*

**What that produces is a simpler vocabulary than the site has ever had — one rule, one meaning.**

| Before | After |
|---|---|
| Ink `color/fg` at the page edges — header, footer | **No rule.** Chrome is marked by position and space |
| Hairline `color/line` inside content — eyebrow, facts, filter | **Ink `color/fg`.** The only rule on the site |

Previously ink meant "the site chrome ends here" and a hairline meant "one block of content ends,
another begins." With the chrome rules gone there is nothing for the first meaning to mark, so
the second inherits the ink. **A rule now always means the same thing: a break within content.**

**Supersedes** "Horizontal rules get a hierarchy" (2026-09-07) and its follow-on that bracketed
the page in ink at both ends. Both were correct decisions about a two-level system that no longer
exists. The two-level table in that entry is dead — do not implement it.

**The full-bleed decision survives, and the objection to it dissolves.** Header and footer still
span the viewport with their contents padded `--page-pad` from the window edges — that is what
stops the chrome being narrower than the work on 1600 project pages. What Bryan objected to was
never the width; it was a 1px ink line running the whole monitor. With no line there, full bleed
costs nothing and the ultrawide trade-off flagged earlier no longer applies.

**Two discrepancies found and fixed while doing this.**

1. **Figma had never drawn an edge-to-edge rule.** Its header sits at `x=24` with width
   `frameWidth − 48`, so the rule always stopped 24px short of each frame edge. The code put
   `border-bottom` on the full-bleed element, so it ran the entire viewport. **The gap was in the
   spec, not the implementation** — the entry that asked for full bleed pinned the *content*
   width and said nothing about where the *rule* should end. Two questions; only one was answered.
   Moot now that the rule is gone, recorded so the class of mistake is not repeated: when
   specifying a full-bleed element, say what happens to its border.
2. **The work index filter rule existed in code and not in Figma.** `work/index.astro` draws a
   `border-bottom` under `.filter`; the Figma `FilterBar` had no stroke on either breakpoint.
   Added to both, in ink, so the two agree.

**Worth Bryan's eye on the built site, not a blocker: dark mode.** `--color-fg` is `#FFFFFF` in
dark, so these rules become pure white on the `#0F0C0F` ground — 19.43:1, *higher* contrast than
the plum-on-white they replace at 15.44:1. They will read heavier in dark than in light. If that
is too hot in the browser, the fix is a dark-only rule colour, which needs a decision here first.

**`--color-line` now has no users.** Nothing on the site draws it any more. Keeping the token and
the `color/line` variable for now rather than deleting: removing it touches both palettes and the
Figma collection, and the role it names — the construction line — is a plausible return. **Design
has no objection to deleting it if Code and Deploy would rather not carry a dead token**; flagged
rather than decided, because an unused token is exactly the kind of rot this file keeps finding.

**The five edits:**

| File | Change |
|---|---|
| `SiteHeader.astro` | Delete `border-bottom: 1px solid var(--color-fg);` |
| `SiteFooter.astro` | Delete `border-top: 1px solid var(--color-fg);` |
| `base.css` — `.eyebrow` | `border-bottom` colour `--color-line` → `--color-fg` |
| `ProjectFacts.astro` | `border-block-start` colour `--color-line` → `--color-fg` |
| `work/index.astro` — `.filter` | `border-bottom` colour `--color-line` → `--color-fg` |

No spacing changes. Padding and margins around the header and footer are unchanged — the space
that was there is what now separates them, and it reads correctly in Figma at both breakpoints.



<a id="d-050"></a>
### D-050 · 2026-09-07 — The wordmark is serif, at body size. New `Wordmark` text style. **Bryan's call.**

**Status:** Accepted

**Code and Deploy: one CSS line, detail at the bottom.**

The name in the header is now **IBM Plex Serif SemiBold at 17px** (`size/base`) — serif because it
is identity rather than navigation, and 17px because it shares a line with the nav and must not
step up in size. Both halves were Bryan's instruction: *"serif typeface and the size should match
the header elements size."*

**Size note, because it looks like a change and is not.** The wordmark and the nav links were
*already* both 17px. What reads as a size difference is weight — SemiBold against Regular. The
instruction is therefore a constraint on the serif swap, not a resize: the serif had to land at
`size/base` rather than promote itself into the display ramp.

**This did NOT become a change to `Body / Strong`, and that matters.** The obvious move was to
flip that style back to serif, since the wordmark was its main user. Checked first, and
**`FilterLink` State=Selected uses it too** — the selected keyword on `/work`. Flipping the style
would have silently turned that serif, contradicting the settled FilterLink rule that the
selected state differs by **weight and colour**, never by family.

So the wordmark got its own style instead:

| Style | Family | Weight | Size | Used by |
|---|---|---|---|---|
| **`Wordmark`** *(new)* | `font/display` — Serif | SemiBold | `size/base` 17px | The header name, and nothing else |
| `Body / Strong` | `font/body` — Sans | SemiBold | `size/base` 17px | `FilterLink` State=Selected |

Both bind family and size to variables, so neither can drift. Applied to all six `SiteHeader`
variants. The serif sets 8px wider (125 → 133), which changes nothing: desktop uses 391 of 1392,
and mobile stacks.

**Relationship to the earlier entry in this log.** "Figma brought in line with the code's type
decisions" moved `Body / Strong` from serif to sans, reasoning that the wordmark is an anchor
inheriting body type. That change was correct and stands — `Body / Strong` is sans, and
FilterLink is why. What is superseded is only the *conclusion about the wordmark*: it no longer
uses that style at all. Bryan has restored the serif on the name directly.

**Code and Deploy — the wordmark now needs an explicit family.** It currently inherits
`--font-body` from `body`, which is sans:

```css
.site-header__name { font-family: var(--font-display); font-weight: var(--weight-semibold); }
```

No size rule needed — 17px is already the inherited `--size-base`. Do not reach for
`--font-serif` directly; `--font-display` is the token that carries this role.



<a id="d-049"></a>
### D-049 · 2026-09-07 — Header reworked: full width, everything left, Contact moved up from the footer. **Bryan's call. Drawn in Figma.** ⚠

**Status:** §3 and §5 superseded by D-060 — Contact left the chrome entirely and the footer lost LinkedIn. §1 (full bleed), §2 (flush left) and §4 (the mobile stack) all stand.

**Code and Deploy: this is ready to implement, and one part of it is a code-only fix.**

**1. Full width — Figma was already right; the code is what is wrong.** Every header instance
in Figma sits at `x=24` with width = frame width − 48, including **1552px** on the 1600 project
frames. The code renders `<header class="page">` (`--page-max`, 1440) while project pages render
`<main class="page page--wide">` (`--page-max-wide`, 1600). So on a wide screen the chrome is
80px narrower per side than the work it frames. That is the "awkwardly small" Bryan reported.

Header and footer should **span the viewport**, with their contents padded `--page-pad` from the
window edges rather than centred in a `--page-max` box. This matches the settled rule that chrome
brackets the page while hairlines live inside content: if the header is the edge of the page, it
belongs at the edge of the page.

*Figma cannot show this and is not expected to* — its widest frame is 1600, so full-bleed and
`page--wide` look identical there. The spec is this paragraph, not the frame.

*Known trade-off, flagged not hidden:* above roughly 1900px the wordmark sits at the window edge
while content stays centred at 1600, so the two stop aligning. Judged acceptable — it is the
common pattern and it reads as deliberate. If Bryan dislikes it in the browser, the alternative
is one value: give header and footer `--page-max-wide` instead of full bleed.

**2. Everything is flush left.** The row was `space-between` — wordmark hard left, nav hard
right. It is now `MIN` with a **64px gap** (`space/6`) between wordmark and nav, so the header
reads left to right in one movement and the right side is deliberately empty. Weight and colour
already separate the two: the wordmark is SemiBold ink, the nav Regular muted.

**3. Contact joins the nav and leaves the footer.** Bryan's reasoning: people do not reach the
bottom of the page. Nav is now **Work · About · Contact**.

Contact is a `mailto:`, so it never takes the `aria-current` treatment and stays `--color-muted`
permanently. That is correct rather than a bug — the current-page mark means *you are here*, and
Contact is an action, not a location. No new state needed.

**4. Mobile stacks — this is a real layout change, not just a reflow.** At 390px there is 342px
of content width. Wordmark 125 + gap 64 + nav 194 = **383px**, which overflows by 41px. Closing
the gap to 16px fits at 335px but puts the wordmark 16px from "Work", reading as one run of text.

So under **40rem the header stacks**: wordmark on the first line, nav on the second, both flush
left, 16px between them. Header height goes 74px → 116px. In CSS this is `flex-direction: column`
in the existing 40rem media query; no new tokens.

In Figma this needed a second variant axis, because `layoutMode` cannot be overridden on an
instance — attempting it silently keeps the parent's direction. `SiteHeader` is now
**`Current` × `Breakpoint`**, six variants: None/Work/About × Desktop/Mobile. All nine mobile
frames point at the Mobile variants and reflow correctly, since every mobile frame is vertical
auto-layout.

**5. Figma's footer was missing two links the code already ships.** It had only Terms of Use and
Privacy Policy; the code has Contact, LinkedIn, Terms, Privacy. With Contact moving to the
header, the footer is now **LinkedIn · Terms of Use · Privacy Policy** in both places. LinkedIn
was added to the Figma component; **Code and Deploy needs to remove Contact from `SiteFooter`.**

**Summary for Code and Deploy — four changes:**

| Where | Change |
|---|---|
| `SiteHeader.astro` | Drop `.page` constraint; full-bleed with `--page-pad` inline padding |
| `SiteHeader.astro` | `justify-content: flex-start`, `gap: var(--space-6)`; add Contact `mailto:` |
| `SiteHeader.astro` | Under 40rem: `flex-direction: column`, `gap: var(--space-3)` |
| `SiteFooter.astro` | Remove the Contact link; apply the same full-bleed treatment |



<a id="d-048"></a>
### D-048 · 2026-09-07 — Hosting stays on Netlify. **Bryan's call. Cloudflare question closed.**

**Status:** Accepted

Cloudflare Pages, GitHub Pages, GoDaddy shared hosting and Node.js app hosting were all
priced and measured against this site. Bryan's decision: **stay where we are.** It works, and
the credit budget is manageable as long as deploys stay deliberate.

The numbers behind that, so nobody re-derives them: Netlify Free is **300 credits/month**,
**15 per production deploy**, 20 credits/GB bandwidth, 2 credits per 10k requests. A visitor
who reads five pages costs about 1MB. At four deploys a month that leaves headroom for
roughly 12,000 full visits — traffic will never be the constraint. **Deploys are**, and the
hard ceiling is 20 a month with zero traffic. Running out pauses the site rather than
throttling it, which is why `netlify.toml`'s `[deploy]` guard matters.

**Do not reopen this** without a new reason. The alternatives were researched properly and
the analysis is in this chat's history; the outcome is Bryan's, not a default.

Still true regardless of host: DNS for bryancampana.com is served by Cargo's nameservers, so
nameservers must move before Cargo is cancelled. The Zoho MX/TXT records are not being
carried over — see the mailbox entry.


<a id="d-047"></a>
### D-047 · 2026-09-07 — `/terms` and `/privacy` are approved as they stand. **Bryan's call.**

**Status:** Accepted

Recorded late. Bryan approved the trimmed legal pages verbally — *"Let's cross off the terms
and privacy wording off the list. This is all approved."* — but it was never written down,
so `scripts/content-todos.mjs` kept reporting it as outstanding and it would have been raised
again. The hardcoded line is removed from the reporter.

What they say now is what ships: the Cargo-era clauses about a contact form, Stripe payments,
order fulfilment and analytics were deleted because none of those exist on this site. Nothing
was written to replace them.



<a id="d-046"></a>
### D-046 · 2026-09-07 — No synthesised faces, ever. **Bryan's rule.**

**Status:** Accepted

His words: he has *"no intention or desire or need to force a font to display an italic. If
there is an italic element of text on my website, then we should use the proper font."*

`--font-italic` already routed italics to IBM Plex Serif, the only family here with a drawn
italic. **That token was not sufficient on its own.** It fixes the family; it does not stop
the browser faking a face it lacks. Only serif **400** italic is loaded, so an `<em>` inside
a heading or inside Body / Strong would have wanted serif *600* italic — not loaded, and
mechanically slanted without complaint.

`font-synthesis: none` is now set on `html`. Anything not actually loaded renders upright
and is visible as a problem, rather than shipping a counterfeit. It covers bold on the same
terms.

Nothing today depends on synthesis — every weight in use is a real loaded face: sans as a
variable font covering 400/500/600, serif 600 for display, serif 400 italic for the design
question. **No italic renders anywhere on the site right now**; all 14 design questions are
blank and no project body contains emphasis. This is a guarantee held in advance, not a fix.

**Consequence if an italic is ever wanted in a heading or in bold text:** the real face has
to be added to the Fontsource imports in `base.css` first. It will look wrong until it is,
and that is deliberate.


<a id="d-045"></a>
### D-045 · 2026-09-07 — Rule hierarchy implemented in code. **Code and Deploy.**

**Status:** Accepted

The three instructions in "Horizontal rules get a hierarchy" were unactioned in the code
until now; Figma and the ledger were ahead of the site. Done: header `border-bottom` and
footer `border-top` rebound from `--color-line` to `--color-fg`, and the facts block's
bottom rule removed. That last one had been `border-block`, the shorthand for both edges, so
the bottom rule existed without anyone deciding it should.

Verified in the browser: header and footer resolve to `--color-fg`, facts top is a 1px
hairline, facts bottom is 0px. The site now carries the two-level vocabulary the design
entry describes — ink at the page edges, hairline inside the content.

Token audit at the same time: **all 30 Figma variables match `tokens.css` in both modes**,
including the new `font/italic`. Ten CSS properties have no Figma variable and should not
get one — `--font-serif` is reached through `font/display`, weights and line-heights are
properties of the text styles, `--measure-prose` is in `ch` units.



<a id="d-044"></a>
### D-044 · 2026-09-07 — Figma brought in line with the code's type decisions; Foundations repaired. **Design and Figma.**

**Status:** Accepted

Bryan's instruction: **what is in the code right now is correct.** This entry records Figma
being moved to match it, not the other way round.

**Answering Code and Deploy's two requests directly.** They asked for Body / Body Strong /
Body Small / Body Large / Question to swap to sans. Checked against the file first: **only two
of the five were actually wrong.** `Body`, `Body / Small` and `Body / Large` were already IBM
Plex Sans, and `font/body` was already `IBM Plex Sans`. The two that had drifted:

| Style | Was | Now | Why |
|---|---|---|---|
| `Body / Strong` | Serif SemiBold | **Sans SemiBold** | It is the wordmark, and an earlier entry argued the wordmark "counts as a title". The code disagrees: `.site-header__name` is an `<a>`, not a heading, so it inherits `--font-body`. Body type, not display type. |
| `Question` | **Sans** Italic | **Serif Italic** | Exactly the browser-synthesised slant that `--font-italic` exists to prevent. |

**New variable — `font/italic` = IBM Plex Serif**, scope `FONT_FAMILY`, code syntax
`var(--font-italic)`, matching the `var(--…)` convention its siblings already use. Figma had
nowhere for the italic rule to live, which broke the file's own promise that every variable maps
1:1 to a CSS custom property. `Question` binds to it, so the rule is enforced rather than typed.

**Supersedes** the line in "Serif/sans pairing" reading *"Body Strong is the wordmark, which
counts as a title"*. That reasoning is withdrawn.

**Foundations page repaired — four defects, all in the file's own documentation.**

1. **Swatch captions no longer carry a hex.** Five of six read the pre-plum greys (`#141414`,
   `#6b6b6b`, `#e4e4e4`, `#e8e8e8`, `#0044cc`) while the chips above them rendered correct plum.
   They were typed text, not bound values, so they did not follow the variable change. Rather
   than retype five hexes that would rot again on the next colour change, **each caption is now
   the CSS custom property** — `var(--color-bg)`, `var(--color-fg)` and so on. That is the
   actual contract with the code, it is what you want to copy, and it does not change when a
   value does. Exact values live in the variable itself and in this ledger.
2. **`color/accent` now has a swatch.** The variable existed and the palette page did not show
   it. Seven chips. The caption also now states that `color/focus` and `color/accent` hold the
   same violet **deliberately** — two identical purple blocks otherwise read as a mistake.
3. **"What is deliberately undecided" is gone**, replaced by "What is settled — these are not
   empty slots". It claimed colours were neutral greys and both radius tokens were open slots
   waiting to be filled. Both were settled; a designer reading that page as an invitation would
   have undone real work.
4. **The type specimen shows both families.** It rendered the entire ramp in sans, including
   `size/2xl`, `size/xl` and `size/lg` — the three serif display styles. Those three are now
   serif and bound to `font/display`; the three reading sizes bind to `font/body`; the italic
   line is set in Plex Serif Italic and bound to `font/italic`, so it demonstrates the rule it
   describes. The typeface section named only Plex Sans and now documents all three variables.

Verified by screenshot, not by return value: the first pass widened the swatch row into the
documentation frame and clipped the accent chip by 16px. The script reported success. Only the
render showed it. Fixed with a 64px gutter and re-checked.

**Note for both chats — `get_metadata`'s page listing is unreliable.** It reports this file as
having one page; it has four. Use a read-only `use_figma` running
`figma.root.children.map(p => ({id: p.id, name: p.name}))` instead. Page ids: `0:1` Foundations,
`1:29` Desktop, `1:30` Mobile, `12:2` Components. Full detail in `docs/design-chat-handoff.md`.

**Nothing here changes the code.** Figma moved to match the site, as instructed.



<a id="d-043"></a>
### D-043 · 2026-09-07 — The domain mailbox is not carried over. **Bryan's call.**

**Status:** Accepted

bryancampana.com currently publishes MX records pointing at Zoho, plus an SPF record and a
Zoho verification TXT. Bryan set a mailbox up, does not use it, and does not intend to. So
**the DNS cutover does not need to recreate the MX or TXT records** — the one irreversible
item on the migration list is closed.

Checked before recording: the site never references a domain address. Both the footer
"Contact" link and the About page "Email" link already point at bryanc9624@gmail.com. So
dropping the records breaks nothing that ships.

Two things worth keeping straight for whoever runs the cutover:

- The mailbox lives at **Zoho**, not at Cargo. Dropping the MX records stops mail routing
  to it; it does not close the Zoho account. If Bryan wants that gone it is a separate
  errand at Zoho, not something DNS can do.
- DNS for the domain is served by **ns1/ns2.cargocollective.com** — Cargo, not GoDaddy.
  GoDaddy is only the registrar. Cancelling Cargo therefore takes the whole zone down, not
  just the website, so nameservers must move BEFORE Cargo is cancelled, whatever host is
  chosen. Recorded here because it is the easiest step in the sequence to get backwards.



<a id="d-042"></a>
### D-042 · 2026-09-07 — Cargo's image ORDER and caption pairing recovered from the archive.

**Status:** Accepted

Worth recording because it is not guessable and it nearly went wrong. Oscuro's six captions
appear on the archived page in one order, the six scan files sort in a second order, and the
order Bryan actually published them in is a third. The real pairing was recovered by
matching each caption's `media-item` hash to its file in the Cargo page state:

| slot | scan | caption |
|---|---|---|
| 01 | Scans-07-29-2019-142225 | the place I call home |
| 02 | Scans-07-29-2019-142204 | a higher power |
| 03 | Scans-07-29-2019-142149 | inner strength |
| 04 | Scans-07-29-2019-142220 | agent of order |
| 05 | Scans-07-29-2019-142209 | a path best traveled alone |
| 06 | Scans-07-29-2019-141635 | gender |

Assigning captions in filename order would have put five of the six on the wrong
photograph. The mapping is written into `src/content/projects/oscuro.md` as a comment, and
the captions are already in `images:` in that order, so a correct export pairs itself.

Photopolymer Letterpress's four-image order is recorded the same way in its own file. Its
Drive folder holds a fifth photograph Cargo never showed — Bryan's call whether it ships.

`archive/cargo/raw-*.html` still holds the published order for every project. Read it before
importing images for anything else.



<a id="d-041"></a>
### D-041 · 2026-09-07 — `cover.<ext>` is a card-only image. **Code decision.**

**Status:** Accepted

A file named `cover.jpg` / `cover.png` in a project's asset folder is used as the card image
and excluded from that project's gallery. No `cover:` frontmatter line needed. Precedence:
an explicit `cover:` field, then `cover.*`, then the first image.

This mirrors what Bryan already did on Cargo, where several projects had a hand-made square
thumbnail (`Oscuro-Thumb.png`, `letterpress-thumb.png`) that was never shown inside the
project. It matters because the card frame is 3:2 landscape: Letterpress's photographs are
1179x2096 phone shots, and cropping 9:16 into 3:2 throws away most of the image.

Verified by adding a `cover.jpg` to two-of-hearts: the card switched to it, the project page
stayed at two figures, then it was removed. Not a design decision — Design and Figma still
owns what the card looks like.



<a id="d-040"></a>
### D-040 · 2026-09-07 — Body text is Sans, not Serif. **Bryan's call, made in Code and Deploy.**

**Status:** Accepted

`--font-body` was `var(--font-serif)`; it is now `var(--font-sans)` (IBM Plex Sans Variable).
Bryan asked for this directly in the code chat. **Design and Figma: the Body / Body Strong /
Body Small / Body Large / Question text styles need the same swap so Figma and the site
still agree — this is the one place they are currently out of sync.**

What did NOT change:

- `--font-display` is still serif. h1/h2/h3 — the wordmark, page titles and project titles —
  are unaffected. Bryan said "body text", and display type was read as outside that.
- The small label tier (eyebrows, fact-pair labels, card metadata) was already sans and is
  untouched.
- The size ramp is unchanged. Plex Sans and Plex Serif are one superfamily and share an
  x-height, so no size or leading value needed adjusting.

**Italics come from the serif — general rule, Bryan's call.** IBM Plex Sans is loaded as a
variable roman with no italic file, so `font-style: italic` on the sans would be a
browser-synthesised slant: a mechanical tilt of the roman, not the drawn italic. Plex Serif
ships a real 400 italic, and the two are one superfamily, so an italic phrase sits inside
sans body copy at the same x-height.

This is a token, `--font-italic`, not a per-element pin, and `em`, `i` and `cite` pick it up
globally in `base.css`. Consequences:

- The design question keeps rendering exactly as it does today (serif italic).
- `*emphasis*` written in any project body gets a drawn italic automatically. No content
  file has one yet — this is preventive.
- **Design and Figma: any italic drawn in Figma should be Plex Serif Italic, whatever the
  surrounding text is set in.**



<a id="d-039"></a>
### D-039 · 2026-09-07 — Design questions leave Design and Figma's list. **Bryan's call.**

**Status:** Accepted

Bryan took direct ownership of writing the 14 design questions and asked for them off this
chat's list completely. They were never a design decision, only a content one that had been
parked in a design section because the layout needed sentence lengths to test against.

**Consequence for both chats: this is no longer a tracked item and no longer a launch
dependency.** The previous framing called it "the long pole on launching" — that framing is
withdrawn. The field is optional, ships blank, and renders nothing when empty.

The placeholder questions in Figma are still placeholder text and must not reach the site.
See "Design questions — Bryan owns these outright" below for the house style and the
worksheet, kept as reference only.



<a id="d-038"></a>
### D-038 · 2026-09-07 — Horizontal rules get a hierarchy. **Bryan's call. Done in Figma.** ⚠

**Status:** Superseded — the chrome rules were removed entirely

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


<a id="d-037"></a>
### D-037 · 2026-09-07 — Serif/sans pairing: IBM Plex Serif with IBM Plex Sans. **Bryan's call. In Figma.** ⚠

**Status:** Partly superseded — Body / Strong moved to sans; the pairing stands

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


<a id="d-036"></a>
### D-036 · 2026-09-07 — Video facade drawn. **Ready to implement.**

**Status:** Accepted

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



<a id="d-035"></a>
### D-035 · 2026-09-07 — "Droplet" — a reserved shape motif. Named, not applied.

**Status:** Accepted

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



<a id="d-034"></a>
### D-034 · 2026-09-07 — Radius stays 0, derived from the typeface. **Measured, not defaulted.**

**Status:** Accepted

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



<a id="d-033"></a>
### D-033 · 2026-09-07 — Colour VALUES settled. **Bryan's call.** *(VALUES PARTLY SUPERSEDED — see "Current palette — THIS TABLE WINS" above. `line` and `muted` have both moved in each mode. The reasoning below stands; the numbers do not.)* ⚠

**Status:** Values superseded — see “Current palette” in DECISIONS.md. Reasoning stands

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


<a id="d-032"></a>
### D-032 · 2026-09-07 — Keywords consolidated from eight to six. **Bryan's call. Content change.**

**Status:** Partly superseded by [`D-059`](#d-059) — the consolidation itself stands, but **the
mapping table below is stale for `Fine Art`.** It gives Fine Art 1 project; the final set is
**Fine Art 3**, because `represent-1` and `resemblance-1` gained the tag after this entry was
written and `D-059` kept it. **Do not apply the table below.** The live set is in
`DECISIONS.md` under "Content and schema".

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


<a id="d-031"></a>
### D-031 · 2026-09-07 — Keyword filter reverted to text links. **Bryan's call. Drawn in Figma.**

**Status:** Accepted

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


<a id="d-030"></a>
### D-030 · 2026-09-07 — Open: the keyword set may be too granular for 14 projects. ⚠

**Status:** Resolved — consolidated to six

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


<a id="d-029"></a>
### D-029 · 2026-09-07 — Colour SYSTEM agreed. Values still open. **Bryan's concept.** ⚠

**Status:** Accepted — the system stands; its values were later filled in

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


<a id="d-028"></a>
### D-028 · 2026-09-07 — Video is embedded as a facade, not an iframe. **Bryan's call (option B).**

**Status:** Accepted

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



<a id="d-027"></a>
### D-027 · 2026-09-07 — Figma file cleaned: no archives, no versioned duplicates. **Bryan's call.**

**Status:** Accepted

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


<a id="d-026"></a>
### D-026 · 2026-09-07 — Typeface swap executed in Figma. **Done, verified.**

**Status:** Accepted

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


<a id="d-025"></a>
### D-025 · 2026-09-07 — Typeface is IBM Plex Sans (Google Fonts), replacing New Frank. **Bryan's call.** ⚠

**Status:** Accepted — its weight-revision point was itself later reverted

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



<a id="d-024"></a>
### D-024 · 2026-09-07 — Legal copy approved as published. **Bryan's call.**

**Status:** Accepted

`/terms` and `/privacy` are signed off. The clauses describing a contact form, purchases
and Stripe payment processing, and traffic analytics were removed because this site has
none of those; everything remaining is Bryan's own wording, verbatim from the Cargo
archive. No further review needed.

Still stale and unaddressed by choice: both pages carry "Last Updated: January 1, 2025".
Setting a new date would be authoring policy, so it stays until Bryan says otherwise.



<a id="d-023"></a>
### D-023 · 2026-09-07 — Design questions are optional, not required. **Bryan's call.** ⚠

**Status:** Accepted — ownership later moved wholly to Bryan

Previously tracked as R7, "the long pole on launch". It is not one. Bryan intends to write
maybe one or two questions across the whole site, not fourteen, so the field is now
genuinely optional rather than a blank waiting to be filled.

All 14 are set to `null` and nothing renders. Set one and it appears on that project page
only — both layouts already guard it. `DESIGN-QUESTIONS.md` holds a worksheet with each
project's scope and body opening for whenever he wants to draft one.

Consequence: the site is no longer content-blocked on questions. What remains is images
(2 of 14) and the design decisions in the open list.


<a id="d-022"></a>
### D-022 · 2026-09-07 — Previous/Next project navigation removed. ⚠

**Status:** Accepted — the “More work” idea it raised was later decided against

Built in Slice F from spec §8, then removed on review. The order runs design → art →
photography, so sequential navigation walks a reader from the strongest recent design work
toward older student work — a control whose default direction is away from the best
material on a job-application portfolio. "Next" also exposes the `order` field, which is
storage order, as though it were curatorial.

Logged for Design and Figma: a "More work" control offering two or three projects sharing
a keyword would give the intent without the downside. Not designed.



<a id="d-021"></a>
### D-021 · 2026-09-07 — Landing statement is `--size-xl`. Figma is right; the code should change.

**Status:** Accepted

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


<a id="d-020"></a>
### D-020 · 2026-09-07 — Type ramp is bound to one variable.

**Status:** Accepted

All ten text styles now bind `fontFamily` to the `font/family` variable, which carries
`codeSyntax` `var(--font-sans)`. Changing that one variable swaps the entire ramp across
every component and all 18 frames.

Practical consequence: **Bryan can perform the typeface swap himself in the Figma UI** —
select the `font/family` variable, change its value — without waiting on the Design chat.
This matters because the Design chat may not be able to see locally activated Adobe fonts
from its container.


<a id="d-019"></a>
### D-019 · 2026-09-07 — Role is removed entirely. **Bryan's call.**

**Status:** Accepted

Not hidden — removed from the schema and from all 14 content files. It never appeared on
the Cargo site, and Bryan does not want it displayed anywhere. `discipline` supersedes it
and carries real per-project values from the archive.


<a id="d-018"></a>
### D-018 · 2026-09-07 — Keywords are seeded from the site's disciplines, not the three categories. ⚠

**Status:** Superseded — consolidated from eight keywords to six

**Bryan's call, and it overrides spec §2.1**, which said to seed with `category`
(Design / Art / Photography). He asked for the disciplines already shown on the Cargo
site, as a placeholder set until he writes real keywords. That yields 8 keywords with
genuine overlap rather than 3 disjoint buckets, so multi-keyword filtering is exercised
from day one: ADA Signage Design, Brand Identity, Digital Communications, Exhibition
Design, Fine Art, New Media, Photography, Visual Communications.

`re:present` carries two (Exhibition Design + Digital Communications) and correctly
appears under both. Full keyword functionality is the goal; these values are the seed.


<a id="d-017"></a>
### D-017 · 2026-09-07 — `discipline` is its own field, not `keywords[0]`.

**Status:** Accepted

Code-side call, resolving spec §7.1. `discipline` is single-valued, selects the project
page layout, and appears in the facts list. `keywords` is an unordered many-valued set.
Deriving layout from an unordered array would mean adding a keyword could silently change
a page's layout.


<a id="d-016"></a>
### D-016 · 2026-09-07 — `year` is a sort key; `completed` is what renders.

**Status:** Accepted

Code-side call, resolving spec §7.2. The live site says "September 2025" and "2019" —
a number cannot hold the former. `year: number|null` stays for ordering, `completed:
string|null` is displayed.



<a id="d-015"></a>
### D-015 · 2026-09-07 — Hosting stays on Netlify. **Bryan's call.**

**Status:** Accepted

GoDaddy is registrar only — the account holds bryancampana.com plus WHOIS privacy, with no
hosting product on the invoice, so it was never an option for a built site. Netlify keeps
deploy previews, one-click rollback and free forms. Cloudflare Pages is the fallback if
credits stay tight; migrating a 13-file static site is under an hour, so this is reversible.


<a id="d-014"></a>
### D-014 · 2026-09-07 — Deploy discipline. **Enforced in netlify.toml.**

**Status:** Accepted

Netlify free tier is 300 credits per billing cycle, and the cycle runs the 7th to the 6th,
not the calendar month. Builds now run only on commits whose message contains `[deploy]`,
enforced by the `ignore` command in `netlify.toml`. Untagged pushes are skipped before the
build starts and cost nothing. See rule 12.


<a id="d-013"></a>
### D-013 · 2026-09-07 — Motion is not constrained by hosting.

**Status:** Accepted

"Static" describes delivery, not behaviour. CSS animation, GSAP, View Transitions, canvas
and WebGL all run client-side and work identically on any host. Nothing about the hosting
choice forecloses animation later.



<a id="d-012"></a>
### D-012 · 2026-09-07 — Featured set stays at 4. **Bryan's call.**

**Status:** Accepted

`dura-architectural-signage`, `590-madison-ave`, `big-city-volleyball`, `togethereffect`.
Two rows of two on the landing page. The old Cargo site featured 6; Bryan chose the
tighter edit.

Consequence worth noting rather than acting on: all four are design projects, so the
landing page shows no photography or art. The work index carries all 14 and is filterable,
so the other disciplines are one click away. Revisit only if Bryan raises it.

Promoting a project later is a one-value change — `featured: false` → `true` — plus writing
its body if it should read as a full case study. No design work either way.


<a id="d-011"></a>
### D-011 · 2026-09-07 — ProjectCard direction. **Decided.**

**Status:** Accepted

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


<a id="d-010"></a>
### D-010 · 2026-09-07 — Design question house style. **Decided (style only).**

**Status:** Accepted

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


<a id="d-009"></a>
### D-009 · 2026-09-07 — Every project gets a project page.

**Status:** Accepted

All 14, not just featured. `featured` now controls presentation only — which projects
appear on the landing page — not whether a route generates. Ten projects have no Markdown
body, so the template must render cleanly with `<Content />` empty. Every card links.


<a id="d-008"></a>
### D-008 · 2026-09-07 — Project pages come in two layouts.

**Status:** Accepted

**Standard** — sticky text rail plus wide media column, as already settled.
**Photography** — image-led: no rail, a two-up grid of captioned portrait prints (single
column on mobile), and facts *after* the work rather than beside it. Built at both
breakpoints in Figma. Photography projects carry fields the others don't: `Medium`,
`Prints`, dimensions, and per-image captions.


<a id="d-007"></a>
### D-007 · 2026-09-07 — Fact labels follow the live site's vocabulary.

**Status:** Accepted

**`Completed` / `Discipline`**, plus **`Medium` / `Prints`** on photography. Not
Role / Year / Category. **`Role` is dropped entirely — it appears nowhere on
bryancampana.com.** This supersedes the earlier "Role removed from previews / kept on case
study facts" entry: it is now removed from both.

Long values must wrap. *"Silver Gelatin prints on photographic paper, glossy finish. Shot
on 35mm."* runs to two or three lines in a narrow column — no `white-space: nowrap` or
fixed width on `.case__facts dd`. The Figma component clipped this until fixed, which is
how it was found.


<a id="d-006"></a>
### D-006 · 2026-09-07 — Work index is filterable, not grouped. ⚠

**Status:** Partly superseded — chips were reverted to text links

The three stacked Design / Art / Photography sections are replaced by one flat grid plus a
keyword filter. Chips, not text links: with the site nav directly above using the same
active/inactive treatment, text links read as a second navigation row. Square corners
follow `radius/sm`. No result count — Bryan dropped it.

**No JavaScript.** Radio inputs plus sibling selectors, so it works with JS disabled.
`category` becomes a `keywords` array; project types are the values for now.

Grouping was removed partly for a mechanical reason: at three-up the 6 / 4 / 4 category
counts strand a lone card in both Art and Photography.


<a id="d-005"></a>
### D-005 · 2026-09-07 — Responsive display type.

**Status:** Accepted

Two tokens gain a small-screen value; nothing else changes.

| Token | Desktop | Under 40rem |
|---|---|---|
| `--size-xl` | 2rem (32px) | 1.5rem (24px) |
| `--size-2xl` | 3rem (48px) | 2rem (32px) |

At 390px the landing statement was an eight-line, 296px block; it is now 168px. In Figma
this is the `Mobile` variable mode. **No new custom properties** — all 26 variables still
map 1:1 to `tokens.css`.


<a id="d-004"></a>
### D-004 · 2026-09-07 — Font weights, REVISED for New Frank: 600 becomes 700. **SUPERSEDED — reverted to 600.** ⚠

**Status:** Superseded — New Frank was dropped; the 600 ramp stands

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


<a id="d-003"></a>
### D-003 · 2026-09-07 — Font weights. **SUPERSEDED by the entry above — 600 does not exist in New Frank.** ⚠

**Status:** Superseded — see the 600 ramp, restored when Plex landed

Settled by the ten text styles now in Figma, recorded here so Code and Deploy can stop
relying on browser defaults:

| Role | Weight | Styles |
|---|---|---|
| Display, titles, wordmark | **600** | Display 2XL / XL, Title Large, Body Strong |
| Labels, eyebrows | **500** | Eyebrow, Label |
| Body, captions, nav | **400** | Body, Body Large, Body Small, Question (italic) |

Whether these become `--weight-*` tokens is Code and Deploy's call; the values are fixed
either way. This resolves the landing `h1` rendering at browser-default bold.


<a id="d-002"></a>
### D-002 · 2026-09-07 — Active nav item gets a visual treatment.

**Status:** Accepted

`SiteHeader.astro` already sets `aria-current="page"` but no CSS targets it — screen
readers know which page you are on and sighted visitors don't. Active is `--color-fg`,
inactive `--color-muted`.


<a id="d-001"></a>
### D-001 · Earlier

**Status:** Accepted

- **2026-09-07 — Page widths.** `--page-max` 1440px; project pages `--page-max-wide` 1600px.
- **2026-09-07 — Standard project page layout.** Sticky text rail + wide media column at
  64rem+, stacked text-first below. Rail `minmax(280px, 1fr)`, media `2fr`.
- **2026-09-07 — Name as home link.** The wordmark in the nav links home; the landing page
  does not repeat the name. Its h1 is the positioning statement.
- **2026-09-07 — Copy comes from Bryan.** All prose is his, verbatim from the Cargo archive
  in `archive/content/`. Neither chat writes portfolio copy for him.

---


---

# Appendix — closed routing items

Items one chat routed to another, all resolved. Moved here verbatim from
`DECISIONS.md` on 2026-09-07 when that section was collapsed to "nothing open".

**Why these are not numbered `D-NNN`:** the log above is decisions. These are tickets — a
chat asking another chat to do something, since answered. They are kept because two of them
record *how* a drift happened, which is worth more than the fact that it did.

**Provenance:** most were written by the **first** Code and Deploy chat, since retired. Two —
the muted values and the serif body drift — were raised by Design and Figma. None were written
by the current Code and Deploy chat.

## The section as it stood, verbatim

Routed here rather than through Bryan, per rule 2.

- [x] ~~**APPLY THE MUTED VALUES.**~~ **DONE 2026-09-07 by Code and Deploy** — all three edits landed and were verified in both schemes; see Settled below. Original text kept for traceability.

- [ ] ~~Superseded:~~ **APPLY THE MUTED VALUES — Bryan asked for this directly, 2026-09-07.** *Raised by Design
      and Figma. Colour is Design's to state; the edits are yours.*

      `--color-muted` is still `#7E6F7E` light and `#A4A4A4` dark. Both are superseded. Bryan
      approved the new values in the design chat and asked that they be applied, so this is not
      a proposal — it is a decision waiting on implementation. **Until it lands, toggling dark
      mode in a browser shows the old neutral grey**, which is the thing he objected to.

      **Edit 1 — `src/styles/tokens.css`, both palettes:**

      ```css
      --color-muted: #75617A;   /* :root — was #7E6F7E */
      --color-muted: #C9BFCD;   /* dark block — was #A4A4A4 */
      ```

      Light gains violet (tint r−g 15 → 20) **and** contrast (4.71 → 5.60:1); it was sitting
      just over the 4.5 floor while carrying captions and card descriptions. Dark was **pure
      neutral, r = g = b exactly** — it never belonged to the palette. It is now tinted
      deliberately, because anything derived from the dark ground comes out neutral: that
      ground is held at chroma 0.006, so diluting white toward it lands at r−g = 1.

      Gaps to the ink differ by mode on purpose — 2.75 light, 1.78 dark. A dark surround
      exaggerates lightness differences, so equal *perceived* separation needs a smaller
      measured step in dark. Do not "fix" them to match.

      **Edit 2 — `src/components/SiteHeader.astro`, one line:**

      ```css
      nav a[aria-current='page'] { font-weight: var(--weight-medium); }
      ```

      This is required, not cosmetic. The nav marks the current page by **colour alone**;
      softening muted pushes that toward invisible. `FilterLink` already carries weight *and*
      colour so its state never rests on colour alone — the nav is where that rule was never
      applied. 500 rather than FilterLink's 600, because the nav sits beside a 600 serif
      wordmark. In Figma this is the new `Body / Medium` text style.

      **Edit 3 — repoint a stale comment.** The dark block in `tokens.css` names
      *"Colour VALUES settled"* as its source of truth. That table is stale for `line` and
      `muted` in both modes. The current authority is **"Current palette — THIS TABLE WINS"**,
      above the Settled log. Please point the comment there; it is the only guard dark has,
      since dark has no Figma to check it against.

      Full reasoning: Settled, "Muted is retuned, and the current nav item gains a weight cue".

- [x] ~~**`tokens.css` still sets body copy in the serif.**~~ **ALREADY FIXED — closed by the chat that raised it, 2026-09-07.** Code and Deploy had resolved it in `0264eef` before this item was read; `--font-body` is `var(--font-sans)`. The routed item was written against a tree that was one commit stale. Figma has now been brought into line from the other side — see Settled, "Figma brought in line with the code's type decisions". Original text kept below for traceability; **do not action it.**

- [ ] ~~Original item:~~ **`tokens.css` still sets body copy in the serif — it contradicts the settled type
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
