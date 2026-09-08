import { describe, it, expect } from 'vitest'
import { isCurrentPage, normalisePath, navLinks } from '../src/lib/nav'

describe('nav current-page rule', () => {
  it('marks the page you are actually on', () => {
    expect(isCurrentPage('/work/', '/work')).toBe(true)
    expect(isCurrentPage('/work', '/work')).toBe(true)
    expect(isCurrentPage('/about/', '/about')).toBe(true)
  })

  // The regression. `path.startsWith('/work')` returned true for every project URL,
  // so a project page told screen readers it was the work index.
  it('does not mark a section ancestor as the current page', () => {
    for (const slug of ['dura-architectural-signage', 'oscuro', 'two-of-hearts']) {
      expect(isCurrentPage(`/work/${slug}/`, '/work'), slug).toBe(false)
    }
  })

  it('marks nothing on a page that is not in the nav', () => {
    for (const path of ['/', '/privacy/', '/terms/', '/404']) {
      for (const l of navLinks) {
        expect(isCurrentPage(path, l.href), `${path} vs ${l.href}`).toBe(false)
      }
    }
  })

  it('never marks two links at once', () => {
    for (const path of ['/', '/work/', '/about/', '/work/oscuro/']) {
      const marked = navLinks.filter(l => isCurrentPage(path, l.href))
      expect(marked.length, path).toBeLessThanOrEqual(1)
    }
  })

  it('keeps the root as / rather than collapsing it to empty', () => {
    expect(normalisePath('/')).toBe('/')
    expect(normalisePath('//')).toBe('/')
    expect(normalisePath('/work///')).toBe('/work')
  })
})
