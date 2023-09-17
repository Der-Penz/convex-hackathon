import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { GAME_ROLES, GAME_STATE, GAME_TEAMS } from '../src/lib/constants/game';

export default defineSchema({
	game: defineTable({
		state: v.union(
			v.literal(GAME_STATE.LOBBY),
			v.literal(GAME_STATE.PLAYING),
			v.literal(GAME_STATE.END)
		),
		clue: v.union(
			v.object({
				word: v.string(),
				markedCards: v.number(),
			}),
			v.null()
		),
		guessThisRound: v.number(),
		activeRole: v.union(
			v.literal(GAME_ROLES.SPYMASTER),
			v.literal(GAME_ROLES.OPERATIVE)
		),
		currentTeam: v.union(
			v.literal(GAME_TEAMS.RED),
			v.literal(GAME_TEAMS.BLUE)
		),
	}),
	player: defineTable({
		gameId: v.id('game'),
		team: v.union(
			v.literal(GAME_TEAMS.RED),
			v.literal(GAME_TEAMS.BLUE),
			v.literal('')
		),
		role: v.union(
			v.literal(GAME_ROLES.OPERATIVE),
			v.literal(GAME_ROLES.SPECTATOR),
			v.literal(GAME_ROLES.SPYMASTER)
		),
		name: v.string(),
		host: v.boolean(),
	}),
	word: defineTable({
		word: v.string(),
		team: v.union(
			v.literal(GAME_TEAMS.RED),
			v.literal(GAME_TEAMS.BLUE),
			v.literal(GAME_TEAMS.BLACK),
			v.literal(GAME_TEAMS.GREY)
		),
		revealed: v.boolean(),
		gameID: v.id('game'),
	}),
	gameLog: defineTable({
		message: v.string(),
		gameId: v.id('game'),
		team: v.union(
			v.literal(GAME_TEAMS.RED),
			v.literal(GAME_TEAMS.BLUE),
			v.literal(GAME_TEAMS.GREY)
		),
	}),
});
