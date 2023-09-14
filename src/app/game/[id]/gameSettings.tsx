import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MdSettings } from 'react-icons/md';
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function gameSettings() {
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
				<div className="flex gap-4 items-stretch flex-col py-4">
					<Label htmlFor="collection">Word Collection</Label>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select a word collection" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Standard Collection</SelectLabel>
								<SelectItem value="basic">Basic</SelectItem>
								<SelectItem value="programming">
									Programming
								</SelectItem>
								<SelectLabel>Custom</SelectLabel>
								<SelectItem value="ai">AI</SelectItem>
								<SelectItem value="import">
									Import
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
