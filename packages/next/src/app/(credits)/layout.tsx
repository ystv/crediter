import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { WebsocketProvider } from "../_components/websocket-provider";

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body>
				<WebsocketProvider>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</WebsocketProvider>
			</body>
		</html>
	);
}
