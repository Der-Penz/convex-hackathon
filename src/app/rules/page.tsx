'use client';

import { Separator } from '@/components/ui/separator';
import React from 'react';

function Rules() {
	return (
		<section className="max-w-4xl mx-auto p-5">
			<h1 className="text-4xl font-bold">Rules</h1>
			<Separator />
			<p className="font-light py-2 text-lg">
				Codenames is a game for two teams. There is a grid of 25 words.
				Some of them are secretly assigned to the Red Team, some to the
				Blue Team. One player from each team is the Spymaster, and only
				Spymasters see which words belong to which team. Spymasters take
				turns giving clues to their teammates (Operatives), trying to
				lead them to guessing their team&apos;s words. The team that guesses
				all their words first wins the game.
			</p>

			<h2 className="text-2xl font-bold">Lobby</h2>
			<Separator />
			<p className="font-light py-2 text-lg">
				Once you join a game you can chose a team and role. Each team
				can only have one spymaster
			</p>

			<h2 className="text-2xl font-bold">Giving clues</h2>
			<Separator />
			<p className="font-light py-2 text-lg">
				Spymasters give clues. When it&apos;s your turn to give a clue, type
				in a one word clue that relates to all selected words. Your
				Operatives will only see the clue and the number of marked
				cards. Note your clue word cannot be one of the words on the
				cards only related words are allowed
			</p>

			<p className="font-light py-2 text-lg">
				Watch out for the black card. Avoid clues that would lead to the
				assassin or to the other team&apos;s words. If your operatives reveal
				this card your team will immediately loose.
			</p>

			<h2 className="text-2xl font-bold">Guessing</h2>
			<Separator />
			<p className="font-light py-2 text-lg">
				Operatives guess the words based on the Spymaster&apos;s clue. You
				can discuss the clue with your teammates. By tapping the card
				you will reveal the color of the word. If you guess a word of
				your team&apos;s color, you may guess again. You&apos;ll want to guess as
				many words as your Spymaster indicated.
			</p>

			<h2 className="text-2xl font-bold">End of Turn</h2>
			<Separator />
			<p className="font-light py-2 text-lg">
				Your turn can end in one of three ways:
				<br />
				-Guessing a word of the opponent&apos;s color or neutral color.
				<br />
				-Ending guessing manually by clicking the button.
				<br />- Reaching the maximum number of guesses (clue number +
				1).
			</p>

			<h2 className="text-2xl font-bold">Winning and Losing</h2>
			<Separator />
			<p className="font-light py-2 text-lg">
				Teams alternate turns. A team wins once all their words have
				been guessed. They lose if they guess the Assassin!
			</p>
		</section>
	);
}

export default Rules;
