'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import Lobby from './lobby';
import Playing from './playing';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import GameLoading from '@/components/loading/gameLoading';

type Props = {
	gameId: Id<'game'>;
	playerId: Id<'player'>;
};

function game({ gameId, playerId }: Props) {
	const self = useQuery(api.player.getPlayer, { playerId });
	const game = useQuery(api.game.getGame, {
		gameId,
	});
	const allPlayers = useQuery(api.player.getPlayers, { gameId });

	if (!self || !game || !allPlayers || allPlayers?.length < 1) {
		return (
			<GameLoading message='Loading game'/>
		);
	}

	return (
		<div>
			{game.state === 'lobby' && (
				<Lobby allPlayers={allPlayers} gameId={gameId} self={self} />
			)}
			{game.state === 'playing' && (
				<Playing allPlayers={allPlayers} game={game} self={self} />
			)}
			{game.state === 'end' && <div>ended</div>}
		</div>
	);
}

export default game;
