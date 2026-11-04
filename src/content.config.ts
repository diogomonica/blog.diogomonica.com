import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    published: z.string(),
    slug: z.string(),
    tags: z.array(z.string()),
    deadImages: z.array(z.string()).default([]),
    canonical: z.string().optional(),
    /** Search/social title when the visible H1 should stay as written. */
    seoTitle: z.string().optional(),
    /** Lead illustration used on the Open Graph card. */
    cardImage: z.string().optional(),
    /** ISO date of the last substantive edit. */
    updated: z.string().optional(),
  }),
});

export const collections = { posts };
