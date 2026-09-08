# Copy constraints

**For the Content and Copy chat.** These are the lengths the design assumes. Work inside
them and you never need to ask Design for permission; go outside them and something on the
built site breaks quietly.

Owned and maintained by **Design and Figma**. Read-only for everyone else — if a number
here is wrong or too tight, say so and Design re-measures rather than you working around it.

**Every figure below was measured**, not estimated: real text nodes set in the real text
styles at the real container widths, in Figma, on 2026-09-07. Method is at the bottom.

---

## The four that actually bite

| What | Limit | Why |
|---|---|---|
| **Keyword label** | **≤ 14 characters** | Longer labels wrap the mobile filter |
| **Keyword set** | **≤ 7 filter links** (six keywords + `All`) | An eighth needs a re-measure |
| **Card scope line** | **≤ 100 characters** | The card is drawn for two lines; three breaks grid rhythm |
| **Project title** | **≤ 30 characters** for one line | Longer wraps on both card widths |

Everything else on the site has slack. These four do not.

---

## Keyword labels — the tightest constraint on the site

**≤ 14 characters.** `Photography`, the current longest at 11, measures **98px**.

This is the one with history. The set was once eight keywords including
`Digital Communications` — **192px on a 342px screen**. The mobile filter wrapped to five
rows and pushed the first project roughly 700px down the page, and fixing it meant
rewriting the vocabulary rather than the layout. A 22-character keyword cannot be designed
around; it can only be shortened.

**Current set, measured:**

| Label | Width |
|---|---|
| `Photography` | 98px |
| `New Media` | 85px |
| `Identity` | 61px |
| `Signage` | 61px |
| `Fine Art` | 60px |
| `Digital` | 49px |
| `All` | 21px |

The whole row is about **750px**, which is one line on desktop and **three rows at 390px**.
Three rows is the accepted ceiling. There is roughly **120px of headroom** — one more
average-length keyword, not two.

**So: adding a seventh keyword is fine if it is short. Adding an eighth needs Design to
re-measure first.** Renaming is free as long as the new name is ≤ 14 characters.

---

## Card scope lines — ≤ 100 characters

The card is drawn at a fixed 404px with the scope occupying **exactly two lines**. A third
line makes that card taller than its neighbours, and with 14 cards in a grid the ragged
edge is visible immediately.

Measured at `Body / Small` (15px): **≈ 6.8px per character**, so a mobile card at 342px
fits about **50 characters per line**.

- 82 characters — the current Dura line — is **2 lines**. Fine.
- 100 characters is **2 lines**. The ceiling.
- 110 characters is **3 lines**. Breaks the grid.

**Aim for 60–100 characters.** Below about 40 the card looks unfinished next to its
neighbours; that is a softer limit than the upper one.

---

## Project titles — ≤ 30 characters for a single line

Measured at `Title / Large` (22px serif): **≈ 11.2px per character** for real mixed-case
strings. Card widths are 437px desktop and 342px mobile, so the mobile card is the binding
one at about **30 characters**.

| Title | Width | One line? |
|---|---|---|
| `Dura Architectural Signage` (26) | 291px | yes |
| `Photopolymer Letterpress` (24) | 281px | yes |
| `The City That Slept` (19) | 204px | yes |
| `590 Madison Ave` (15) | 180px | yes |

All 14 currently fit. A two-line title is not a failure — it is a rhythm cost, so spend it
deliberately rather than by accident.

---

## Things with no meaningful limit

- **Project body copy.** Wraps at a 68ch measure and flows. Write what the work needs.
- **Fact values** — `Discipline`, `Medium`, `Prints`, `Completed`. The block is built to wrap;
  it already carries *"Silver Gelatin prints on photographic paper, glossy finish. Shot on
  35mm."* **`discipline` was briefly going to move into the eyebrow above the project title,
  which would have capped it at 32 characters — that is off, so it has no length limit again.**
  See `DF-002`.
- **About page prose.** A biography column with no fixed height.
- **Legal pages.** Prose in a narrow measure.

## Design questions

Not a constraint — a house style, and Bryan's to write: **one sentence, 60–90 characters,
ending in a question mark, naming the specific constraint rather than the general theme.**
At the 496px desktop rail that is one to two lines.

---

## Method, so these can be re-derived rather than trusted

Text nodes created in Figma with the production text styles, set to hug, and measured. Per
character figures come from the difference between a ten and twenty character string, which
removes side bearings; the real-string figures used for titles and scope are lower than that
ruler, because `n` is wider than an average mixed-case letter. Container widths: mobile
content 342px, mobile card 342px, desktop card 437px, desktop project rail 496px.

Re-measure after any change to a text style's size, weight, family or tracking — all four
move these numbers. `Eyebrow` alone moved three times on 2026-09-07 — Medium to Bold, back to
Medium, then to SemiBold — and each step changed what fitted. None of the four limits above
depend on it today, but that is luck rather than design.
