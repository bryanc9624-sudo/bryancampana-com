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
  it('has 14 projects', () => {
    expect(files().length).toBe(14)
  })

  it('has exactly 4 featured projects', () => {
    const featured = files().filter(f => frontmatter(f).featured === 'true')
    expect(featured.length).toBe(4)
  })

  it('gives every project a non-empty scope', () => {
    for (const f of files()) {
      expect(frontmatter(f).scope, `${f} scope`).toBeTruthy()
    }
  })

  it('uses only known categories', () => {
    const allowed = ['design', 'art', 'photography']
    for (const f of files()) {
      expect(allowed, `${f} category`).toContain(frontmatter(f).category)
    }
  })

  it('features only design-category projects', () => {
    for (const f of files()) {
      const fm = frontmatter(f)
      if (fm.featured === 'true') expect(fm.category, `${f}`).toBe('design')
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
