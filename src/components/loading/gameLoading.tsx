import React from 'react';
import { AspectRatio } from '../ui/aspect-ratio';
import { Skeleton } from '../ui/skeleton';

type Props = {
	message: string;
};

function GameLoading({ message }: Props) {
	return (
		<div>
			<section className="flex gap-2 p-2 border-b-2 items-center">
				<Skeleton className="w-[20%] h-8" />
				<span className="grow"></span>
				<span className="text-lg font-extralight">{message}</span>
				<span className="grow"></span>
				<Skeleton className="w-[8%] h-4" />
				<Skeleton className="w-[15%] h-8" />
			</section>
			<section className="flex gap-2 items-stretch justify-stretch max-w-7xl h-max m-4">
				<Skeleton className="w-20" />

				<div className="grid grid-cols-5 gap-5 p-2 grow">
					{new Array(25).fill(0).map((_, i) => (
						<AspectRatio
							ratio={16 / 10}
							key={i}
							className="relative"
						>
							<Skeleton className="absolute inset-0" />
						</AspectRatio>
					))}
				</div>
				<Skeleton className="w-20" />
			</section>
		</div>
	);
}

export default GameLoading;
