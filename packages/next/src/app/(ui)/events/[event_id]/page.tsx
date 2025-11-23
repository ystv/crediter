"use client";

import {
	Button,
	Card,
	Center,
	Group,
	Loader,
	Modal,
	Stack,
	Table,
	Text,
	Title,
	Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSocketTriggeredFunction } from "@repo/lib/socket/client";
import { use, useState } from "react";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import z from "zod";
import { CreditProgressCard } from "@/app/_components/credit-progress";
import { useAppForm } from "@/app/_components/form";
import { api } from "@/trpc/react";

export default function EventPage({
	params,
}: {
	params: Promise<{ event_id: string }>;
}) {
	const awaitedParams = use(params);
	const eventQuery = api.events.read.useQuery({
		event_id: awaitedParams.event_id,
	});

	useSocketTriggeredFunction(`update:event:${awaitedParams.event_id}`, () =>
		eventQuery.refetch(),
	);

	const [modalOpened, setModalOpened] = useState<
		"create" | `name:${string}` | undefined
	>();

	const generateEventCredits = api.credits.generateCredits.useMutation().mutate;

	const reorderRole = api.creditRoles.reorder.useMutation().mutate;
	const deleteRole = api.creditRoles.delete.useMutation().mutate;
	const reorderRoleName = api.creditRoleNames.reorder.useMutation().mutate;
	const deleteRoleName = api.creditRoleNames.delete.useMutation().mutate;

	const openRoleDeleteModal = ({ name, id }: { name: string; id: string }) =>
		modals.openConfirmModal({
			title: "Delete Role?",
			children: <Text>Delete {name} and all names assigned to it?</Text>,
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => deleteRole({ credit_role_id: id }),
		});

	const openRoleNameDeleteModal = ({
		name,
		id,
	}: {
		name: string;
		id: string;
	}) =>
		modals.openConfirmModal({
			title: "Delete Role Name?",
			children: <Text>Remove {name} from this role?</Text>,
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => deleteRoleName({ credit_role_name_id: id }),
		});

	if (!eventQuery.data) {
		return (
			<Center>
				<Loader />
			</Center>
		);
	}

	const event = eventQuery.data;

	const credits = event.credit_roles;

	return (
		<Stack>
			<Modal
				onClose={() => setModalOpened(undefined)}
				opened={modalOpened === "create"}
			>
				<CreateRoleForm
					event_id={awaitedParams.event_id}
					onSuccess={() => setModalOpened(undefined)}
				/>
			</Modal>

			<Title>{event.name}</Title>
			{event.generated_credits.map((asset) => {
				return <CreditProgressCard credit_id={asset.id} key={asset.id} />;
			})}
			<Button onClick={() => generateEventCredits({ event_id: event.id })}>
				Generate
			</Button>
			{credits.map((role, idx) => {
				return (
					<Card key={role.name} withBorder>
						<Group>
							<Title order={3}>{role.name}</Title>
							<Button.Group ml={"auto"}>
								<Tooltip label="Move Role Down">
									<Button
										disabled={idx + 1 === credits.length}
										onClick={() =>
											reorderRole({
												credit_role_id: role.id,
												direction: "down",
											})
										}
										variant="default"
									>
										<FaChevronDown />
									</Button>
								</Tooltip>
								{/* <Button.GroupSection variant="default">
									{role.order}
								</Button.GroupSection> */}
								<Tooltip label="Move Role Up">
									<Button
										disabled={idx === 0}
										onClick={() =>
											reorderRole({ credit_role_id: role.id, direction: "up" })
										}
										variant="default"
									>
										<FaChevronUp />
									</Button>
								</Tooltip>
								<Tooltip label="Delete Role">
									<Button color="red" onClick={() => openRoleDeleteModal(role)}>
										<FaTrash />
									</Button>
								</Tooltip>
							</Button.Group>
						</Group>
						<Stack>
							<Table striped stripedColor="var(--mantine-color-default-hover)">
								<Table.Thead>
									<Table.Tr>
										<Table.Th>
											<Group>
												<Text>Name</Text>
												<Text ml="auto">Actions</Text>
											</Group>
										</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{role.names.map((creditName, idx) => (
										<Table.Tr key={creditName.id}>
											<Table.Td>
												<Group>
													{creditName.name}
													<Button.Group h={24} ml={"auto"}>
														<Tooltip label="Move Name Down">
															<Button
																disabled={idx + 1 === role.names.length}
																h={24}
																onClick={() =>
																	reorderRoleName({
																		credit_role_name_id: creditName.id,
																		direction: "down",
																	})
																}
																variant="default"
															>
																<FaChevronDown size={8} />
															</Button>
														</Tooltip>
														<Tooltip label="Move Name Up">
															<Button
																disabled={idx === 0}
																h={24}
																onClick={() =>
																	reorderRoleName({
																		credit_role_name_id: creditName.id,
																		direction: "up",
																	})
																}
																variant="default"
															>
																<FaChevronUp size={8} />
															</Button>
														</Tooltip>
														<Tooltip label="Delete Name">
															<Button
																color="red"
																h={24}
																onClick={() =>
																	openRoleNameDeleteModal(creditName)
																}
															>
																<FaTrash size={8} />
															</Button>
														</Tooltip>
													</Button.Group>
												</Group>
											</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
							<Group>
								<Button
									disabled={!!modalOpened}
									onClick={() => setModalOpened(`name:${role.id}`)}
								>
									Add Name
								</Button>
							</Group>
						</Stack>
						<Modal
							onClose={() => setModalOpened(undefined)}
							opened={modalOpened === `name:${role.id}`}
						>
							<AddNameToRoleForm
								onSuccess={() => setModalOpened(undefined)}
								role_id={role.id}
							/>
						</Modal>
					</Card>
				);
			})}
			<Group>
				<Button
					disabled={!!modalOpened}
					onClick={() => setModalOpened("create")}
				>
					Add Role
				</Button>
			</Group>
		</Stack>
	);
}

function CreateRoleForm(props: { onSuccess: () => void; event_id: string }) {
	const schema = z.object({ name: z.string() });

	const createCreditRole = api.creditRoles.create.useMutation().mutateAsync;

	const form = useAppForm({
		validators: {
			onChange: schema,
		},
		defaultValues: {
			name: "",
		},
		onSubmit: async ({ value }) => {
			const _res = await createCreditRole({
				event_id: props.event_id,
				name: value.name,
			});

			props.onSuccess();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.AppField name="name">
				{(field) => <field.TextField label="Role Name" />}
			</form.AppField>

			<form.AppForm>
				<form.SubscribeButton label="Submit" />
			</form.AppForm>
		</form>
	);
}

function AddNameToRoleForm(props: { onSuccess: () => void; role_id: string }) {
	const schema = z.object({ name: z.string() });

	const createCreditRole = api.creditRoles.addName.useMutation().mutateAsync;

	const form = useAppForm({
		validators: {
			onChange: schema,
		},
		defaultValues: {
			name: "",
		},
		onSubmit: async ({ value }) => {
			const _res = await createCreditRole({
				role_id: props.role_id,
				name: value.name,
			});

			props.onSuccess();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.AppField name="name">
				{(field) => <field.TextField label="Name" />}
			</form.AppField>

			<form.AppForm>
				<form.SubscribeButton label="Submit" />
			</form.AppForm>
		</form>
	);
}
