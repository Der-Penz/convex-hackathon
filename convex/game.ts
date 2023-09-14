import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { generateRandomName } from '../src/lib/types/name';
import { GAME_ROLES, GAME_TEAMS } from '../src/lib/types/game';

export const createGame = mutation({
	handler: async (ctx) => {
		const newGameId = await ctx.db.insert('game', {
			state: 'lobby',
			currentTeam: 'Red',
			spymaster_word: '',
		});
		return { joinId: newGameId };
	},
});

export const joinGame = mutation({
	args: { name: v.optional(v.string()), joinId: v.id('game') },
	handler: async (ctx, args) => {
		//check if game exists
		const existsGame = await ctx.db.get(args.joinId);
		if (!existsGame) {
			return;
		}

		let name = !args.name ? generateRandomName() : args.name;

		while (
			await ctx.db
				.query('player')
				.filter((q) => q.eq(q.field('name'), name))
				.filter((q) => q.eq(q.field('gameId'), args.joinId))
				.unique()
		) {
			name = generateRandomName();
		}

		const isHost = (await ctx.db
			.query('player')
			.filter((q) => q.eq(q.field('gameId'), args.joinId))
			.first())
			? false
			: true;

		const newPlayerId = await ctx.db.insert('player', {
			gameId: args.joinId,
			name: name,
			role: 'Spectator',
			team: Math.random() >= 0.5 ? 'Red' : 'Blue',
			host: isHost,
		});
		return { name: name, gameID: args.joinId, playerId: newPlayerId };
	},
});

export const leaveGame = mutation({
	args: { playerId: v.id('player') },
	handler: async (ctx, args) => {
		try {
			await ctx.db.delete(args.playerId);

			return { deleted: true };
		} catch (err) {
			return { deleted: false };
		}
	},
});

export const joinTeam = mutation({
	args: {
		team: v.union(v.literal(GAME_TEAMS.RED), v.literal(GAME_TEAMS.BLUE)),
		role: v.union(
			v.literal(GAME_ROLES.SPYMASTER),
			v.literal(GAME_ROLES.OPERATIVE),
			v.literal(GAME_ROLES.SPECTATOR)
		),
		playerId: v.id('player'),
	},
	handler: async (ctx, args) => {
		if (args.role === 'Spectator') {
			await ctx.db.patch(args.playerId, {
				role: 'Spectator',
			});
		} else {
			await ctx.db.patch(args.playerId, {
				role: args.role,
				team: args.team,
			});
		}

		const newPlayer = await ctx.db.get(args.playerId);
		return { ...newPlayer };
	},
});

export const getGame = query({
	args: {
		gameId: v.id('game'),
	},
	handler(ctx, args) {
		return ctx.db.get(args.gameId);
	},
});
