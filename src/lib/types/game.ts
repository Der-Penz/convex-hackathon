export type WordCollection = {
	count: number;
	name: string;
    description: string;
};

export type GameSettings = {
	blackCards: boolean,
	cardsToGuess: number,
	collection: string,
	timer: boolean,
}