// import { checkDatabaseConnection, prepareHttpServer } from "./lib";
import { env, validateEnv } from "@repo/lib/env";
import next from "next";
import { Server } from "socket.io";
import { authenticateSocket } from "./auth";
import { checkDatabaseConnection, prepareHttpServer } from "./lib";

// import { isMinioEnabled, getMinioClient } from "../lib/minio";
// import { setupActionHandlers } from "../lib/slack/actions";
// import {
//   createSlackApp,
//   isSlackEnabled,
// } from "../lib/slack/slackApiConnection";

const dev = env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port, dir: "./packages/next" });
const handler = app.getRequestHandler();

var io: Server;

validateEnv();

app.prepare().then(async () => {
	const httpServer = await prepareHttpServer(handler);

	await checkDatabaseConnection();

	io = new Server(httpServer);
	(globalThis as unknown as { io: Server }).io = io;

	io.use(authenticateSocket);

	io.on("connection", async (socket) => {
		// if (socket.data.auth.invalidSession === true) {
		//   socket.emit("invalidSession");
		// }
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});
