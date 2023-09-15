import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function shuffleArray(arr: string[]): string[] {
	const shuffledArray = [...arr]; // Create a copy of the original array

	return shuffledArray.sort(() => Math.random() - 0.5);
}
