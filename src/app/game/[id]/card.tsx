import React from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';

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
			className="bg-muted relative overflow-hidden cursor-pointer rounded-md grid place-items-center select-none p-2 shadow-xl border-4 border-muted-foreground"
		>
			<Separator className="my-4" />
			<p className="relative z-10 text-lg font-bold w-full bg-white/70 text-black text-center">
				<p>{word.word}</p>
			</p>

			{!word.revealed && (
				<Toggle onClick={(e) => e.stopPropagation()} className="absolute top-1 right-1 z-10 w-7 h-7 p-1 aspect-square outline cursor">
					H
				</Toggle>
			)}

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
					} absolute inset-0 opacity-60`}
				/>
			) : (
				<div className="bg-amber-950 mix-blend-hard-light absolute inset-0" />
			)}
		</AspectRatio>
	);
}

export default Card;
