'use client';

import React from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

type Props = {
	spymaster: boolean;
	word: Doc<'word'>;
	onClick: (word: Doc<'word'>) => void;
};

function Card({ spymaster, word, onClick }: Props) {
	return (
		<AspectRatio
			onClick={() => onClick(word)}
			ratio={16 / 9}
			className="hover:outline bg-muted relative overflow-hidden cursor-pointer rounded-md grid place-items-center select-none p-2 shadow-xl border-4 border-muted-foreground"
		>
			<p
				className={cn(
					'absolute bottom-1 z-10 font-bold w-11/12 bg-white/70 text-black text-center',
					{
						invisible: word.revealed,
					}
				)}
			>
				<p>{word.word}</p>
			</p>

			<Image
				src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
				alt="Photo by Drew Beamer"
				fill
				className="absolute inset-0"
			/>

			{word.revealed || spymaster ? (
				<div
					className={`${
						word.team === 'Red'
							? 'bg-red-500'
							: word.team === 'Blue'
							? 'bg-blue-500'
							: word.team === 'Black'
							? 'bg-black'
							: 'bg-gray-300'
					} absolute inset-0 mix-blend-hard-light`}
				/>
			) : (
				<div className="bg-amber-950 mix-blend-hard-light absolute inset-0" />
			)}
		</AspectRatio>
	);
}

export default Card;
