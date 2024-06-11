"use client";

import type { Config } from "./register";
import React, { useMemo } from "react";
import { createContext, useContext } from "react";

const IS_BROWSER = typeof window !== "undefined";

export default function createProvider<T extends Config>(getRuntimeConfig: () => T) {
  const RuntimeConfigContext = createContext({
    config: getRuntimeConfig(),
    server: !IS_BROWSER,
  });

  const RuntimeConfigProvider = ({ children }: { children?: React.ReactNode }) => {
    let _config = getRuntimeConfig();
    if (IS_BROWSER) {
      _config = ((window as unknown as Record<string, unknown>)?.__CONFIG__ ?? {}) as T;
    }

    const providerValue = useMemo(
      () => ({
        config: _config,
        server: !IS_BROWSER,
      }),
      [_config],
    );

    return <RuntimeConfigContext.Provider value={providerValue}>{children}</RuntimeConfigContext.Provider>;
  };

  const useRuntimeConfig = (): { config: T; server: boolean } => {
    const config = useContext(RuntimeConfigContext);

    if (!IS_BROWSER) return { config: getRuntimeConfig(), server: true };

    if (!config) throw new Error("Runtime config is not available, did you mount <RuntimeConfigInit /> in the root layout or your providers file?");

    return config;
  };

  return {
    useRuntimeConfig,
    RuntimeConfigContext,
    RuntimeConfigProvider,
  };
}
