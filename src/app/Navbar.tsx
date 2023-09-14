'use client';

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

export function Navbar() {
	return (
		<div className="border-b py-4">
			<div className="container mx-auto flex justify-between">
				<div className="text-xl font-bold">Codenames</div>

				<nav className="flex gap-4"></nav>
			</div>
		</div>
	);
}
