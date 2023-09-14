import ThemeProvider from '@/components/themeProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ConvexClientProvider from './ConvexClientProvider';
import { Navbar } from './Navbar';
import './globals.css';

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
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<ConvexClientProvider>
						<div className="w-full h-[100vh] flex flex-col">
							<Navbar />
							<div className="grow">{children}</div>
						</div>
					</ConvexClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
