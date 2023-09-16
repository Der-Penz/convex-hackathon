import { internalMutation, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';
import { generateRandomName } from '../src/lib/constants/name';
import COLLECTIONS from '../src/lib/ressources/ressources';
import { shuffleArray } from '../src/lib/utils';
import { GAME_ROLES, GAME_TEAMS } from '../src/lib/constants/game';
import { Id } from './_generated/dataModel';

export const createGame = mutation({
	handler: async (ctx) => {
		const newGameId = await ctx.db.insert('game', {
			state: 'lobby',
			currentTeam: 'Red',
			activeRole: 'Spymaster',
			clue: null,
			guessThisRound: 0,
		});
		return { joinId: newGameId };
	},
});

export const joinGame = mutation({
	args: {
		name: v.optional(v.string()),
		joinId: v.id('game'),
		session: v.optional(v.id('player')),
	},
	handler: async (ctx, args) => {
		//check if game exists
		const existsGame = await ctx.db.get(args.joinId);
		if (!existsGame) {
			return;
		}

		if (args.session) {
			const oldPlayer = await ctx.db.get(args.session);

			//reconnect
			if (oldPlayer && oldPlayer.gameId === args.joinId) {
				return {
					name: oldPlayer.name,
					gameID: args.joinId,
					playerId: oldPlayer._id,
				};
			}
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
			team: '',
			host: isHost,
		});
		return { name: name, gameID: args.joinId, playerId: newPlayerId };
	},
});

export const leaveGame = mutation({
	args: { playerId: v.id('player') },
	handler: async (ctx, args) => {
		try {
			const player = await ctx.db.get(args.playerId);

			if (player?.host) {
				await ctx.scheduler.runAfter(0, internal.game.deleteGame, {
					gameId: player.gameId,
				});
			} else {
				await ctx.db.delete(args.playerId);
			}

			return { deleted: true };
		} catch (err) {
			return { deleted: false };
		}
	},
});

export const joinTeam = mutation({
	args: {
		team: v.union(
			v.literal(GAME_TEAMS.RED),
			v.literal(GAME_TEAMS.BLUE),
			v.literal(GAME_TEAMS.EMPTY)
		),
		role: v.union(
			v.literal(GAME_ROLES.SPYMASTER),
			v.literal(GAME_ROLES.OPERATIVE),
			v.literal(GAME_ROLES.SPECTATOR)
		),
		playerId: v.id('player'),
	},
	handler: async (ctx, args) => {
		const player = await ctx.db.get(args.playerId);

		if (!player) {
			return;
		}
		const game = await ctx.db.get(player.gameId);

		if (!game || game.state !== 'lobby') {
			return;
		}

		if (args.role === 'Spectator' || args.team === '') {
			await ctx.db.patch(args.playerId, {
				role: 'Spectator',
				team: '',
			});
		} else if (args.role === 'Spymaster') {
			//check if team has a spymaster
			const currentPlayer = await ctx.db.get(args.playerId);

			if (!currentPlayer) {
				return;
			}

			const playerInTeam = await ctx.db
				.query('player')
				.filter((q) =>
					q.and(
						q.eq(q.field('gameId'), currentPlayer.gameId),
						q.eq(q.field('team'), args.team)
					)
				)
				.collect();

			if (!playerInTeam.some((player) => player.role === 'Spymaster')) {
				await ctx.db.patch(args.playerId, {
					role: args.role,
					team: args.team,
				});
			} else {
				await ctx.db.patch(args.playerId, {
					team: args.team,
				});
			}
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

export const startGame = mutation({
	args: {
		gameId: v.id('game'),
		playerId: v.id('player'),
		settings: v.object({
			collection: v.string(),
			blackCard: v.boolean(),
			timer: v.boolean(),
			cardsToGuess: v.number(),
		}),
	},
	async handler(ctx, args) {
		if (!(await ctx.db.get(args.playerId))?.host) {
			return {
				started: false,
				message: 'Only host can start the game',
			};
		}

		const game = await ctx.db.get(args.gameId);
		if (!game || game.state !== 'lobby') {
			return {
				started: false,
				message: 'Game can not be started',
			};
		}

		//check if enough players are available
		// const players = await ctx.db
		// 	.query('player')
		// 	.filter((q) => q.eq(q.field('gameId'), args.gameId))
		// 	.collect();

		// if (
		// 	players.filter((player) => player.role !== 'Spectator').length < 4
		// ) {
		// 	return {
		// 		started: false,
		// 		message: 'Not enough players, at least 4 players are necessary',
		// 	};
		// }

		// if (
		// 	!players.some(
		// 		(player) =>
		// 			player.role === 'Spymaster' && player.team === 'Blue'
		// 	) &&
		// 	!players.some(
		// 		(player) => player.role === 'Spymaster' && player.team === 'Red'
		// 	)
		// ) {
		// 	return {
		// 		started: false,
		// 		message: 'Each team needs a spymaster to be able to play',
		// 	};
		// }

		// if (
		// 	!players.some(
		// 		(player) =>
		// 			player.role === 'Operative' && player.team === 'Blue'
		// 	) &&
		// 	!players.some(
		// 		(player) => player.role === 'Operative' && player.team === 'Red'
		// 	)
		// ) {
		// 	return {
		// 		started: false,
		// 		message: 'Each team needs a operative to be able to play',
		// 	};
		// }

		//get the collection, TODO: instead of getting the first one check for is AI and create one
		const words = shuffleArray(
			COLLECTIONS[args.settings.collection as keyof typeof COLLECTIONS] ||
				COLLECTIONS['English (Original)']
		).slice(0, 25);

		const eachTeam = args.settings.cardsToGuess;
		const blackCard = args.settings.blackCard;
		let count = 0;
		const inserts: Promise<Id<'word'>>[] = [];

		for (let i = 0; i < eachTeam; i++) {
			inserts.push(
				ctx.db.insert('word', {
					gameID: game._id,
					revealed: false,
					word: words[count],
					team: 'Red',
				})
			);
			inserts.push(
				ctx.db.insert('word', {
					gameID: game._id,
					revealed: false,
					word: words[count + 1],
					team: 'Blue',
				})
			);
			count = count + 2;
		}

		if (blackCard) {
			inserts.push(
				ctx.db.insert('word', {
					gameID: game._id,
					revealed: false,
					word: words[count],
					team: 'Black',
				})
			);
			count = count + 1;
		}

		while (count < words.length) {
			inserts.push(
				ctx.db.insert('word', {
					gameID: game._id,
					revealed: false,
					word: words[count],
					team: 'Grey',
				})
			);
			count = count + 1;
		}

		try {
			await Promise.all(inserts);

			ctx.db.patch(game._id, {
				state: 'playing',
			});
		} catch (error) {
			ctx.db.delete(game._id);
			return {
				started: false,
				message: 'Error while generating  words',
			};
		}

		return {
			started: true,
			message: 'Game started',
		};
	},
});

export const deleteGame = internalMutation({
	args: { gameId: v.id('game') },
	handler: async (ctx, args) => {
		const words = await ctx.db
			.query('word')
			.filter((q) => q.eq(q.field('gameID'), args.gameId))
			.collect();

		words.forEach((word) => {
			ctx.db.delete(word._id);
		});

		const players = await ctx.db
			.query('player')
			.filter((q) => q.eq(q.field('gameId'), args.gameId))
			.collect();

		players.forEach((player) => {
			ctx.db.delete(player._id);
		});

		await ctx.db.delete(args.gameId);

		return true;
	},
});
