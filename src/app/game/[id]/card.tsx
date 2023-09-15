import React from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import { GAME_ROLES, GAME_TEAMS } from '@/lib/constants/game';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type Props = {
	spymaster: boolean;
	word: Doc<'word'>;
};

function Card({ spymaster, word }: Props) {
	return (
		<AspectRatio
			ratio={16 / 10}
			className="bg-muted relative overflow-hidden rounded-md grid place-items-center"
		>
			<p className="relative z-10 text-lg font-bold">
				{(word.revealed || spymaster) && <p>{word.word}</p>}
			</p>

			<Image
				src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
				alt="Photo by Drew Beamer"
				fill
				className="absolute inset-0"
			/>
			{word.revealed && (
				<div
					className={`${
						word.team === 'Red'
							? 'bg-red-500'
							: word.team === 'Blue'
							? 'bg-blue-500'
							: word.team === 'Black'
							? 'bg-black'
							: 'bg-gray-500'
					} absolute inset-0 opacity-60`}
				/>
			)}
		</AspectRatio>
	);
}

export default Card;
