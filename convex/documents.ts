import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createDocument = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		const newDocumentId = await ctx.db.insert('document', {
			...args,
			filetype: 'md',
			creator: 'Funny Frog',
		});

		return newDocumentId;
	},
});

export const getDocumentById = query({
	args: { documentId: v.id('document') },
	handler: async (ctx, args) => {
		return ctx.db.get(args.documentId);
	},
});

export const getDocumentByName = query({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		return ctx.db
			.query('document')
			.filter((q) => q.eq(q.field('name'), args.name))
			.first();
	},
});

export const getDocuments = query({
	handler: async (ctx, args) => {
		const tasks = await ctx.db.query('document').collect();
		return tasks;
	},
});
