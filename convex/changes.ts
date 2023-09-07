import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const addChange = mutation({
	args: { change: v.any(), editor: v.string(), documentId: v.id('document') },
	handler: async (ctx, args) => {
		ctx.db.insert('change', {
			...args,
		});
	},
});

export const getChangesForDocument = query({
	args: { documentId: v.id('document') },
	handler: async (ctx, args) => {
		const tasks = await ctx.db
			.query('change')
			.filter((q) => q.eq(q.field('documentId'), args.documentId))
			.order('asc')
			.take(100);
		return tasks;
	},
});
