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
for (const path of Object.keys(files).sort()) {
  const slug = path.split('/').at(-2)!
  if (!bySlug.has(slug)) bySlug.set(slug, [])
  bySlug.get(slug)!.push(files[path].default)
}

/** Every image for a project, in filename order. Empty when none have been added yet. */
export function imagesFor(slug: string): ImageMetadata[] {
  return bySlug.get(slug) ?? []
}

/** The card image. Null when the project has no images, so the caller falls back. */
export function coverFor(slug: string): ImageMetadata | null {
  return bySlug.get(slug)?.[0] ?? null
}
