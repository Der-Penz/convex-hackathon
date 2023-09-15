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
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import GameSettings from './gameSettings';
import TeamCard from './teamCard';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Fragment } from 'react';
import PlayerListItem from './playerListItem';
import { useRouter } from 'next/navigation';
import { FaCopy } from 'react-icons/fa';

type Props = {
	gameId: Id<'game'>;
	playerId: Id<'player'>;
};

function game({ gameId, playerId }: Props) {
	const router = useRouter();
	const self = useQuery(api.player.getPlayer, { playerId });
	const game = useQuery(api.player.getPlayers, {
		gameId,
	});
	const allPlayers = useQuery(api.player.getPlayers, { gameId });
	const leaveGameMutation = useMutation(api.game.leaveGame);

	if (!self || !game || !allPlayers || allPlayers?.length < 1) {
		return <div>not loaded</div>;
	}

	const spectators = allPlayers.filter(
		(player) => player.role === 'Spectator'
	);
	const playerInTeams = allPlayers.filter(
		(player) => player.role !== 'Spectator'
	);

	async function leaveGame() {
		const left = await leaveGameMutation({ playerId: playerId });

		if (left.deleted) {
			router.push('/');
		}
	}

	function copyGameCode(){
		navigator.clipboard.writeText(gameId);
	}

	return (
		<div>
			<section className="flex gap-2 p-4 border-b-2 items-center">
				<h3 className="text-xl">
					Game: <span className="font-extralight">{gameId}</span>
				</h3>
				<Button variant={'ghost'} onClick={copyGameCode}>
					<FaCopy />
				</Button>
				<span className="grow"></span>
				<Badge variant={'outline'}>{self?.name}</Badge>
				{true && <GameSettings />}
				{self.host && <GameSettings />}
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
		</div>
	);
}

export default game;
