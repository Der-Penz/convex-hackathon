import React from 'react';
import TeamCard from './teamCard';
import { Id } from '../../../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import GameSettings from './gameSettings';
import { Badge } from '@/components/ui/badge';
import IoCopy from 'react-icons/io5';
import { Button } from '@/components/ui/button';

type Props = {
	gameId: Id<'game'>;
	playerId: Id<'player'>;
};

function game({ gameId, playerId }: Props) {
	const self = useQuery(api.player.getPlayer, { playerId });
	const game = useQuery(api.player.getPlayers, {
		gameId,
	});
	const allPlayers = useQuery(api.player.getPlayers, { gameId });

	if (!self || !game || !allPlayers || allPlayers?.length < 1) {
		return <div>not loaded</div>;
	}

	return (
		<div>
			<section className="flex gap-2 p-4 border-b-2 items-center">
				<h3 className="text-xl">
					Game: <span className="font-extralight">{gameId}</span>
				</h3>
				<Button variant={'ghost'}>copy</Button>
				<span className="grow"></span>
				<Badge variant={'outline'}>{self?.name}</Badge>
				{true && <GameSettings />}
				{self.host && <GameSettings />}
			</section>

			<div className="grid grid-cols-2 max-w-screen-lg mx-auto">
				<TeamCard
					color="Red"
					self={self}
					allPlayers={allPlayers.filter(
						(player) => player.team === 'Red'
					)}
				/>
				<TeamCard
					color="Blue"
					self={self}
					allPlayers={allPlayers.filter(
						(player) => player.team === 'Blue'
					)}
				/>
			</div>
		</div>
	);
}

export default game;
