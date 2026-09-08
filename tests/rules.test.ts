import { describe, it, expect } from 'vitest'
import { readFileSync, globSync } from 'node:fs'

/**
 * Rules that used to live as prose in CLAUDE.md. Prose depends on somebody
 * remembering; these fail on their own.
 */

const src = (pattern: string) => globSync(pattern, { cwd: process.cwd() })

describe('images stay out of public/', () => {
  // public/ is copied through unoptimised — an image here ships at full weight.
  it('has no image files under public/', () => {
    const images = src('public/**/*.{jpg,jpeg,png,webp,avif,gif,tif,tiff}')
    expect(images).toEqual([])
  })
})

describe('markdown bodies carry no HTML comments', () => {
  // Astro passes them straight through: invisible in preview, visible in view-source.
  it('has no <!-- in any project body', () => {
    const offenders = src('src/content/**/*.md').filter(file => {
      const raw = readFileSync(file, 'utf8')
      const body = raw.split(/^---$/m).slice(2).join('---')
      return body.includes('<!--')
    })
    expect(offenders).toEqual([])
  })
})

describe('no rule references --color-fg', () => {
  // --color-fg means "the colour of text". Rules point at --color-line, whose
  // value is derived to hold the same contrast in both modes.

  /**
   * Properties that draw a line. Everything else — text colour, backgrounds —
   * may reference --color-fg legitimately, and seven places currently do.
   *
   * `border` matches as a prefix so logical properties (border-block-end,
   * border-inline-start) are covered before they are ever used.
   *
   * box-shadow is deliberately out of scope: it can fake a hairline, but it is
   * also the honest tool for shadows and rings, so matching it would fail
   * correct code. Revisit if a shadow-as-hairline ever appears.
   */
  function isRuleDeclaration(property: string): boolean {
    return (
      property.startsWith('border') ||
      property.startsWith('outline') ||
      property.startsWith('column-rule') ||
      property === 'text-decoration-color'
    )
  }

  it('draws no rule in --color-fg', () => {
    const offenders: string[] = []

    for (const file of src('src/**/*.{css,astro}')) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          const m = line.match(/(?:^|[;{])\s*([a-z-]+)\s*:\s*([^;}]*)/)
          if (!m) return
          const [, property, value] = m
          if (!value.includes('--color-fg')) return
          if (isRuleDeclaration(property)) offenders.push(`${file}:${i + 1}  ${property}`)
        })
    }

    expect(offenders).toEqual([])
  })
})

