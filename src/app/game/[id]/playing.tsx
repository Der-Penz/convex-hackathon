import React from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Board from './board';

type Props = {
	self: Doc<'player'>;
	allPlayers: Doc<'player'>[];
	game: Doc<'game'>;
};
function playing({ self, allPlayers, game }: Props) {
	const words = useQuery(api.word.getWords, {
		gameId: game._id,
	});

	return (
		<div>
			gameBoard
			{words ? (
				<Board words={words} self={self} />
			) : (
				<div>Loading Cards</div>
			)}
		</div>
	);
}

export default playing;
