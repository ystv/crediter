"use client";

import type { ReactNode } from "react";
import {
	useCreateSocket,
	WebsocketContext,
} from "../../../../lib/socket/client";

export function WebsocketProvider({ children }: { children: ReactNode }) {
	return (
		<WebsocketContext.Provider value={useCreateSocket()}>
			{children}
		</WebsocketContext.Provider>
	);
}
