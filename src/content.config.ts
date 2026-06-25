import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Essays and guides.
const writing = defineCollection({
	loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Optional cover image path under /public, e.g. '/covers/energy.svg'.
			cover: z.string().optional(),
			disciplines: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

// Interactive tools, builds and experiments.
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			cover: z.string().optional(),
			disciplines: z.array(z.string()).default([]),
			// live = finished & has a page; in-progress = being built; planned = an idea on the roadmap.
			status: z.enum(['live', 'in-progress', 'planned']).default('planned'),
			// If set, the card links out to this URL instead of an on-site page.
			externalUrl: z.string().url().optional(),
			// Higher = shown first.
			order: z.number().default(0),
			date: z.coerce.date().optional(),
			draft: z.boolean().default(false),
		}),
});

export const collections = { writing, projects };
