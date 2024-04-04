// @TODO This is relatively unnecessary HOWEVER we would like to maybe use to set global config?
export type Config<T extends object = object> = T;

export default function registerConfig<T extends object>(config: T): Config<T> {
  const runtimeConfig: Config<T> = {
    ...config,
  };

  return runtimeConfig;
}
