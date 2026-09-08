import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'src/content/projects'
const files = () => readdirSync(DIR).filter(f => f.endsWith('.md'))

function frontmatter(file: string): Record<string, string> {
  const raw = readFileSync(join(DIR, file), 'utf8')
  const block = raw.split('---')[1] ?? ''
  const out: Record<string, string> = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (m) out[m[1]] = m[2].trim()
  }
  return out
}

describe('project content', () => {
  it('has at least 14 projects', () => {
    expect(files().length).toBeGreaterThanOrEqual(14)
  })

  it('features between 1 and 6 projects', () => {
    const featured = files().filter(f => frontmatter(f).featured === 'true')
    expect(featured.length).toBeGreaterThanOrEqual(1)
    expect(featured.length).toBeLessThanOrEqual(6)
  })

  it('gives every project a non-empty scope', () => {
    for (const f of files()) {
      expect(frontmatter(f).scope, `${f} scope`).toBeTruthy()
    }
  })

  /**
   * The card is drawn for a fragment, not a sentence. A terminal period on one
   * scope and not the next is visible across fourteen cards in a grid, and the
   * register is mixed on purpose — narrative reads as a sentence, a capability
   * list as Title Case — so the period is the one mark that has to be uniform.
   * Removed from all fourteen in 0ae5458; pinned here so it stays that way.
   */
  it('ends no card scope with a terminal period', () => {
    for (const f of files()) {
      const scope = (frontmatter(f).scope ?? '').replace(/^["']|["']$/g, '').trim()
      expect(scope.endsWith('.'), `${f} scope ends in a period`).toBe(false)
    }
  })

  it('gives every project a discipline', () => {
    for (const f of files()) {
      expect(frontmatter(f).discipline, `${f} discipline`).not.toBe('null')
    }
  })

  // The discipline is the whole filter vocabulary since CD-019, so a typo in one file
  // silently creates a seventh filter link matching a single project. Pinning the set
  // makes that fail here instead of shipping.
  it('draws every discipline from the settled set of six', () => {
    const SET = ['Brand Identity', 'Exhibition Design', 'New Media',
                 'Photography', 'Printmaking', 'Signage & Wayfinding']
    for (const f of files()) {
      expect(SET, `${f} discipline`).toContain(frontmatter(f).discipline.replace(/^"|"$/g, ''))
    }
  })

  // `month` sorts and `completed` renders — two statements of one fact, so they can drift.
  // On this project duplicated values reliably do: the eyebrow type, the palette table and
  // the keyword list all diverged from their copies before anyone noticed. This is the
  // cheapest guard, and unlike the others it fires before the drift ships.
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December']

  it('keeps `month` in step with the month named in `completed`', () => {
    for (const f of files()) {
      const { month, completed } = frontmatter(f)
      const named = MONTHS.findIndex(m => new RegExp(`^"?${m}\\b`).test(completed ?? '')) + 1
      if (named) {
        expect(Number(month), `${f}: completed says ${completed}`).toBe(named)
      } else {
        expect(month ?? 'null', `${f}: completed (${completed}) names no month`).toBe('null')
      }
    }
  })

  it('gives a month only to a project that has a year', () => {
    for (const f of files()) {
      const { month, year } = frontmatter(f)
      if (month && month !== 'null') {
        expect(year, `${f} month without year`).not.toBe('null')
      }
    }
  })

  it('gives every featured project a body', () => {
    for (const f of files()) {
      if (frontmatter(f).featured !== 'true') continue
      const body = readFileSync(join(DIR, f), 'utf8').split('---').slice(2).join('---').trim()
      expect(body.length, `${f} body`).toBeGreaterThan(200)
    }
  })
})
