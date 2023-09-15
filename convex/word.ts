import { v } from 'convex/values';
import { query } from './_generated/server';

export const getWords = query({
	args: {
		gameId: v.id('game'),
	},
	handler(ctx, args) {
		return ctx.db
			.query('word')
			.filter((q) => q.eq(q.field('gameID'), args.gameId))
			.take(25);
	},
});
