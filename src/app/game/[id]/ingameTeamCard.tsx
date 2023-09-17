import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { GAME_TEAMS } from '@/lib/constants/game';
import React, { useMemo } from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';

type Props = {
	color: typeof GAME_TEAMS.RED | typeof GAME_TEAMS.BLUE;
	wordsLeft: number;
	players: Doc<'player'>[];
	active: boolean;
};

function IngameTeamCard({ wordsLeft, color, players, active }: Props) {
	const spymaster = useMemo(
		() => players.find((player) => player.role === 'Spymaster'),
		[players]
	);
	const operatives = useMemo(
		() => players.filter((player) => player.role === 'Operative'),
		[players]
	);

	return (
		<Card className={cn('grow', {
            'outline outline-primary' : active
        })}>
			<CardHeader className="p-4 pb-0">
				<CardTitle>{color} Team</CardTitle>
				<CardDescription>Words left: {wordsLeft}</CardDescription>
			</CardHeader>
			<CardContent className="p-4">
				<h4 className="mb-2 text-sm font-medium leading-none">
					Spymaster: {spymaster?.name}
				</h4>
				<ScrollArea className="h-32 rounded-md border">
					<div className="p-2">
						<h4 className="mb-2 text-sm font-extrabold leading-none">
							Operatives:
						</h4>
						{operatives.map((player) => (
							<>
								<div key={player._id} className="text-sm">
									{player.name}
								</div>
								<Separator className="my-2" />
							</>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}

export default IngameTeamCard;
