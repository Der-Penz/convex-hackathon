import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

import React from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';

type Props = {
	document: Doc<'document'>;
};

function DocumentInfo({ document }: Props) {
	return (
		<HoverCard>
			<HoverCardTrigger>Document {document.name}</HoverCardTrigger>
			<HoverCardContent>
				<div className="flex flex-col items-start gap-2">
					<div className='self-stretch flex gap-2 items-center'>
						<span className='grow'>
							{document.name}.{document.filetype}
						</span>
						<Badge variant="secondary">
							{new Date(
								document._creationTime
							).toLocaleDateString()}
						</Badge>
					</div>
					<span>Creator: {document.creator}</span>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

export default DocumentInfo;
