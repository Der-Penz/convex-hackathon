'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import Lobby from './lobby';
import Playing from './playing';
import GameLoading from '@/components/loading/gameLoading';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
	gameId: Id<'game'>;
	playerId: Id<'player'>;
};

function game({ gameId, playerId }: Props) {
	const router = useRouter();
	const self = useQuery(api.player.getPlayer, { playerId });
	const game = useQuery(api.game.getGame, {
		gameId,
	});
	const allPlayers = useQuery(api.player.getPlayers, { gameId });

	useEffect(() => {
		console.log('setting timer');

		const timeout = setTimeout(() => {
			console.log(' timer activated', game);
			if (!game) {
				sessionStorage.removeItem('session');
				router.push('/');
			}
		}, 1000 * 10);

		return () => clearTimeout(timeout);
	}, [game]);

	if (!self || !game || !allPlayers || allPlayers?.length < 1) {
		return <GameLoading message="Loading game" />;
	}

	return (
		<div>
			{game.state === 'lobby' && (
				<Lobby allPlayers={allPlayers} gameId={gameId} self={self} />
			)}
			{(game.state === 'playing' || game.state === 'end') && (
				<Playing allPlayers={allPlayers} game={game} self={self} />
			)}

			{game.state === 'end' && (
				<AlertDialog defaultOpen={true}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{game.winner} won The game.
							</AlertDialogTitle>
							<AlertDialogDescription>
								Congrats to:
								{allPlayers
									.filter(
										(player) => player.team === game.winner
									)
									.map((player) => (
										<span>{player.name}, </span>
									))}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>View Board</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									sessionStorage.removeItem('session');
									router.push('/');
								}}
							>
								Back to Homepage
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}

export default game;
