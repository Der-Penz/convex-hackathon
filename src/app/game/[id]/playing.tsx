import React from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Board from './board';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TitleMessage from './titleMessage';

type Props = {
	self: Doc<'player'>;
	allPlayers: Doc<'player'>[];
	game: Doc<'game'>;
};
function playing({ self, allPlayers, game }: Props) {
	const router = useRouter();
	const words = useQuery(api.word.getWords, {
		gameId: game._id,
	});
	const leaveGameMutation = useMutation(api.game.leaveGame);

	async function leaveGame() {
		const left = await leaveGameMutation({ playerId: self._id });
		if (left.deleted) {
			router.push('/');
		}
	}

	return (
		<div>
			<section className="flex gap-2 p-2 border-b-2 items-center">
				<span>gameBoard {self.role}</span>
				<span className="grow"></span>
				<TitleMessage self={self} game={game} />
				<span className="grow"></span>
				<Badge variant={'outline'}>{self?.name}</Badge>
				<Button variant={'destructive'} onClick={leaveGame}>
					Leave
				</Button>
			</section>

			{words ? (
				<Board words={words} self={self} game={game} />
			) : (
				<div>Loading Cards</div>
			)}
		</div>
	);
}

export default playing;
