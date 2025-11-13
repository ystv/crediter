import dotenv from "dotenv";
import { exit } from "process";
import { z } from "zod";

dotenv.config({ quiet: true });

const envSchema = z.object({
	AUTH_SECRET:
		process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
	DATABASE_URL: z.url(),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	KEYCLOAK_ID: z.string(),
	KEYCLOAK_SECRET: z.string(),
	KEYCLOAK_ISSUER: z.string(),
});

export function validateEnv(): NodeJS.ProcessEnv | z.infer<typeof envSchema> {
	if (process.env.SKIP_ENV_VALIDATION === "1") return process.env;
	const envResult = envSchema.safeParse(env ?? process.env);
	if (!envResult.success) {
		console.error("Error: Bad env configuration");
		for (const error of envResult.error.issues) {
			console.error(
				`  - variable ${error.path.join(".")} ${error.code}, ${error.message}`,
			);
		}
		exit(1);
	}
	return envResult.data;
}

export const env = validateEnv();
