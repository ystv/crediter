import { getIO } from "@repo/lib/socket/server";
import type { Server } from "socket.io";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const creditRolesRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				event_id: z.cuid(),
				name: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const io = await getIO();

			const event = await ctx.db.event.findFirstOrThrow({
				where: {
					id: input.event_id,
				},
				include: {
					credit_roles: true,
				},
			});

			const _role = await ctx.db.creditRole.create({
				data: {
					name: input.name,
					order: event.credit_roles.length,
					event: { connect: { id: event.id } },
				},
			});

			io.in("users").emit(`update:event:${event.id}`);
		}),

	delete: protectedProcedure
		.input(
			z.object({
				credit_role_id: z.cuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const io = await getIO();

			const deletedRole = await ctx.db.creditRole.delete({
				where: {
					id: input.credit_role_id,
				},
				select: {
					order: true,
					event_id: true,
				},
			});

			await ctx.db.creditRole.updateMany({
				where: {
					event_id: deletedRole.event_id,
					order: {
						gte: deletedRole.order,
					},
				},
				data: {
					order: {
						decrement: 1,
					},
				},
			});

			io.in("users").emit(`update:event:${deletedRole.event_id}`);
		}),

	reorder: protectedProcedure
		.input(
			z.object({ credit_role_id: z.cuid(), direction: z.enum(["up", "down"]) }),
		)
		.mutation(async ({ ctx, input }) => {
			const io = await getIO();

			const role = await ctx.db.creditRole.findFirstOrThrow({
				where: { id: input.credit_role_id },
				include: {
					event: {
						select: { id: true, credit_roles: { select: { _count: true } } },
					},
				},
			});

			// Return if the role is already at its limit
			if (
				(input.direction === "up" && role.order === 0) ||
				(input.direction === "down" &&
					role.order >= role.event.credit_roles.length - 1)
			)
				return;

			await ctx.db.creditRole.updateMany({
				where: {
					event_id: role.event_id,
					order: input.direction === "up" ? role.order - 1 : role.order + 1,
				},
				data: {
					order:
						input.direction === "down" ? { decrement: 1 } : { increment: 1 },
				},
			});

			await ctx.db.creditRole.update({
				where: {
					id: role.id,
				},
				data: {
					order: input.direction === "up" ? { decrement: 1 } : { increment: 1 },
				},
			});

			io.in("users").emit(`update:event:${role.event.id}`);
		}),

	addName: protectedProcedure
		.input(
			z.object({
				role_id: z.cuid(),
				name: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const io = await getIO();

			const role = await ctx.db.creditRole.findFirstOrThrow({
				where: {
					id: input.role_id,
				},
				include: {
					names: true,
				},
			});

			const _roleName = await ctx.db.creditRoleName.create({
				data: {
					name: input.name,
					order: role.names.length,
					credit_role: { connect: { id: role.id } },
				},
			});

			io.in("users").emit(`update:event:${role.event_id}`);
		}),
});
