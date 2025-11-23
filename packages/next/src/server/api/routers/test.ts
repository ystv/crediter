import { exec } from "node:child_process";
import util from "node:util";
import { io } from "@repo/lib/socket/server";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";

const _execAsync = util.promisify(exec);

export const testRouter = createTRPCRouter({
	ping: publicProcedure.query(() => {
		return {
			pong: true,
		};
	}),

	on: protectedProcedure.mutation(async () => {
		io.in("users").emit("test:on");

		return { ok: true };
	}),

	off: protectedProcedure.mutation(async () => {
		io.in("users").emit("test:off");

		return { ok: true };
	}),

	// generateTestCredits: publicProcedure.mutation(async ({ ctx }) => {
	// 	io.in("users").emit("credits:test:step", 0);

	// 	const browser = await puppeteer.launch({
	// 		defaultViewport: {
	// 			width: 1920,
	// 			height: 1080,
	// 			isLandscape: true,
	// 		},
	// 		executablePath: process.env.PUPPETEER_CHROME_PATH,
	// 		args: ["--no-sandbox"],
	// 	});

	// 	const mktemp_res = await execAsync("mktemp -d");
	// 	const tmpdir = mktemp_res.stdout.trim();

	// 	function tmpdir_path<T extends string>(path: T): `${string}/${T}` {
	// 		return `${tmpdir}/${path}`;
	// 	}

	// 	const page = await browser.newPage();

	// 	await page.goto("http://localhost:3000/generate/scrolling", {
	// 		waitUntil: "networkidle2",
	// 		timeout: 0,
	// 	});

	// 	io.in("users").emit("credits:test:step", 1);

	// 	const image = await page.screenshot({
	// 		fullPage: true,
	// 		path: tmpdir_path("screenshot.png"),
	// 	});

	// 	await browser.close();

	// 	const dimensions = await imageSize(image);

	// 	io.in("users").emit("credits:test:step", 2);

	// 	const PX_PER_FRAME = 6;

	// 	const TOTAL_FRAMES = Math.ceil((dimensions.height - 1080) / PX_PER_FRAME);

	// 	const quality_args = ["-r", "50", "-preset", "veryslow", "-crf", "10"];

	// 	const scroll_args = [
	// 		"-loop",
	// 		"1",
	// 		"-i",
	// 		tmpdir_path("screenshot.png"),
	// 		"-filter_complex",
	// 		`fps=50,crop=1920:1080:0:(n*${PX_PER_FRAME})`,
	// 		"-frames:v",
	// 		`${TOTAL_FRAMES}`,
	// 		"-pix_fmt",
	// 		"yuv420p",
	// 		...quality_args,
	// 		"-y",
	// 		tmpdir_path("credits_scroll.mp4"),
	// 	];

	// 	await new Promise<void>((resolve, reject) => {
	// 		const child = spawn(process.env.FFMPEG_PATH ?? "ffmpeg", scroll_args);

	// 		child.stderr.on("data", (chunk: Buffer) => {
	// 			const data = chunk.toString();
	// 			if (!data.startsWith("frame=")) return;

	// 			const frameNumber = Number(
	// 				data.substring(6, data.indexOf("fps=")).trim(),
	// 			);

	// 			const _progress = Math.round((frameNumber / TOTAL_FRAMES) * 100);
	// 		});

	// 		child.on("close", (code) => {
	// 			if (code === 0) return resolve();
	// 			reject(new Error(`Process exited with code ${code}`));
	// 		});
	// 	});

	// 	io.in("users").emit("credits:test:step", 3);

	// 	const concat_args = [
	// 		"-i",
	// 		tmpdir_path("credits_scroll.mp4"),
	// 		"-i",
	// 		"assets/endcard_50p_fade_out.mp4",
	// 		"-filter_complex",
	// 		"[0:v]fps=50[v0];[1:v]fps=50[v1];[v0][v1]concat=n=2:v=1[outv]",
	// 		"-map",
	// 		"[outv]",
	// 		...quality_args,
	// 		"-y",
	// 		tmpdir_path("out.mp4"),
	// 	];

	// 	await new Promise<void>((resolve, reject) => {
	// 		const child = spawn(process.env.FFMPEG_PATH ?? "ffmpeg", concat_args);

	// 		child.on("close", (code) => {
	// 			if (code === 0) return resolve();
	// 			reject(new Error(`Process exited with code ${code}`));
	// 		});
	// 	});

	// 	io.in("users").emit("credits:test:step", 4);

	// 	const asset = await ctx.db.credit.create({ data: {} });

	// 	const minioClient = getMinioClient();

	// 	const minio_path = `credits/${asset.id}`;

	// 	await minioClient.fPutObject(
	// 		env.MINIO_BUCKET,
	// 		minio_path,
	// 		tmpdir_path("out.mp4"),
	// 		{
	// 			"Content-Type": "video/mp4",
	// 			"Content-Disposition": `attachment; filename="credits_${asset.id}.mp4"`,
	// 		},
	// 	);

	// 	const objectStat = await minioClient.statObject(
	// 		env.MINIO_BUCKET,
	// 		minio_path,
	// 	);

	// 	await ctx.db.credit.update({
	// 		where: {
	// 			id: asset.id,
	// 		},
	// 		data: {
	// 			state: "UPLOADED",
	// 			size: objectStat.size,
	// 		},
	// 	});

	// 	io.in("users").emit("credits:test:step", 5);

	// 	await exec(`rm -r ${tmpdir}`);

	// 	io.in("users").emit("credits:test:step", 6);

	// 	return NextResponse.json(
	// 		{ ok: true },
	// 		{
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				"Cache-Control": "no-store",
	// 			},
	// 		},
	// 	);
	// }),
});
