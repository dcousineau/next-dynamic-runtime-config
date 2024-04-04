// @TODO This is relatively unnecessary HOWEVER we would like to maybe use to set global config?
export type Config<T extends object = object> = T;

const IS_BROWSER = typeof window !== "undefined";

export default function registerConfig<T extends object>(config: T): () => Config<T> {
  const runtimeConfig: Config<T> = {
    ...config,
  };

  const getRuntimeConfig = () => {
    if (IS_BROWSER) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((window as unknown as Record<string, any>)?.__CONFIG__ ?? {}) as Config<T>;
    } else {
      // Serverside should just return the memoized config object
      return runtimeConfig;
    }
  };

  return getRuntimeConfig;
}
