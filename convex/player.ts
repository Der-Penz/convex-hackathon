import { v } from 'convex/values';
import { query } from './_generated/server';

export const getPlayer = query({
	args: {
		playerId: v.optional(v.id('player')),
	},
	handler(ctx, args) {
		if (!args.playerId) {
			return;
		}
		return ctx.db.get(args.playerId);
	},
});
