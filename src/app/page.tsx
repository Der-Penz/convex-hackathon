'use client';

import { useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useState } from 'react';

export default function Home() {
	const [joinCode, setJoinCode] = useState('');

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setJoinCode(event.target.value);
	};

	return (
		<main className="my-5 px-5 w-full flex items-center flex-col">
			<h1 className="select-none text-center font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-800 to-pink-600">
				Codenames Online
			</h1>
			<div className="my-5 text-center text-lg font-bold border-2 border-slate shadow-sm rounded-lg p-2">
				<p>Create a game and play with your friends online</p>
				<p>No account needed!</p>
			</div>
			<div className="flex gap-4 flex-col w-max">
				<Button variant={'outline'} className="font-extrabold text-3xl">
					<Link href={`/create`}>Create Room</Link>
				</Button>
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="Join code"
						value={joinCode}
						onChange={handleChange}
					/>
					<Button
						variant={'outline'}
						className="font-extrabold text-3xl w-full"
					>
						<Link href={`/game/${joinCode}`}>Join Room</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
