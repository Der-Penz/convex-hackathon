export const GAME_STATE = {
	LOBBY: 'lobby',
	PLAYING: 'playing',
	END: 'end',
} as const;

export const GAME_TEAMS = {
	RED: 'Red',
	BLUE: 'Blue',
	BLACK: 'Black',
	GREY: 'Grey',
	EMPTY: '',
} as const;
export const GAME_ROLES = {
	SPYMASTER: 'Spymaster',
	OPERATIVE: 'Operative',
	SPECTATOR: 'Spectator',
} as const;
