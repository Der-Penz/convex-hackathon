import { v } from 'convex/values';
import { query } from './_generated/server';

export const getPlayer = query({
	args: {
		playerId: v.id('player'),
	},
	handler(ctx, args) {
		return ctx.db.get(args.playerId);
	},
});
export const getPlayers = query({
	args: {
		gameId: v.id('game'),
	},
	handler(ctx, args) {
		return ctx.db
			.query('player')
			.filter((q) => q.eq(q.field('gameId'), args.gameId))
			.collect();
	},
});
