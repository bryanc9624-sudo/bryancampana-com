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

## Open decisions — Design and Figma owns these

- [ ] **ProjectCard direction.** Three explorations sit side by side on Figma page
      "04 — Components": A — Editorial, B — Gallery, C — Spec Sheet. No winner marked.
      Code and Deploy's read: B's structure (image first) with A's hierarchy (design
      question promoted above the scope line, not muted italic underneath). Recorded as
      an opinion, not a decision — Design and Figma decides.
- [ ] **Design question house style — length.** Two registers are in the file, e.g.
      "Can compliance signage inherit the material language of the room it serves?"
      versus "Can signage inherit a room's materials?". Card height across 14 cards
      depends on this. Pick one register before the remaining 11 get written.
- [ ] **Typeface.** font/family is still "Inter". Bryan is supplying an Adobe Font.
      Blocks: the embed link in Base.astro and the --font-sans value.
- [ ] **Font weights.** No font-weight tokens exist. The landing h1 currently renders
      at browser-default bold because of it.
- [ ] **Colour and radius.** Greys are neutral placeholders; both radius tokens are 0.
- [ ] **Featured set.** Currently 4 (dura, 590-madison-ave, big-city-volleyball,
      togethereffect). Bryan's old Cargo site featured 6, including re:present and
      Two of Hearts. Editorial call, his to make.

## Settled

- **2026-09-07 — Page widths.** --page-max 1440px; case studies --page-max-wide 1600px.
- **2026-09-07 — Case study layout.** Sticky text rail + wide media column at 64rem+,
  stacked text-first below. Rail minmax(280px, 1fr), media 2fr.
- **2026-09-07 — Name as home link.** The wordmark in the nav links home; the landing
  page does not repeat the name. Its h1 is the positioning statement.
- **2026-09-07 — Role removed from previews.** Kept on case study facts, where it may
  legitimately differ.
- **2026-09-07 — Copy comes from Bryan.** All prose is his, taken verbatim from the
  Cargo archive in archive/content/. Neither chat writes portfolio copy for him.

## Design questions written so far

Source of truth is Figma page "04 — Components" until Code and Deploy moves them into
src/content/projects/*.md.

| Project | Question | In code? |
|---|---|---|
| dura-architectural-signage | How does a fabricator keep design intent intact from drawing to installation? | not yet |
| 590-madison-ave | (two length variants — see open decision) | not yet |
| photopolymer-letterpress | (two length variants — see open decision) | not yet |

11 of 14 projects still need one. This is the long pole on launching.
