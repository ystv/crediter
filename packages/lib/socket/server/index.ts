import "server-only";

import type { Server } from "socket.io";

export const globalThisForIO = globalThis as unknown as { io: Server };

export const io = globalThisForIO.io;
