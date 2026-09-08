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
