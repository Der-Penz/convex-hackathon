'use client';

import React from 'react';
import { Doc } from '../../../../convex/_generated/dataModel';

type Props = {
	game: Doc<'game'>;
	self: Doc<'player'>;
};

function calculateMessage(game: Doc<'game'>, self: Doc<'player'>) {
	const activeRole = game.activeRole === self.role;

	//spectators
	if (self.role === 'Spectator') {
		if (game.activeRole === 'Spymaster') {
			return `The ${game.currentTeam} spymaster is playing...`;
		}
		if (game.activeRole === 'Operative') {
			return `The ${game.currentTeam} operatives are playing...`;
		}
	}

	//your team
	if (game.currentTeam === self.team) {
		if (activeRole && self.role === 'Spymaster') {
			return 'Give your operatives a clue.';
		}
		if (activeRole && self.role === 'Operative') {
			return 'Try to guess a word.';
		}
		if (!activeRole && self.role === 'Spymaster') {
			return 'Your operatives are guessing now...';
		}
		if (!activeRole && self.role === 'Operative') {
			return 'Your spymaster is thinking...';
		}
	}
	//other team
	else {
		if (game.activeRole === 'Spymaster') {
			return 'The opponent spymaster is playing, wait for your turn...';
		}
		if (game.activeRole === 'Operative') {
			return 'The opponent operatives are playing, wait for your turn...';
		}
	}
}

function TitleMessage({ game, self }: Props) {
	return (
		<h3 className="border py-1 px-4 font-bold rounded-md bg-muted shadow">
			{calculateMessage(game, self)}
		</h3>
	);
}

export default TitleMessage;
