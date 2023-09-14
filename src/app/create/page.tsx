'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRouter } from 'next/navigation';

export default function Page() {
	const router = useRouter();
	const createGameMutation = useMutation(api.game.createGame);

	const [name, setName] = React.useState('');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	async function createGame() {
		const { joinId } = await createGameMutation();

		if (!joinId) {
			return;
		}

		router.push(`/game/${joinId}?name=${name}`);
	}

	return (
		<div className="grid place-items-center w-full h-full">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Create Codenames Game</CardTitle>
					<CardDescription>
						Enter a name for yourself to continue
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									placeholder="Your name"
									value={name}
									onChange={handleChange}
								/>
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline">
						<Link href={'/'}>Cancel</Link>
					</Button>
					<Button onClick={(e) => createGame()}>Create</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
