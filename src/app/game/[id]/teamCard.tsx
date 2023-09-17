'use client';

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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { GAME_ROLES, GAME_TEAMS } from '@/lib/constants/game';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Doc } from '../../../../convex/_generated/dataModel';
import PlayerListItem from './playerListItem';
import { Fragment } from 'react';

type Props = {
	color: (typeof GAME_TEAMS)[keyof typeof GAME_TEAMS];
	self: Doc<'player'>;
	allPlayers: Doc<'player'>[];
};

function teamCard({ color, self, allPlayers }: Props) {
	const joinTeamMutation = useMutation(api.game.joinTeam);
	const inTeam = self.team === color;

	async function joinTeam() {
		if (color !== 'Black' && color !== 'Grey') {
			await joinTeamMutation({
				playerId: self._id,
				team: color,
				role: 'Operative',
			});
		}
	}
	async function changeRole(
		role: (typeof GAME_ROLES)[keyof typeof GAME_ROLES]
	) {
		await joinTeamMutation({
			playerId: self._id,
			team: self.team,
			role,
		});
	}

	async function leaveTeam() {
		await joinTeamMutation({
			playerId: self._id,
			team: self.team,
			role: 'Spectator',
		});
	}

	return (
		<Card className="m-4 flex flex-col">
			<CardHeader>
				<CardTitle>{color} Team:</CardTitle>
				<CardDescription>
					Join this team and select a role
				</CardDescription>
			</CardHeader>
			<CardContent className="flex gap-4 flex-col grow">
				<h4 className="mb-4 text-xl font-medium leading-none">
					Players:
				</h4>
				<ScrollArea className="h-56 rounded-md border w-full">
					<div className="p-4 w-full">
						{allPlayers.map((player) => (
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

				{inTeam && (
					<Select onValueChange={changeRole} name={`Role ${color}`}>
						<SelectTrigger value={self.role}>{self.role}</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Active roles</SelectLabel>
								<SelectItem value={GAME_ROLES.OPERATIVE}>
									{GAME_ROLES.OPERATIVE}
								</SelectItem>
								<SelectItem value={GAME_ROLES.SPYMASTER}>
									{GAME_ROLES.SPYMASTER}
								</SelectItem>
								<SelectLabel>Inactive roles</SelectLabel>
								<SelectItem value={GAME_ROLES.SPECTATOR}>
									{GAME_ROLES.SPECTATOR}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			</CardContent>
			<Separator className="my-4" />
			<CardFooter className="flex justify-between gap-2">
				{inTeam && self?.role !== 'Spectator' ? (
					<Button
						className="grow"
						variant="destructive"
						onClick={leaveTeam}
					>
						Leave
					</Button>
				) : (
					<Button className="grow" onClick={joinTeam}>
						Join
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}

export default teamCard;
