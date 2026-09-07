import type { ImageMetadata } from 'astro'

// Eagerly import every project image at build time. Vite resolves these to optimised
// ImageMetadata objects, which is what <Image /> needs to emit AVIF/WebP + srcset.
// Files must live under src/ — anything in public/ is copied through untouched with no
// optimisation at all, which is the usual reason portfolio images are slow.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/projects/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
)

const bySlug = new Map<string, ImageMetadata[]>()
const byName = new Map<string, Map<string, ImageMetadata>>()
for (const path of Object.keys(files).sort()) {
  const slug = path.split('/').at(-2)!
  const name = path.split('/').at(-1)!
  if (!bySlug.has(slug)) { bySlug.set(slug, []); byName.set(slug, new Map()) }
  bySlug.get(slug)!.push(files[path].default)
  byName.get(slug)!.set(name, files[path].default)
}

/** Every image for a project, in filename order. Empty when none have been added yet. */
export function imagesFor(slug: string): ImageMetadata[] {
  return bySlug.get(slug) ?? []
}

/**
 * The card image. Pass the project's `cover` field to choose a specific file by name;
 * without one the first image in filename order is used. Returns null when the project
 * has no images at all, so the caller falls back to a placeholder.
 *
 * A `cover` naming a file that does not exist throws at build time rather than silently
 * falling back — a typo should fail loudly, not quietly show the wrong photograph.
 */
export function coverFor(slug: string, cover?: string | null): ImageMetadata | null {
  const all = bySlug.get(slug)
  if (!all || all.length === 0) return null
  if (!cover) return all[0]
  const picked = byName.get(slug)?.get(cover)
  if (!picked) {
    const available = [...(byName.get(slug)?.keys() ?? [])].join(', ')
    throw new Error(
      `Project "${slug}" sets cover: "${cover}" but that file is not in ` +
      `src/assets/projects/${slug}/. Available: ${available || '(none)'}`)
  }
  return picked
}
