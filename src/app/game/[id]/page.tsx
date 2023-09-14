'use client';

import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TeamCard from './teamCard';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import Game from './game';

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
				});

				if (!joinedGame) {
					router.push(`/`);
					return;
				}

				setPlayerId(joinedGame.playerId);
				setGameId(joinedGame.gameID);
			} catch {
				router.push(`/`);
			}
		}

		joinGame();
	}, []);

	if (!gameId || !playerId) {
		return <div>Joining game</div>;
	}

	return <Game gameId={gameId} playerId={playerId} />;
}
