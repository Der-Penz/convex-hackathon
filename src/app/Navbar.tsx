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
				<div className="text-xl font-bold">
					MultiMark{' '}
					<span className="text-xs font-thin">
						Collaborative markdown editor
					</span>
				</div>

				<nav className="flex gap-4">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href="/document/new" legacyBehavior passHref>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
									>
										Create document
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</nav>
			</div>
		</div>
	);
}
