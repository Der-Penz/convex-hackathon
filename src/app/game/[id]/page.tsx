'use client';

import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

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
	const player = useQuery(api.player.getPlayer, { playerId: playerId! });

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
			} catch {
				router.push(`/`);
			}
		}

		joinGame();
	}, []);

	return (
		<div className="text-6xl">
			Game {id}
			<p>{player?.name}</p>
			<p>{player?.role}</p>
		</div>
	);
}
