export type WordCollection = {
	count: number;
	name: string;
    description: string;
};

export type GameSettings = {
	blackCard: boolean,
	cardsToGuess: number,
	collection: string,
	timer: boolean,
	startingTeam: 'Red' | 'Blue',
}