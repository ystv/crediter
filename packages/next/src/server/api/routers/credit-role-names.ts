import { getIO } from "@repo/lib/socket/server";
import type { Server } from "socket.io";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const creditRoleNamesRouter = createTRPCRouter({
	reorder: protectedProcedure
		.input(
			z.object({
				credit_role_name_id: z.cuid(),
				direction: z.enum(["up", "down"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const io = getIO();

			const roleName = await ctx.db.creditRoleName.findFirstOrThrow({
				where: { id: input.credit_role_name_id },
				include: {
					credit_role: {
						include: {
							names: true,
							event: {
								select: {
									id: true,
									credit_roles: { select: { _count: true } },
								},
							},
						},
					},
				},
			});

			// Return if the role is already at its limit
			if (
				(input.direction === "up" && roleName.order === 0) ||
				(input.direction === "down" &&
					roleName.order >= roleName.credit_role.names.length - 1)
			)
				return;

			await ctx.db.creditRoleName.updateMany({
				where: {
					credit_role_id: roleName.credit_role_id,
					order:
						input.direction === "up" ? roleName.order - 1 : roleName.order + 1,
				},
				data: {
					order:
						input.direction === "down" ? { decrement: 1 } : { increment: 1 },
				},
			});

			await ctx.db.creditRoleName.update({
				where: {
					id: roleName.id,
				},
				data: {
					order: input.direction === "up" ? { decrement: 1 } : { increment: 1 },
				},
			});

			(globalThis as unknown as { io: Server }).io
				.in("users")
				.emit(`update:event:${roleName.credit_role.event.id}`);
		}),

	delete: protectedProcedure
		.input(
			z.object({
				credit_role_name_id: z.cuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const io = getIO();

			const deletedRoleName = await ctx.db.creditRoleName.delete({
				where: {
					id: input.credit_role_name_id,
				},
				select: {
					credit_role_id: true,
					order: true,
					credit_role: {
						select: {
							event_id: true,
						},
					},
				},
			});

			await ctx.db.creditRoleName.updateMany({
				where: {
					credit_role_id: deletedRoleName.credit_role_id,
					order: {
						gte: deletedRoleName.order,
					},
				},
				data: {
					order: {
						decrement: 1,
					},
				},
			});

			(globalThis as unknown as { io: Server }).io
				.in("users")
				.emit(`update:event:${deletedRoleName.credit_role.event_id}`);
		}),
});
