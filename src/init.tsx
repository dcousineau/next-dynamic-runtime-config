import type { Config } from "./register";
import React from "react";
import Script from "next/script";

function renderConfig(config: Config, opts: { freeze?: boolean; readable?: boolean } = {}) {
  const renderedConfig = JSON.stringify(config, null, opts.readable ? 2 : undefined);
  if (opts.freeze) {
    return `Object.freeze(${renderedConfig})`;
  }
  return renderedConfig;
}

export interface RuntimeConfigInitProps {
  config: Config;
  freeze?: boolean;
  readable?: boolean;
}

export default async function RuntimeConfigInit({ config, freeze = false, readable = false }: RuntimeConfigInitProps) {
  return (
    <Script id="__runtime-config" strategy="beforeInteractive">
      {`window.__CONFIG__ = ${renderConfig(config, { freeze, readable })};`}
    </Script>
  );
}
