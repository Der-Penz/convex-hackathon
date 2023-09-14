const adjectives: string[] = [
	'Funny',
	'Silly',
	'Clever',
	'Happy',
	'Brave',
	'Charming',
	'Graceful',
	'Lively',
	'Adventurous',
	'Witty',
	'Kind',
	'Gentle',
	'Energetic',
	'Caring',
	'Inventive',
	'Calm',
	'Courageous',
	'Daring',
	'Fierce',
];

const animals: string[] = [
	'Frog',
	'Tiger',
	'Penguin',
	'Elephant',
	'Kangaroo',
	'Dolphin',
	'Giraffe',
	'Ostrich',
	'Panda',
	'Lion',
	'Koala',
	'Zebra',
	'Rhino',
	'Octopus',
	'Koala',
	'Sloth',
	'Polar Bear',
	'Jaguar',
	'Owl',
];

export function generateRandomName(): string {
	const randomAdjective =
		adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

	return `${randomAdjective} ${randomAnimal}`;
}
