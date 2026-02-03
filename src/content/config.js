import { defineCollection, z } from 'astro:content';
import { CATEGORIES } from '../lib/categories';

const categoryIds = Object.values(CATEGORIES).map((c) => c.id);

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        category: z.enum(categoryIds),
        image: z.string().optional(),
    }),
});

export const collections = { blog };
