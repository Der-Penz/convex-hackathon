import React from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import Card from './card';

type Props = {
	self: Doc<'player'>;
	words: Doc<'word'>[];
};

function board({ self, words }: Props) {
	return (
		<div className="grid grid-cols-5 gap-2 p-2 w-10/12">
			{words.map((word) => (
				<Card word={word} spymaster={self.role === 'Spymaster'} />
			))}
		</div>
	);
}

export default board;
