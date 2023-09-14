export const GAME_STATE = {
	LOBBY: 'lobby',
	PLAYING: 'playing',
	END: 'end',
} as const;

export const GAME_TEAMS = {
	RED: 'red',
	BLUE: 'blue',
	BLACK: 'black',
} as const;
export const GAME_ROLES = {
	SPYMASTER: 'spymaster',
	OPERATIVE: 'operative',
	SPECTATOR: 'spectator',
} as const;
