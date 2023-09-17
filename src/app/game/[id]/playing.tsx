'use client';

import React, { useMemo } from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Board from './board';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TitleMessage from './titleMessage';
import { FaCopy } from 'react-icons/fa';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import GameLoading from '@/components/loading/gameLoading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import IngameTeamCard from './ingameTeamCard';
import GameLog from './gameLog';

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

	function copyGameCode() {
		navigator.clipboard.writeText(game._id);
	}

	const teamPlayers = useMemo(
		() => allPlayers.filter((player) => player.team === self.team),
		[allPlayers]
	);
	const oppositePlayers = useMemo(
		() =>
			allPlayers.filter(
				(player) => player.team !== self.team && player.team !== ''
			),
		[allPlayers]
	);

	if (!words) {
		return <GameLoading message="Loading cards" />;
	}

	return (
		<div>
			<div className="border-b p-2">
				<section className="flex gap-2 items-center container">
					<h3 className="text-xl">
						Game:{' '}
						<span className="font-extralight">
							{game._id.slice(0, 5)}...
						</span>
					</h3>
					<Button variant={'ghost'} onClick={copyGameCode}>
						<FaCopy />
					</Button>
					<span className="grow"></span>
					<TitleMessage self={self} game={game} />
					<span className="grow"></span>
					<Badge variant={'outline'}>{self?.name}</Badge>
					<Button variant={'destructive'} onClick={leaveGame}>
						Leave
					</Button>
				</section>
			</div>

			<section className="flex max-w-8xl gap-2 m-2">
				<div className="flex flex-col gap-2 w-[15%]">
					<IngameTeamCard
						color={'Red'}
						wordsLeft={
							words.filter(
								(word) => word.team === 'Red' && !word.revealed
							).length
						}
						players={
							self.team === 'Red' ? teamPlayers : oppositePlayers
						}
						active={game.currentTeam === 'Red'}
					/>
					<IngameTeamCard
						color="Blue"
						wordsLeft={
							words.filter(
								(word) => word.team === 'Blue' && !word.revealed
							).length
						}
						players={
							self.team === 'Blue' ? teamPlayers : oppositePlayers
						}
						active={game.currentTeam === 'Blue'}
					/>
				</div>
				<div className="grow">
					<Board words={words} self={self} game={game} />
				</div>
				<GameLog gameId={game._id}/>
			</section>
		</div>
	);
}

export default playing;
