// import type { Server } from "socket.io";

// export const globalThisForIO = globalThis as unknown as { io: Server };

// export const getIO = () =>
// 	(globalThis as unknown as { io?: Server }).io ??
// 	(() => {
// 		throw new Error("socket.io server is not initialized yet");
// 	})();

import type { Server } from "socket.io";

let _io: Server | undefined;

export function setIO(server: Server) {
	_io = server;
}

export function getIO(): Server {
	if (!_io) {
		throw new Error("IO has not been initialized yet");
	}
	return _io;
}
