import { v } from 'convex/values';
import { internalAction, internalMutation, mutation } from './_generated/server';
import { internal } from './_generated/api';

export const giveClue = mutation({
	args: {
		playerId: v.id('player'),
		clue: v.string(),
		markedCards: v.number(),
	},
	async handler(ctx, args) {
		const player = await ctx.db.get(args.playerId);

		if (!player || player.role !== 'Spymaster') {
			return {
				executed: false,
				message: 'you need to be a spymaster to give clues',
			};
		}

		const game = await ctx.db.get(player.gameId);

		if (
			!game ||
			game.state !== 'playing' ||
			game.currentTeam !== player.team
		) {
			return {
				executed: false,
				message: 'Not your teams turn',
			};
		}
		if (game.activeRole !== 'Spymaster') {
			return {
				executed: false,
				message: "Not spymaster's turn",
			};
		}

		await ctx.db.patch(player.gameId, {
			activeRole: 'Operative',
			clue: {
				markedCards: args.markedCards,
				word: args.clue,
			},
			guessThisRound: 0,
		});

		await ctx.db.insert('gameLog', {
			gameId: game._id,
			message: `${player.name} gave clue: ${args.clue} | ${args.markedCards}`,
			team: game.currentTeam,
		});

		return {
			executed: true,
			message: "Operative's turn",
		};
	},
});

export const guessWord = mutation({
	args: {
		wordId: v.id('word'),
		playerId: v.id('player'),
	},
	async handler(ctx, args) {
		const word = await ctx.db.get(args.wordId);

		if (!word || word.revealed) {
			return {
				executed: false,
				message: 'Word already revealed',
			};
		}

		const player = await ctx.db.get(args.playerId);

		if (!player || player.role !== 'Operative') {
			return {
				executed: false,
				message: 'you need to be a operative to guess words',
			};
		}

		const game = await ctx.db.get(player.gameId);
		if (
			!game ||
			game.state !== 'playing' ||
			game.currentTeam !== player.team
		) {
			return {
				executed: false,
				message: 'Not your teams turn',
			};
		}
		if (game.activeRole !== 'Operative') {
			return {
				executed: false,
				message: "Not operative's turn",
			};
		}

		if (!game.clue || game.guessThisRound >= game.clue.markedCards + 1) {
			return {
				executed: false,
				message: 'All guesses used',
			};
		}

		await ctx.db.patch(args.wordId, {
			revealed: true,
		});
		await ctx.db.patch(game._id, {
			guessThisRound: game.guessThisRound + 1,
		});

		await ctx.db.insert('gameLog', {
			gameId: game._id,
			message: `${player.name} guessed: ${word.word}`,
			team: game.currentTeam,
		});

		ctx.scheduler.runAfter(0, internal.gameflow.checkRound, {
			gameId: game._id,
			wordId: word._id,
		});
		return {
			executed: true,
			message: 'Word revealed',
		};
	},
});

export const checkRound = internalMutation({
	args: {
		gameId: v.id('game'),
		wordId: v.id('word'),
	},
	async handler(ctx, args) {
		//check if round over
		const word = await ctx.db.get(args.wordId);
		const game = await ctx.db.get(args.gameId);

		if (!word || !game) {
			return;
		}

		//game over on black card
		if (word.revealed && word.team === 'Black') {
			const winner = game.currentTeam === 'Blue' ? 'Red' : 'Blue';
			await ctx.db.patch(args.gameId, {
				state: 'end',
				winner,
			});

			await ctx.db.insert('gameLog', {
				gameId: game._id,
				message: `${winner} won the game by black card`,
				team: 'Grey',
			});

			ctx.scheduler.runAfter(1000 * 60, internal.game.deleteGame, {
				gameId: game._id,
			});

			return;
		}

		const words = await ctx.db
			.query('word')
			.filter((q) => q.eq(q.field('gameID'), game._id))
			.take(25);

		//red won?
		if (
			words
				.filter((word) => word.team === 'Red')
				.every((word) => word.revealed)
		) {
			await ctx.db.patch(args.gameId, {
				clue: null,
				guessThisRound: 0,
				state: 'end',
				winner: 'Red',
			});

			await ctx.db.insert('gameLog', {
				gameId: game._id,
				message: `Red won the game.`,
				team: 'Grey',
			});

			ctx.scheduler.runAfter(1000 * 60, internal.game.deleteGame, {
				gameId: game._id,
			});

			return;
		}

		//blue won
		if (
			words
				.filter((word) => word.team === 'Blue')
				.every((word) => word.revealed)
		) {
			await ctx.db.patch(args.gameId, {
				clue: null,
				guessThisRound: 0,
				state: 'end',
				winner: 'Blue',
			});

			await ctx.db.insert('gameLog', {
				gameId: game._id,
				message: `Blue won the game.`,
				team: 'Grey',
			});

			ctx.scheduler.runAfter(1000 * 60, internal.game.deleteGame, {
				gameId: game._id,
			});

			return;
		}

		//next team on gray card
		if (word.revealed && word.team === 'Grey') {
			await ctx.db.patch(args.gameId, {
				activeRole: 'Spymaster',
				currentTeam: game.currentTeam === 'Blue' ? 'Red' : 'Blue',
				clue: null,
				guessThisRound: 0,
			});

			return;
		}

		//next team on opposite team card
		if (
			word.revealed &&
			word.team !== 'Black' &&
			word.team !== 'Grey' &&
			word.team !== game.currentTeam
		) {
			await ctx.db.patch(args.gameId, {
				activeRole: 'Spymaster',
				currentTeam: game.currentTeam === 'Blue' ? 'Red' : 'Blue',
				clue: null,
				guessThisRound: 0,
			});

			return;
		}
		if (game.clue && game.guessThisRound >= game.clue?.markedCards + 1) {
			//next team when all guesses used
			await ctx.db.patch(args.gameId, {
				activeRole: 'Spymaster',
				currentTeam: game.currentTeam === 'Blue' ? 'Red' : 'Blue',
				clue: null,
				guessThisRound: 0,
			});
			return;
		}
	},
});

// export const checkAITurn = internalMutation({
// 	args: {
// 		gameId: v.id('game'),
// 	},
// 	async handler(ctx, args) {
// 		const game = await ctx.db.get(args.gameId);

// 		if (!game) {
// 			return;
// 		}

// 		const aiPlayers = await ctx.db
// 			.query('player')
// 			.filter((q) =>
// 				q.and(
// 					q.eq(q.field('gameId'), args.gameId),
// 					q.eq(q.field('team'), game.currentTeam),
// 					q.eq(q.field('role'), game.activeRole),
// 					q.eq(q.field('type'), 'AI'),
// 				)
// 			);
// 	},
// });