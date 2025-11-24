import {
	Button,
	Card,
	Center,
	Group,
	Loader,
	Progress,
	Stack,
	Title,
} from "@mantine/core";
import {
	type CreditProgress,
	CreditState,
} from "@repo/lib/db/generated/prisma/enums";
import { useSocketTriggeredFunction } from "@repo/lib/socket/client";
import Link from "next/link";
import { FaDownload } from "react-icons/fa";
import { api } from "@/trpc/react";
import { useMinioConfig } from "./minio-provider";

export function CreditProgressCard(props: { credit_id: string }) {
	const creditQuery = api.credits.read.useQuery({ credit_id: props.credit_id });

	useSocketTriggeredFunction(`update:credits:${props.credit_id}`, () =>
		creditQuery.refetch(),
	);

	const minioConfig = useMinioConfig();

	if (!creditQuery.data)
		return (
			<Card>
				<Center>
					<Loader />
				</Center>
			</Card>
		);

	const asset = creditQuery.data;

	const progressStates: CreditProgress[] = [
		"STARTED",
		"BROWSER_LAUNCHED",
		"IMAGE_SAVED",
		"SCROLL_GENERATED",
		"ENDCARD_ADDED",
		"UPLOADED",
		"TIDIED",
	];

	const progressPercentage =
		(progressStates.indexOf(asset.progress) + 1) / progressStates.length;

	return (
		<Card>
			<Stack>
				<Group>
					<Title order={3}>
						{asset.state.substring(0, 1)}
						{asset.state.substring(1).toLowerCase()}
					</Title>
					{asset.state === CreditState.READY && (
						<Button
							component={Link}
							href={`${minioConfig.URL}/${asset.path}`}
							ml={"auto"}
							variant="default"
						>
							<FaDownload />
						</Button>
					)}
				</Group>
				<Progress
					animated={asset.state === CreditState.GENERATING}
					color={asset.state === CreditState.READY ? "green" : undefined}
					value={progressPercentage * 100}
				/>
			</Stack>
		</Card>
	);
}