describe('every weight used with the serif is a face we actually load', () => {
  /**
   * The rule this enforces, stated as law rather than as a ban:
   * **a weight exists only when a face is loaded for it.**
   *
   * IBM Plex Sans is a variable file spanning 100–700, so it always has the
   * weight. IBM Plex Serif ships static per-weight files, so it has only the
   * ones base.css imports. Ask for a serif weight that is not imported and the
   * browser does not error and does not fall back visibly — it *matches* the
   * nearest loaded face and renders that. `font-synthesis: none` does not catch
   * it: that stops a faked italic or bold, which is a different mechanism.
   *
   * D-061 failed exactly here, invisibly, and CLAUDE.md recorded the failure as
   * "renders upright, so the gap is visible" — the safe mode, not the real one.
   *
   * The permitted set is READ FROM THE IMPORTS rather than hardcoded, so the way
   * to add a weight is to load its face. Do that and this test permits it.
   */

  const read = (f: string) => readFileSync(f, 'utf8')

  /** Serif weights base.css actually loads, roman and italic kept apart. */
  function loadedSerifWeights() {
    const css = read('src/styles/base.css')
    const roman = new Set<number>()
    const italic = new Set<number>()
    for (const m of css.matchAll(/@fontsource\/ibm-plex-serif\/(\d+)(-italic)?\.css/g)) {
      ;(m[2] ? italic : roman).add(Number(m[1]))
    }
    return { roman, italic }
  }

  /** `--font-*` tokens whose value resolves, through any var() chain, to the serif. */
  function serifFamilyTokens(): Set<string> {
    const tokens = new Map<string, string>()
    for (const m of read('src/styles/tokens.css').matchAll(/(--font-[\w-]+)\s*:\s*([^;]+);/g)) {
      tokens.set(m[1], m[2])
    }
    const resolvesToSerif = (name: string, seen = new Set<string>()): boolean => {
      if (seen.has(name)) return false
      seen.add(name)
      const value = tokens.get(name) ?? ''
      if (/IBM Plex Serif/i.test(value)) return true
      const ref = value.match(/var\((--font-[\w-]+)\)/)
      return ref ? resolvesToSerif(ref[1], seen) : false
    }
    return new Set([...tokens.keys()].filter(n => resolvesToSerif(n)))
  }

  /** `--weight-*` tokens and their numeric values. */
  function weightTokens(): Map<string, number> {
    const out = new Map<string, number>()
    for (const m of read('src/styles/tokens.css').matchAll(/(--weight-[\w-]+)\s*:\s*(\d+)\s*;/g)) {
      out.set(m[1], Number(m[2]))
    }
    return out
  }

  interface SerifRule {
    file: string
    line: number
    selector: string
    family: string
    /** null when the block sets a family but no weight, so the weight is inherited. */
    weight: number | null
  }

  /** Every innermost rule block that sets a serif-resolving family. */
  function serifRules(): SerifRule[] {
    const serif = serifFamilyTokens()
    const weights = weightTokens()
    const out: SerifRule[] = []

    for (const file of src('src/**/*.{css,astro}')) {
      const raw = read(file)
      // .astro carries JavaScript braces in its frontmatter; only the style block is CSS.
      const styles = file.endsWith('.astro')
        ? [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => ({
            text: m[1],
            offset: m.index! + m[0].indexOf(m[1]),
          }))
        : [{ text: raw, offset: 0 }]

      for (const { text, offset } of styles) {
        for (const block of text.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
          const [, selector, body] = block
          const familyRef = body.match(/font-family\s*:\s*var\((--font-[\w-]+)\)/)
          if (!familyRef || !serif.has(familyRef[1])) continue

          const weightRef = body.match(/font-weight\s*:\s*(?:var\((--weight-[\w-]+)\)|(\d+))/)
          const weight = weightRef
            ? weightRef[1]
              ? weights.get(weightRef[1]) ?? null
              : Number(weightRef[2])
            : null

          // Point at the `{`, not at the comment that precedes the selector.
          const braceAt = offset + block.index! + block[0].indexOf('{')
          out.push({
            file,
            line: raw.slice(0, braceAt).split('\n').length,
            selector: selector
              .replace(/\/\*[\s\S]*?\*\//g, '')
              .trim()
              .replace(/\s+/g, ' ')
              .slice(-60),
            family: familyRef[1],
            weight: weightRef ? weight : null,
          })
        }
      }
    }
    return out
  }

  /**
   * A block may set a serif family and no weight — `.case__scope`, `em, i, cite`
   * and three others do. That is allowed, and deliberately so: making each one
   * restate a weight it already inherits is duplication, and on this project
   * duplicated values do not stay equal.
   *
   * The guarantee comes from the other end instead. A serif block can only
   * inherit from the element-level rules in base.css, and the test below pins
   * those to weights the serif actually loads. Change `h1, h2, h3` to a weight
   * the serif has not loaded and it fails there — which is D-061's mistake,
   * caught without the components having to say anything.
   */
  function inheritedWeightVerdict(_rule: SerifRule): string | null {
    return null
  }

  /** Element-level rules in base.css — the only weights a serif block inherits. */
  function inheritableWeights(): { selector: string; weight: number }[] {
    const weights = weightTokens()
    const out: { selector: string; weight: number }[] = []
    for (const block of read('src/styles/base.css').matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const selector = block[1].replace(/\/\*[\s\S]*?\*\//g, '').trim()
      // Element selectors only: a class or id cannot cascade into another component.
      if (!selector || /[.#[:]/.test(selector)) continue
      const m = block[2].match(/font-weight\s*:\s*(?:var\((--weight-[\w-]+)\)|(\d+))/)
      if (!m) continue
      const weight = m[1] ? weights.get(m[1]) : Number(m[2])
      if (weight != null) out.push({ selector: selector.replace(/\s+/g, ' '), weight })
    }
    return out
  }

  it('asks the serif for no weight it has not loaded', () => {
    const { roman } = loadedSerifWeights()
    const offenders: string[] = []

    for (const rule of serifRules()) {
      const at = `${rule.file}:${rule.line}  ${rule.selector}`
      if (rule.weight === null) {
        const verdict = inheritedWeightVerdict(rule)
        if (verdict) offenders.push(`${at} — ${verdict}`)
        continue
      }
      if (!roman.has(rule.weight)) {
        offenders.push(
          `${at} — asks the serif for ${rule.weight}, which base.css does not load ` +
            `(loaded: ${[...roman].sort().join(', ')}). It will silently render the nearest one.`,
        )
      }
    }

    expect(offenders).toEqual([])
  })

  it('loads every weight a serif block could inherit', () => {
    const { roman } = loadedSerifWeights()
    const offenders = inheritableWeights()
      .filter(r => !roman.has(r.weight))
      .map(
        r =>
          `base.css  ${r.selector} sets ${r.weight}, which the serif does not load ` +
          `(loaded: ${[...roman].sort().join(', ')}). Serif text inheriting it renders the nearest weight instead.`,
      )
    expect(offenders).toEqual([])
  })
})
