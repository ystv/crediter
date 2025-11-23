import { Title } from "@mantine/core";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function Home() {
	return <Title>YSTV Crediter</Title>;
}
