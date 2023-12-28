"use client";

import type { Config } from "./register";
import React from "react";
import { createContext, useContext } from "react";

export default function createProvider<T extends Config>(runtimeConfig: T) {
  const RuntimeConfigContext = createContext(runtimeConfig);

  const RuntimeConfigProvider = ({ children }: { children?: React.ReactNode }) => {
    let _config = runtimeConfig;
    if (typeof window !== "undefined") {
      _config = {
        ...((window as unknown as Record<string, object>)?.__CONFIG__ ?? {}),
        server: false,
      } as T;
    }
    return <RuntimeConfigContext.Provider value={_config}>{children}</RuntimeConfigContext.Provider>;
  };

  const useRuntimeConfig = (): T => {
    const config = useContext(RuntimeConfigContext);

    if (!config) {
      throw new Error("Runtime config is not available, did you mount <RuntimeConfigInit /> in root layout?");
    }

    return config;
  };

  return {
    useRuntimeConfig,
    RuntimeConfigContext,
    RuntimeConfigProvider,
  };
}
