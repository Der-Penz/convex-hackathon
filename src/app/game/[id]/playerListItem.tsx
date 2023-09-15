import { Badge } from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@radix-ui/react-select';
import { BsFilePersonFill } from 'react-icons/bs';
import { GiSpectacles } from 'react-icons/gi';
import { RiSpyFill } from 'react-icons/ri';
import { Doc } from '../../../../convex/_generated/dataModel';

type Props = {
	player: Doc<'player'>;
	self: Doc<'player'>;
};

function playerListItem({ player, self }: Props) {
	return (
		<>
			<TooltipProvider delayDuration={100} disableHoverableContent={true}>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="flex gap-2 cursor-pointer items-center">
							{player._id === self._id && (
								<Badge variant={'default'}>You</Badge>
							)}
							{player.host && (
								<Badge variant={'secondary'}>Host</Badge>
							)}
							<div className="text-lg font-extralight">
								{player.name}
							</div>
							<span className="grow"></span>
							{player.role === 'Spymaster' ? (
								<RiSpyFill size={'2rem'} />
							) : player.role === 'Spectator' ? (
								<GiSpectacles size={'2rem'} />
							) : (
								<BsFilePersonFill size={'2rem'} />
							)}
						</div>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p className="flex gap-2 text-lg items-center">
							{player.role}
							{player.role === 'Spymaster' ? (
								<RiSpyFill size={'2rem'} />
							) : player.role === 'Spectator' ? (
								<GiSpectacles size={'2rem'} />
							) : (
								<BsFilePersonFill size={'2rem'} />
							)}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</>
	);
}

export default playerListItem;
