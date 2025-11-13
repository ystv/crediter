import "@/styles/globals.css";
import "@mantine/core/styles.css";

import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { WebsocketProvider } from "./_components/websocket-provider";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { AppLayout } from "./_components/app-shell";
import { SessionProvider } from "next-auth/react";
import { auth, signIn } from "@/server/auth";

export const metadata: Metadata = {
  title: "YSTV Crediter",
  description: "Hopefully making credits easier",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    return signIn();
  }

  return (
    <html
      lang="en"
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <SessionProvider>
          <WebsocketProvider>
            <TRPCReactProvider>
              <MantineProvider defaultColorScheme="auto">
                <AppLayout>{children}</AppLayout>
              </MantineProvider>
            </TRPCReactProvider>
          </WebsocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
