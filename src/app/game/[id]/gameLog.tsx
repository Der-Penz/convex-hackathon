import { ScrollArea } from '@/components/ui/scroll-area';
import React, { Fragment } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Separator } from '@/components/ui/separator';

type Props = {
	gameId: Id<'game'>;
};

function GameLog({ gameId }: Props) {
	const logs = useQuery(api.gameLog.getLog, {
		gameId: gameId,
	});

	return (
		<ScrollArea className="rounded-md border w-[15%]">
			<div className="p-4 w-full">
				{logs?.map((log) => (
					<Fragment key={log._id}>
						<p>{log.message}</p>
						<Separator className="my-2" />
					</Fragment>
				))}
			</div>
		</ScrollArea>
	);
}

export default GameLog;
