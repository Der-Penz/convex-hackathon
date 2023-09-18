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

const MARKED_CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, Number.POSITIVE_INFINITY];

function Board({ self, words, game }: Props) {
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
		<div className="2xl:max-w-7xl mx-auto">
			<div className="grid grid-cols-5 gap-2">
				{words.map((word) => (
					<Card
						key={word._id}
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
					<div className="group relative">
						<Input
							type="text"
							className="w-20 peer text-center"
							value={markedCards}
						/>
						<div className="invisible flex gap-1 p-2 rounded-lg bg-background group-hover:visible peer-focus:visible absolute z-50 top-0 -translate-y-full left-1/2 -translate-x-1/2">
							{MARKED_CARDS.map((number) => (
								<Button
									key={number}
									variant={'secondary'}
									onClick={() => {
										setMarkedCards(number);
									}}
								>
									{number === Number.POSITIVE_INFINITY
										? '∞'
										: number}
								</Button>
							))}
						</div>
					</div>
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

export default Board;
