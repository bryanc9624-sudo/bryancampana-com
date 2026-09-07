import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    year: z.number().nullable().default(null),
    role: z.string().nullable().default(null),
    category: z.enum(['design', 'art', 'photography']),
    scope: z.string(),
    designQuestion: z.string().nullable().default(null),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    aspect: z.string().default('3/2'),
    images: z.array(z.object({
      aspect: z.string().default('3/2'),
      caption: z.string().optional(),
    })).default([]),
  }),
})

export const collections = { projects }
