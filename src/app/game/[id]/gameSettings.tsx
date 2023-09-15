'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { GAME_WORD_COLLECTIONS } from '@/lib/constants/game';
import { GameSettings } from '@/lib/types/game';
import { Dispatch, SetStateAction } from 'react';
import { MdSettings } from 'react-icons/md';

type Props = {
	settings: GameSettings;
	setSettings: Dispatch<SetStateAction<GameSettings>>;
};

export default function gameSettings({ settings, setSettings }: Props) {
	const selectedCollection = GAME_WORD_COLLECTIONS.find(
		(collection) => collection.name === settings.collection
	);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="p-1">
					<MdSettings size={'100%'} />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Game Settings</SheetTitle>
					<SheetDescription>
						Customize the gameplay experience by adjusting various
						parameters and preferences.
					</SheetDescription>
				</SheetHeader>
				<div className="flex gap-8 items-stretch flex-col py-8">
					<div className="flex gap-2 items-stretch flex-col">
						<HoverCard openDelay={100}>
							<HoverCardTrigger asChild>
								<Label htmlFor="collection">
									Word Collection
								</Label>
							</HoverCardTrigger>
							<HoverCardContent>
								<p>
									<span className="flex gap-2">
										Collection: {settings.collection}
										<Badge variant={'secondary'}>
											{selectedCollection?.count}
										</Badge>
									</span>
									<br />
									<span>
										{selectedCollection?.description}
									</span>
								</p>
							</HoverCardContent>
						</HoverCard>

						<Select
							name="collection"
							onValueChange={(value) => {
								setSettings((prev) => ({
									...prev,
									collection: value,
								}));
							}}
						>
							<SelectTrigger>
								<SelectValue
									placeholder="Select a word collection"
									defaultValue={settings.collection}
								/>
							</SelectTrigger>
							<SelectContent>
								<ScrollArea className="h-64">
									<SelectGroup>
										<SelectLabel>
											Standard Collection
										</SelectLabel>
										{GAME_WORD_COLLECTIONS.map(
											(collection) => (
												<SelectItem
													value={collection.name}
												>
													{collection.name}
												</SelectItem>
											)
										)}
									</SelectGroup>
									<SelectGroup>
										<SelectLabel>Custom</SelectLabel>
										<SelectItem value="ai">AI</SelectItem>
										<SelectItem value="import">
											Import
										</SelectItem>
									</SelectGroup>
								</ScrollArea>
							</SelectContent>
						</Select>
					</div>

					<div className="flex gap-2 items-center">
						<Switch
							name="black-card"
							checked={settings.blackCards}
							onCheckedChange={(checked) => {
								setSettings((prev) => ({
									...prev,
									blackCards: checked,
								}));
							}}
						/>
						<Label htmlFor="black-card">Black Card</Label>
					</div>
					<div className="flex gap-2 items-center">
						<Switch
							name="timer"
							disabled
							checked={settings.timer}
							onCheckedChange={(checked) => {
								setSettings((prev) => ({
									...prev,
									timer: checked,
								}));
							}}
						/>
						<Label htmlFor="timer">Timer</Label>
					</div>

					<div className="flex gap-2 items-stretch flex-col">
						<Label htmlFor="cards">
							Cards to Guess : {settings.cardsToGuess}
						</Label>
						<Slider
							name="cards"
							value={[settings.cardsToGuess]}
							onValueChange={(value) => {
								setSettings((prev) => ({
									...prev,
									cardsToGuess: value[0],
								}));
							}}
							max={10}
							min={5}
							step={1}
						/>
					</div>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
