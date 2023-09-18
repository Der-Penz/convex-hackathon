'use client';

import GameLoading from '@/components/loading/gameLoading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { FaCopy } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { api } from '../../../../convex/_generated/api';
import { Doc } from '../../../../convex/_generated/dataModel';
import Board from './board';
import GameLog from './gameLog';
import IngameTeamCard from './ingameTeamCard';
import TitleMessage from './titleMessage';

type Props = {
	self: Doc<'player'>;
	allPlayers: Doc<'player'>[];
	game: Doc<'game'>;
};
function Playing({ self, allPlayers, game }: Props) {
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

	const spectators = useMemo(
		() => allPlayers.filter((player) => player.role === 'Spectator').length,
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
					<div className='flex gap-1 items-center'>
						<span>{spectators}</span>
						<AiOutlineEye />
					</div>
					<Badge variant={'outline'}>{self?.name}</Badge>
					<Button variant={'destructive'} onClick={leaveGame}>
						Leave
					</Button>
				</section>
			</div>

			<section className="flex max-w-8xl gap-2 m-2 relative h-80 items-stretch">
				<div className="flex flex-col gap-2 w-[15%] 2xl:w-[25%]">
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
				<div className="self-stretch relative w-[15%] 2xl:w-[25%]">
					<GameLog gameId={game._id} />
				</div>
			</section>
		</div>
	);
}

export default Playing;
