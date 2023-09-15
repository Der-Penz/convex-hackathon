import WordCollections from '../ressources/ressources';
import { WordCollection } from '../types/game';

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

type Key = keyof typeof WordCollections;
export const GAME_WORD_COLLECTIONS: WordCollection[] = Object.keys(
	WordCollections
).map((key) => {
	return {
		count: (WordCollections[key as Key] as string[]).length,
		description: `Official Words for the language: ${key}`,
		name: key,
	};
});
