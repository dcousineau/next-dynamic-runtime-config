/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Config } from "./register";
import React from "react";
import Script from "next/script";

export default async function RuntimeConfigInit({ config }: { config: Config }) {
  const _config: Record<string, any> = { ...config };
  delete _config.server;
  return (
    <Script id="__runtime-config" strategy="beforeInteractive">
      {`window.__CONFIG__ = ${JSON.stringify(_config)};`}
    </Script>
  );
}
