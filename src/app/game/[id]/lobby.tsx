'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { GAME_WORD_COLLECTIONS } from '@/lib/constants/game';
import { GameSettings as Settings } from '@/lib/types/game';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { api } from '../../../../convex/_generated/api';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import GameSettings from './gameSettings';
import PlayerListItem from './playerListItem';
import TeamCard from './teamCard';

type Props = {
	self: Doc<'player'>;
	allPlayers: Doc<'player'>[];
	gameId: Id<'game'>;
};

function lobby({ self, allPlayers, gameId }: Props) {
	const [settings, setSettings] = useState<Settings>({
		blackCard: true,
		cardsToGuess: 9,
		timer: false,
		collection: GAME_WORD_COLLECTIONS[0].name,
	});

	const { toast } = useToast();
	const router = useRouter();
	const leaveGameMutation = useMutation(api.game.leaveGame);
	const deleteGameMutation = useMutation(api.game.deleteGame);
	const startGameMutation = useMutation(api.game.startGame);

	const spectators = allPlayers.filter(
		(player) => player.role === 'Spectator'
	);
	const playerInTeams = allPlayers.filter(
		(player) => player.role !== 'Spectator'
	);

	async function leaveGame() {
		if (self.host) {
			const deleted = await deleteGameMutation({ gameId: gameId });
			if (deleted) {
				router.push('/');
			}
		} else {
			const left = await leaveGameMutation({ playerId: self._id });
			if (left.deleted) {
				router.push('/');
			}
		}
	}

	async function startGame() {
		const { started, message } = await startGameMutation({
			playerId: self._id,
			gameId,
			settings: settings,
		});

		if (!started) {
			toast({
				title: 'Game not started',
				description: message,
			});
		}
	}

	function copyGameCode() {
		navigator.clipboard.writeText(gameId);
	}

	return (
		<>
			<section className="flex gap-2 p-4 border-b-2 items-center">
				<h3 className="text-xl">
					Game: <span className="font-extralight">{gameId}</span>
				</h3>
				<Button variant={'ghost'} onClick={copyGameCode}>
					<FaCopy />
				</Button>
				<span className="grow"></span>
				<Badge variant={'outline'}>{self?.name}</Badge>
				{self.host && (
					<GameSettings
						settings={settings}
						setSettings={setSettings}
					/>
				)}
			</section>

			<div className="grid grid-cols-3 max-w-screen-lg mx-auto">
				<TeamCard
					color="Red"
					self={self}
					allPlayers={playerInTeams.filter(
						(player) => player.team === 'Red'
					)}
				/>
				<Card className="m-4 flex flex-col">
					<CardHeader>
						<CardTitle>Spectators:</CardTitle>
						<CardDescription>Spectate the game</CardDescription>
					</CardHeader>
					<CardContent className="flex gap-4 flex-col grow">
						<h4 className="mb-4 text-xl font-medium leading-none">
							Players:
						</h4>
						<ScrollArea className="h-56 rounded-md border w-full">
							<div className="p-4 w-full">
								{spectators.map((player) => (
									<Fragment key={player._id}>
										<PlayerListItem
											player={player}
											self={self}
										/>
										<Separator className="my-2" />
									</Fragment>
								))}
							</div>
						</ScrollArea>
					</CardContent>
					<Separator className="my-4" />
					<CardFooter className="flex justify-between gap-2">
						{self.host && (
							<Button
								className="grow"
								variant={'default'}
								onClick={startGame}
							>
								Start Game
							</Button>
						)}
						<Button
							className="grow"
							variant={'destructive'}
							onClick={leaveGame}
						>
							Leave Game
						</Button>
					</CardFooter>
				</Card>
				<TeamCard
					color="Blue"
					self={self}
					allPlayers={playerInTeams.filter(
						(player) => player.team === 'Blue'
					)}
				/>
			</div>
		</>
	);
}

export default lobby;
