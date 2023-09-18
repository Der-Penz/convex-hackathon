'use client';

import React, { useState } from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import Card from './card';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type Props = {
	self: Doc<'player'>;
	words: Doc<'word'>[];
	game: Doc<'game'>;
};

function board({ self, words, game }: Props) {
	const [clue, setClue] = useState('');
	const [markedCards, setMarkedCards] = useState(1);

	const guessWordMutation = useMutation(api.gameflow.guessWord);
	const giveClueMutation = useMutation(api.gameflow.giveClue);

	const active =
		game.currentTeam === self.team && game.activeRole === self.role;

	async function onCardClick(word: Doc<'word'>) {
		if (!active || self.role !== 'Operative') {
			return;
		}

		await guessWordMutation({
			playerId: self._id,
			wordId: word._id,
		});
	}
	async function giveClue() {
		if (!active || self.role !== 'Spymaster') {
			return;
		}

		await giveClueMutation({
			playerId: self._id,
			clue,
			markedCards,
		});
	}

	return (
		<div className='2xl:max-w-7xl mx-auto'>
			<div className="grid grid-cols-5 gap-2">
				{words.map((word) => (
					<Card
						word={word}
						spymaster={self.role === 'Spymaster'}
						onClick={onCardClick}
					/>
				))}
			</div>
			{self.role === 'Spymaster' && active && (
				<div className="flex gap-2 mt-2 justify-center">
					<Input
						placeholder="clue..."
						className="w-40"
						type="text"
						value={clue}
						onChange={(e) => setClue(e.target.value)}
					/>
					<Input
						type="number"
						className="w-20"
						min={1}
						max={10}
						value={markedCards}
						onChange={(e) => setMarkedCards(e.target.valueAsNumber)}
					/>
					<Button
						disabled={!clue || markedCards < 1}
						onClick={giveClue}
						className="w-40"
					>
						Give clue
					</Button>
				</div>
			)}
			{game.clue && (
				<div className="flex justify-center w-max mx-auto gap-3 text-2xl border-4 px-4 py-1 mt-2 rounded-lg shadow-lg">
					<div className="font-extralight">{game.clue.word}</div>
					<Separator orientation="vertical" className="h-8" />
					<div className="font-extrabold">
						{game.clue.markedCards}
					</div>
				</div>
			)}
		</div>
	);
}

export default board;
