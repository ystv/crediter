"use client";

import { createContext, type ReactNode, useContext } from "react";

export type TMinioConfig = {
  MINIO_ENDPOINT: string;
  MINIO_USE_SSL: string;
  MINIO_BUCKET: string;
  MINIO_ANON_URL_BASE?: string;
  URL: string;
};

export const MinioConfigContext = createContext<TMinioConfig>(
  null as unknown as TMinioConfig,
);

export function useMinioConfig() {
  return useContext(MinioConfigContext);
}

export function MinioConfigProvider({
  config,
  children,
}: {
  config: Omit<TMinioConfig, "URL">;
  children: ReactNode;
}) {
  const URL: TMinioConfig["URL"] =
    config.MINIO_ANON_URL_BASE ??
    `${config.MINIO_USE_SSL ? "https" : "http"}://${config.MINIO_ENDPOINT}/${config.MINIO_BUCKET}`;

  return (
    <MinioConfigContext.Provider value={{ ...config, URL }}>
      {children}
    </MinioConfigContext.Provider>
  );
}
