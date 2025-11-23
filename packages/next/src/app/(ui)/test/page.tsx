"use client";

import { Button, Loader, Stack, Timeline } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useSocketTriggeredFunction } from "@repo/lib/socket/client";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import z from "zod";

export default function TestPage() {
	// const generateCredits =
	// api.test.generateTestCredits.useMutation().mutateAsync;

	const [activeStep, setActiveStep] = useState(-1);

	useSocketTriggeredFunction("credits:test:step", (data) => {
		const step = z.number().parse(data);

		setActiveStep(step);
	});

	const creditSteps = [
		"Start Generation",
		"Launch Browser",
		"Screenshot Page",
		"Generate Scrolling Video",
		"Add Endcard",
		"Upload",
		"Tidy",
	];

	return (
		<Stack>
			<Button.Group>
				{/* <Button
					onClick={async () => {
						const res = await generateCredits();
						console.log(res.ok);
						notifications.show({
							message: "Generated Credits",
						});
					}}
					variant="default"
				>
					Generate Credits
				</Button> */}
				<Button.GroupSection>{activeStep}</Button.GroupSection>
			</Button.Group>
			<Timeline active={activeStep}>
				{creditSteps.map((step, idx) => {
					return (
						<Timeline.Item
							bullet={
								activeStep + 1 === idx ? (
									<Loader size={20} />
								) : activeStep >= idx ? (
									<FaCheck />
								) : undefined
							}
							color="green"
							key={step}
							lineVariant={activeStep === idx ? "dashed" : "solid"}
							title={step}
						/>
					);
				})}
			</Timeline>
		</Stack>
	);
}
