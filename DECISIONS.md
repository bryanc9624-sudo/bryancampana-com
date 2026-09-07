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

## Sync audits — Oversight owns this section

Findings from auditing this ledger against the repo. Newest at top, dated. Written only
when something needs the other chats' attention; a clean audit is not recorded here.

*No audits recorded yet.*

---

## Settled

### 2026-09-07 — `--color-line` is the rule token, and its value is derived, not picked. **Bryan's call.**

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


### 2026-09-07 — The deploy gate was inverted and burned the whole billing cycle. **Fixed.**

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


### 2026-09-07 — The chrome rules are gone. Every remaining rule is ink. **Bryan's call. Drawn in Figma.**

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


### 2026-09-07 — The wordmark is serif, at body size. New `Wordmark` text style. **Bryan's call.**

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


### 2026-09-07 — Header reworked: full width, everything left, Contact moved up from the footer. **Bryan's call. Drawn in Figma.**

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


### 2026-09-07 — Hosting stays on Netlify. **Bryan's call. Cloudflare question closed.**

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

### 2026-09-07 — `/terms` and `/privacy` are approved as they stand. **Bryan's call.**

Recorded late. Bryan approved the trimmed legal pages verbally — *"Let's cross off the terms
and privacy wording off the list. This is all approved."* — but it was never written down,
so `scripts/content-todos.mjs` kept reporting it as outstanding and it would have been raised
again. The hardcoded line is removed from the reporter.

What they say now is what ships: the Cargo-era clauses about a contact form, Stripe payments,
order fulfilment and analytics were deleted because none of those exist on this site. Nothing
was written to replace them.


### 2026-09-07 — No synthesised faces, ever. **Bryan's rule.**

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

### 2026-09-07 — Rule hierarchy implemented in code. **Code and Deploy.**

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


### 2026-09-07 — Figma brought in line with the code's type decisions; Foundations repaired. **Design and Figma.**

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


### 2026-09-07 — The domain mailbox is not carried over. **Bryan's call.**

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


### 2026-09-07 — Cargo's image ORDER and caption pairing recovered from the archive.

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


### 2026-09-07 — `cover.<ext>` is a card-only image. **Code decision.**

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


### 2026-09-07 — Body text is Sans, not Serif. **Bryan's call, made in Code and Deploy.**

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
