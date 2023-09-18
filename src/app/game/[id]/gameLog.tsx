'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import React, { Fragment } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

type Props = {
	gameId: Id<'game'>;
};

function GameLog({ gameId }: Props) {
	const logs = useQuery(api.gameLog.getLog, {
		gameId: gameId,
	});

	return (
		<>
			<ScrollArea className="rounded-md border  h-full">
				<div className="p-4 pb-1">
					<h4 className="text-base font-bold">Gamelog</h4>
					<Separator className="my-1" />
				</div>

				<div className="p-4 pt-0 w-full text-sm">
					{logs?.map((log) => (
						<Fragment key={log._id}>
							<span
								className={`pr-1 ${
									log.team === 'Red'
										? 'text-red-500'
										: log.team === 'Blue'
										? 'text-blue-500'
										: ''
								}`}
							>
								●
							</span>
							<span>{log.message}</span>
							<Separator className="my-1" />
						</Fragment>
					))}
				</div>
			</ScrollArea>
		</>
	);
}

export default GameLog;
