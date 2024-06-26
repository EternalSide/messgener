import type {Metadata} from "next";
import {Inter, Roboto} from "next/font/google";
import "./globals.css";
import {SocketProvider} from "@/providers/SocketProvider";
import {ClerkProvider} from "@clerk/nextjs";
import {ruRU} from "@clerk/localizations";
import {ThemeProvider} from "@/providers/ThemeProvider";
import {ModalProvider} from "@/providers/ModalProvider";
import {QueryProvider} from "@/providers/QueryProvider";
import {EdgeStoreProvider} from "@/lib/edgestore";

const inter = Roboto({
	weight: ["100", "300", "500", "400", "700", "900"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Chatgram",
	description: "Generated by create next app",
	icons: {
		icon: "https://cdn.iconscout.com/icon/free/png-256/free-chat-2130787-1794829.png?f=webp",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider localization={ruRU}>
			<EdgeStoreProvider>
				<html
					className='dark'
					lang='en'
				>
					<body className={inter.className}>
						<ThemeProvider
							attribute='class'
							defaultTheme='dark'
							storageKey='discord-theme'
						>
							<SocketProvider>
								<QueryProvider>{children}</QueryProvider>
							</SocketProvider>
						</ThemeProvider>
						<ModalProvider />
					</body>
				</html>
			</EdgeStoreProvider>
		</ClerkProvider>
	);
}
