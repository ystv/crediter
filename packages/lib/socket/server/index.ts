import "server-only";

import type { Server } from "socket.io";

export const globalThisForIO = globalThis as unknown as { io: Server };

export const getIO = () =>
	(globalThis as unknown as { io?: Server }).io ??
	(() => {
		throw new Error("socket.io server is not initialized yet");
	})();
