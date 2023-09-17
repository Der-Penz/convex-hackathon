'use client';

import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TeamCard from './teamCard';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import Game from './game';
import GameLoading from '@/components/loading/gameLoading';

type Props = {
	params: { id: string };
	searchParams: {
		[key: string]: string | string[] | undefined;
		name?: string;
	};
};

export default function Page({ params: { id }, searchParams }: Props) {
	const router = useRouter();

	const [playerId, setPlayerId] = useState<Id<'player'> | undefined>();
	const [gameId, setGameId] = useState<Id<'game'> | undefined>();

	const joinGameMutation = useMutation(api.game.joinGame);

	useEffect(() => {
		async function joinGame() {
			try {
				const joinedGame = await joinGameMutation({
					joinId: id as Id<'game'>,
					name: searchParams.name,
					session:
						(sessionStorage.getItem('session') as Id<'player'>) ||
						undefined,
				});

				if (!joinedGame) {
					router.push(`/`);
					return;
				}

				setPlayerId(joinedGame.playerId);
				setGameId(joinedGame.gameID);

				//save the player id for refreshing
				sessionStorage.setItem('session', joinedGame.playerId);
			} catch {
				sessionStorage.removeItem('session');
				router.push(`/`);
			}
		}

		joinGame();
	}, []);

	if (!gameId || !playerId) {
		return <GameLoading message="Joining game" />;
	}

	return <Game gameId={gameId} playerId={playerId} />;
}
