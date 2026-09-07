import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),

    // `year` is a sort key only. `completed` is what renders — the live site says
    // "September 2025" for Dura and "2019" for Oscuro, which a number cannot hold.
    year: z.number().nullable().default(null),
    completed: z.string().nullable().default(null),

    // Single canonical discipline. Selects the project-page layout and appears in the
    // facts list. Deliberately NOT derived from `keywords`: keywords are an unordered
    // many-valued set, so adding one must never change a page layout.
    discipline: z.string().nullable().default(null),

    // Many per project. Drives the /work filter. Seeded from the disciplines shown on
    // the Cargo site; Bryan adds real keywords later without a schema change.
    keywords: z.array(z.string()).default([]),

    scope: z.string(),
    designQuestion: z.string().nullable().default(null),

    // Archive fields. Photography projects carry most of these.
    medium: z.string().nullable().default(null),
    prints: z.string().nullable().default(null),
    dimensions: z.string().nullable().default(null),

    // `featured` controls presentation only — which projects show on the landing page.
    // Every project gets a page (spec §3).
    featured: z.boolean().default(false),
    order: z.number().default(0),
    aspect: z.string().default('3/2'),
    // A single embedded video. Rendered as a facade — poster plus a play button — so no
    // third-party script loads until a visitor actually asks for the video.
    video: z.object({
      provider: z.enum(['youtube', 'vimeo']),
      id: z.string(),
      title: z.string().optional(),
    }).nullable().default(null),

    images: z.array(z.object({
      aspect: z.string().default('3/2'),
      caption: z.string().optional(),
    })).default([]),
  }),
})

export const collections = { projects }
