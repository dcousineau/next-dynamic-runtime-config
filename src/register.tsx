export type Config<T extends object = object> = T & {
  server: boolean;
};

export default function registerConfig<T extends object>(config: T): Config<T> {
  const runtimeConfig: Config<T> = {
    ...config,
    server: typeof window === "undefined",
  };

  return runtimeConfig;
}
