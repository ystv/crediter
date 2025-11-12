"use client";

import {
  AppShell,
  Badge,
  Burger,
  Group,
  HoverCard,
  NavLink,
  Text,
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useWebsocket } from "./websocket-provider";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppLayout(props: { children: ReactNode }) {
  const pathname = usePathname();

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const queryClient = useQueryClient();

  const session = useSession();

  const { socket, isConnected, transport } = useWebsocket();

  const clipboard = useClipboard();

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group
            h="100%"
            px="md"
          >
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Text>
              {session.status === "authenticated" && session.data.user.name}
            </Text>
            <Group ml={"auto"}>
              <HoverCard>
                <HoverCard.Target>
                  <Badge color={isConnected ? "green" : "red"}>
                    <Text size="xs">
                      {isConnected ? "Connected" : "Not Connected"}
                    </Text>
                  </Badge>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Group>
                    <Text>Socket connected:</Text>
                    <Text ml={"auto"}>{`${isConnected.valueOf()}`}</Text>
                  </Group>
                  <Group>
                    <Text>Transport:</Text>
                    <Text ml={"auto"}>{transport}</Text>
                  </Group>
                  <Group>
                    <Text>Socket ID:</Text>
                    <Text
                      onClick={() => {
                        clipboard.copy(socket.id);
                        notifications.show({
                          message: "Copied!",
                          autoClose: 2000,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                      c={clipboard.copied ? "green" : ""}
                      ml={"auto"}
                    >
                      {socket.id}
                    </Text>
                  </Group>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavLink
            component={Link}
            href={"/"}
            label={"Home"}
            active={pathname === "/"}
          />
        </AppShell.Navbar>
        <AppShell.Main>{props.children}</AppShell.Main>
      </AppShell>
    </QueryClientProvider>
  );
}
