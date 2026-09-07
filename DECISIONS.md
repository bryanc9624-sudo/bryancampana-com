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
3. **`docs/figma-to-code-spec.md` exists but is NOT on `main`.** It is on
   `claude/website-design-figma-l3milr` and carries the full implementation spec —
   schema changes, routing, the no-JS filter, the photography layout. Code and Deploy
   cannot see it until that branch is merged. **This is the highest-priority coordination
   item on the list.**

---

## Open decisions — Design and Figma owns these

- [ ] **Filter control: chips reverted to text links.** Bryan is reverting the bordered
      chip treatment in favour of the text-link option (2026-09-07). **This is a code
      change, not only a Figma one** — `/work` currently renders `.chip` with a border,
      padding and a `--color-fg` border on the checked state. Text links need different
      CSS for the selected state, since there is no border to change.
      Code and Deploy will restyle once the treatment is settled in Figma; the filter
      mechanism itself (radio inputs, `:has()`, `~=` matching) is unaffected.
      Likely knock-on: this may resolve the mobile overflow item above on its own —
      text links wrap far more compactly than bordered chips, which is what pushed the
      first project ~700px down at 390px.

- [ ] **Filter chip overflow on mobile.** 8 keywords wrap to 5 rows at 390px, pushing the
      first project roughly 700px down the page — a wall of chips before any work. The
      reference Bryan supplied had a `(More)` affordance for exactly this; it is not yet
      designed. Counts are implemented and live. Code and Deploy will build whatever is
      drawn; it will not invent the interaction.

- [ ] **Colour.** All six colour tokens are still neutral placeholders. Needs a real
      palette decision. Not blocking anything — everything is variable-bound, so a colour
      change propagates through Figma and CSS without rework.
- [ ] **Radius.** `radius/sm` and `radius/md` are both `0`. The only place radius is
      visible is `FilterChip`; every other surface is a hairline or a plain block. Bound
      to the tokens, so it is a one-value change.
      *Merged into the chip-overflow item above — counts are now built and live, so the
      only part still undesigned is the overflow behaviour.*
> **Colour and radius are deliberately paused, not forgotten.** Bryan's call, 2026-09-07:
> hold both until the typeface lands, so they get judged once against the real face rather
> than twice against Inter. Grey values and corner treatment read differently under a
> geometric sans than a humanist one. Code and Deploy should keep shipping the current
> placeholder values and **not** substitute anything — rule 4 applies.

### Waiting on Bryan, not on either chat

- [ ] **Typeface — family chosen, activation outstanding.** Bryan chose **New Frank**
      (2026-09-07) and created an Adobe Fonts web project: `https://use.typekit.net/udc5guh.css`.

      **Not yet swappable.** New Frank does not appear in Figma's available font list —
      Design and Figma enumerated all 1,938 families and found only *Frank Ruhl Libre* and
      *Libre Franklin*. Two possible causes, unresolved: (a) a web project does not install
      the font, so it still needs activating in the Creative Cloud desktop app; or (b) the
      Design chat runs in a remote container and may not be able to see Bryan's locally
      activated fonts at all. If (b), Bryan performs the swap himself — it is one variable
      edit (see Settled, "Type ramp is bound to one variable").

      **Resolved 2026-09-07:** CSS family is **`new-frank`**. Web project includes 300, 300i,
      400, 400i, 500, 500i, 700 — covers the revised ramp (see Settled, "Font weights,
      REVISED"). Domain coverage moved to Code and Deploy's open list.

      **Two manual steps remain, and only Bryan can do them** — the Design chat cannot see
      New Frank from its container, so it cannot set a font it cannot load:

      1. **Change the `font/family` variable value** from `Inter` to New Frank's family name
         as Figma's font picker shows it. Verified 2026-09-07: the variable is still `Inter`
         in both modes. Editing the type specimen on the Foundations page changes only that
         specimen — the variable is what drives the ten text styles and all 18 frames.
      2. **Change four text styles from Semi Bold to Bold** — `Display / 2XL`,
         `Display / XL`, `Title / Large`, `Body / Strong`. New Frank has no 600, so these
         will otherwise resolve to a missing font once the family switches.

      Also worth checking once switched: the `Question` style asks for style name `Italic`.
      Depending on how New Frank's internal naming maps, Figma may call it `Regular Italic`.

      **The chosen family must carry four styles**, because the design already uses all
      four:

      | Style | Used for |
      |---|---|
      | Regular (400) | body, captions, nav, description, year |
      | Medium (500) | labels, eyebrows, the card keyword |
      | Semi Bold (600) | display sizes, titles, wordmark |
      | Italic | the design question |

      If the family lacks **Medium**, labels fold into Regular and the distinction is
      carried by size and letter-spacing alone — acceptable. If it lacks a true **Italic**,
      the design question needs a different treatment; do not let it synthesise an oblique.
      Worth checking before committing to a family.

      When it lands: the Adobe embed `<link>` in `Base.astro` and the `--font-sans` value,
      both Code and Deploy's. **Adobe Fonts web projects are domain-locked**, so both
      `bryancampana.com` and `bryancampana.netlify.app` must be in the project's allowed
      domains or the fonts fail silently on one of them.

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
- [ ] **Adobe Fonts domain coverage.** *Raised by Design and Figma 2026-09-07; hosting and
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

### 2026-09-07 — Font weights, REVISED for New Frank: 600 becomes 700.

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
