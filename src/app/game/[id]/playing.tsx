import React from 'react';
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

			<section className="flex max-w-8xl gap-1 m-2">
				<div>
					<Card className="">
						<CardHeader>
							<CardTitle>Red Team</CardTitle>
							<CardDescription>
								Words left:{' '}
								{
									words.filter(
										(word) =>
											word.team === 'Red' &&
											!word.revealed
									).length
								}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<h4 className="mb-2 text-sm font-medium leading-none">
								Spymaster:{' '}
								{
									allPlayers.find(
										(player) =>
											player.role === 'Spymaster' &&
											player.team === 'Red'
									)?.name
								}
							</h4>
							<ScrollArea className="max-h-28 rounded-md border">
								<div className="p-2">
									<h4 className="mb-2 text-sm font-medium leading-none">
										Operatives:
									</h4>
									{allPlayers
										.filter(
											(player) =>
												player.team === 'Red' &&
												player.role === 'Operative'
										)
										.map((player) => (
											<>
												<div
													key={player._id}
													className="text-sm"
												>
													{player.name}
												</div>
												<Separator className="my-2" />
											</>
										))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
				<div className="grow">
					<Board words={words} self={self} game={game} />
				</div>
			</section>
		</div>
	);
}

export default playing;
