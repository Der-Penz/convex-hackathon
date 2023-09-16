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
import ThemeToggle from '@/components/themeToggle';

export function Navbar() {
	return (
		<div className="border-b py-4">
			<nav className="container flex justify-center gap-4 items-center">
				<div className="text-xl font-bold">Codenames</div>
				<span className="grow"></span>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<Link href="/create" legacyBehavior passHref>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
								>
									Create Game
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
				<ThemeToggle />
			</nav>
		</div>
	);
}
