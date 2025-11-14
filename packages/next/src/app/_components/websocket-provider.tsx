"use client";

import { type TSocket, useCreateSocket } from "@repo/lib/socket/client";
import { createContext, type ReactNode, useContext } from "react";

export const WebsocketContext = createContext<TSocket>(
	null as unknown as TSocket,
);

export function useWebsocket() {
	return useContext(WebsocketContext);
}

export function WebsocketProvider({ children }: { children: ReactNode }) {
	return (
		<WebsocketContext.Provider value={useCreateSocket()}>
			{children}
		</WebsocketContext.Provider>
	);
}
