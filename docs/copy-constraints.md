# Copy constraints

**The lengths the design assumes.** Work inside them and nothing shifts; go outside them and
something on the built site breaks quietly rather than loudly.

Written for whoever is editing copy, which since 2026-09-08 is Bryan and one chat. It used to
be a contract between two chats that could not see each other — that is gone, and with it the
"ask Design to re-measure" step. **If a number here is too tight, change the design; if it is
wrong, re-measure it.** Both are the same person's call now.

**Measured against the built site, in the browser**, not in Figma. That changed on 2026-09-08
with `CD-011`: the code is the source of truth, so the running page is the thing to measure. The
previous version of this file measured Figma, and the difference was not academic — see the card
scope section, where Figma and the site disagree by 2px of type and the file was wrong by about
30% as a result.

Method is at the bottom, so every figure can be re-derived rather than trusted.

---

## The four that actually bite

| What | Limit | Why |
|---|---|---|
| **Keyword label** | **≤ 14 characters** | Longer labels wrap the mobile filter |
| **Keyword set** | **7 filter links — the set is full** | Adding an eighth goes to four rows |
| **Card scope line** | **≤ 70 characters** | The card is drawn for two lines; three breaks grid rhythm |
| **Project title** | **≤ 26 characters** for one line | Longer wraps on the mobile card |

Everything else on the site has slack. These four do not.

---

## Keyword labels — the tightest constraint on the site

**≤ 14 characters.** `PHOTOGRAPHY`, the current longest at 11, measures **124px**.

This is the one with history. The set was once eight keywords including
`Digital Communications` — **192px on a 342px screen**. The mobile filter wrapped to five
rows and pushed the first project roughly 700px down the page, and fixing it meant
rewriting the vocabulary rather than the layout. A 22-character keyword cannot be designed
around; it can only be shortened.

**Current set, measured 2026-09-08.** Uppercase, as the filter renders since `DF-005` moved it
to the eyebrow tier:

| Label | Label width | With count and gap |
|---|---|---|
| `PHOTOGRAPHY` | 124px | 140px |
| `EXHIBITION` | 101px | 117px |
| `NEW MEDIA` | 96px | 113px |
| `IDENTITY` | 79px | 95px |
| `SIGNAGE` | 75px | 91px |
| `ART` | 32px | 58px (two-digit count) |
| `ALL` | 30px | 56px |

**Row total: 814px.** One line on desktop, three rows at 390px, no overflow.

**The set got cheaper while gaining a keyword.** `DF-005` measured the previous seven links at
813px and called the set full; `CD-005` swapped `FINE ART` (76px) and `DIGITAL` (67px) for `ART`
(32px) and `EXHIBITION` (101px), which came out ahead. Headroom across three mobile rows is about
893px, so roughly **79px** remains against ~122px for an average keyword.

**So the set is still full at seven links.** Renaming inside 14 characters is free; an eighth
keyword pushes the filter to four rows and needs re-measuring first.

**A second way to hit the ceiling, easy to miss:** the count is part of the link. `ART` gained
10px on 2026-09-08 without a character changing, because its count went from 6 to 10 and grew a
digit. Past 100 projects every count gains a third digit at once — about 70px across the row,
which is most of the remaining headroom.

---

## Card scope lines — ≤ 70 characters

**Corrected 2026-09-08, and the previous figure was wrong by 30%.** This file used to say 100
characters, derived from Figma where the scope is bound to `Body / Small` at 15px. **The site
renders it at 17px** — `.card__scope` sets no size and inherits the body — so every character
costs more than the file assumed.

Measured on the built page at the 342px mobile card, which is the binding width:

| | Figma / old file | Built site |
|---|---|---|
| Size | `Body / Small`, 15px | **17px, inherited** |
| Per character | ~6.8px | **9.66px** |
| Characters per line | ~50 | **35** |
| Two-line ceiling | ~100 chars | **~70 chars** |

**Four of fourteen cards are over it today:**

| Characters | Lines |
|---|---|
| 181 | **5** |
| 96 | **3** |
| 82 | **3** |
| 81 | 2 |

A third line makes that card taller than its neighbours, and with 14 cards in a grid the ragged
edge is visible immediately.

**Aim for 40–70 characters.** Below about 40 the card looks unfinished next to its neighbours;
that is a softer limit than the upper one.

> **Open, and not decided here.** The 17px is an omission rather than a decision — nothing chose
> it, `.card__scope` simply has no `font-size`. Setting it to `--size-sm` would match Figma, take
> characters-per-line back to about 45 and put most cards inside two lines without touching the
> copy. The alternative is to cut the copy. That is a visible type change across fourteen cards
> either way, so it is Bryan's.

---

## Project titles — ≤ 26 characters for a single line

Measured at `Title / Large`, 22px serif, on the 342px mobile card — the binding width, since the
desktop card is 437px.

The `n`-ruler gives 14.39px per character, but real mixed-case strings run lighter at about
**11.2px**, because `n` is wider than an average letter. Use the real-string figure:

| Title | Chars | Width | One line? |
|---|---|---|---|
| `Dura Architectural Signage` | 26 | 291px | yes — the current longest |
| `Photopolymer Letterpress` | 24 | 280px | yes |
| `Big City Volleyball Club` | 24 | 246px | yes |
| `The City That Slept` | 19 | 204px | yes |

**All 14 currently fit on one line.** `Dura Architectural Signage` at 291px of 342px is the
tightest, so 26 characters is the tested ceiling rather than a calculated one.

A two-line title is not a failure — it is a rhythm cost, so spend it deliberately rather than by
accident.

---

## Things with no meaningful limit

- **Project body copy.** Wraps at a 68ch measure and flows. Write what the work needs.
- **Fact values** — `Discipline`, `Medium`, `Prints`, `Completed`. The block is built to wrap;
  it already carries *"Silver Gelatin prints on photographic paper, glossy finish. Shot on
  35mm."* `discipline` was briefly going to move into the eyebrow above the project title, which
  would have capped it at 32 characters — that is off, so it has no length limit. See `DF-002`.
- **About page prose.** A biography column with no fixed height.
- **Legal pages.** Prose in a narrow measure.

## Design questions

Not a constraint — a house style, and Bryan's to write: **one sentence, 60–90 characters,
ending in a question mark, naming the specific constraint rather than the general theme.**
At the 496px desktop rail that is one to two lines. **Not being developed** as of `CD-003`;
all fourteen are `null` and nothing renders.

---

## Method, so these can be re-derived rather than trusted

**Measure the built page, not Figma.** Run the dev server, set the viewport to the binding width,
and read the real elements. Per-character figures come from the difference between a ten and a
twenty character string of `n`, which cancels out side bearings — but `n` is wider than an average
mixed-case letter, so use real strings for anything that will hold real words.

Binding widths: **mobile content 342px, mobile card 342px, desktop card 437px, desktop project
rail 496px.** Mobile is binding for every constraint in this file.

**Re-measure after any change to a text style's size, weight, family or tracking** — all four move
these numbers, and so does a change that alters which token an element resolves to. `Eyebrow`
alone moved three times on 2026-09-07, and the filter moving to the eyebrow tier on 2026-09-08
grew the row 17%.

**The trap this file fell into:** it was measured in Figma while the site rendered something else,
and the gap was invisible because both looked plausible. Measure the thing that ships.
