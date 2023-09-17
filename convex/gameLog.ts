import { v } from 'convex/values';
import { query } from './_generated/server';

export const getLog = query({
	args: {
		gameId: v.id('game'),
	},
	handler(ctx, args) {
		return ctx.db
			.query('gameLog')
			.filter((q) => q.eq(q.field('gameId'), args.gameId))
			.order('asc')
			.collect();
	},
});
