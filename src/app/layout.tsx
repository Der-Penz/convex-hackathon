import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import ConvexClientProvider from './ConvexClientProvider';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Navbar } from './Navbar';
import { ConvexReactClient } from 'convex/react';
import { env } from 'process';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Hakathon Project',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ConvexClientProvider>
					<Navbar />
					{children}
				</ConvexClientProvider>
			</body>
		</html>
	);
}
