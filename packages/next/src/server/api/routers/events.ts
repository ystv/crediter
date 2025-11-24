import { getIO } from "@repo/lib/socket/server";
import dayjs from "dayjs";
import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";

export const eventsRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		const from = dayjs().subtract(2, "days");

		const res = await ctx.db.event.findMany({
			where: {
				date: {
					gte: from.toDate(),
				},
			},
			orderBy: {
				date: "asc",
			},
		});

		return { ok: true, res };
	}),

	create: protectedProcedure
		.input(z.object({ name: z.string(), date: z.coerce.date() }))
		.mutation(async ({ ctx, input }) => {
			const io = await getIO();

			const event = await ctx.db.event.create({
				data: {
					name: input.name,
					date: input.date,
					created_by: { connect: { id: ctx.session.user.id } },
				},
			});

			io.in("users").emit("update:events");

			return event;
		}),

	read: protectedProcedure
		.input(z.object({ event_id: z.cuid() }))
		.query(({ ctx, input }) => {
			return ctx.db.event.findUnique({
				where: {
					id: input.event_id,
				},
				include: {
					credit_roles: {
						orderBy: {
							order: "asc",
						},
						include: {
							names: {
								orderBy: {
									order: "asc",
								},
							},
						},
					},
					generated_credits: {
						orderBy: {
							created_at: "desc",
						},
						take: 1,
					},
				},
			});
		}),

	readRoles: publicProcedure
		.input(z.object({ event_id: z.cuid() }))
		.query(({ ctx, input }) => {
			return ctx.db.event.findUnique({
				where: {
					id: input.event_id,
				},
				include: {
					credit_roles: {
						orderBy: {
							order: "asc",
						},
						include: {
							names: {
								orderBy: {
									order: "asc",
								},
							},
						},
					},
				},
			});
		}),
});
