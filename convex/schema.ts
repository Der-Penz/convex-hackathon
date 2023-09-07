import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	document: defineTable({
		creator: v.string(),
		filetype: v.string(),
		name: v.string(),
	}),
	change: defineTable({
		editor: v.string(),
		change: v.any(),
		documentId: v.id('document'),
	}),
});
