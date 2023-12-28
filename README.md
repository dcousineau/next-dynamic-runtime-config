# Next.JS Dynamic Runtime Config

Provide hooks and configuration to allow for env vars and other forms of configuration to be exposed to the browser without requiring recompilation.

## Rationale

With the [deprecation of built-in runtime configuration](https://nextjs.org/docs/pages/api-reference/next-config-js/runtime-configuration), Next.js and Vercel have clearly signaled a desire to do per-environment builds for maximum performance optimization.

Teams building and deploying Next.js _not_ into Vercel but instead into custom docker containers still need the ability to control _client side configuration_ via runtime Docker env vars. Examples of runtime configurations include per-environment public keys (e.g. for google analytics, sentry) and dynamic api routing urls.

## Getting Started

To install use your favorite package manager, ideally npm:

```bash
npm i next-dynamic-runtime-config
```

### Setup

It is recommended you create two files in your `src/` or `lib/` directories of your next app.

The first file is where you set up the shared configuration. I recommend naming the file `lib/config-register.ts`:

```typescript
import registerConfig from "next-dynamic-runtime-config/register";

const runtimeConfig = registerConfig({
  foo: process.env.NEXT_PUBLIC_FOO,
  bar: process.env.BAR,
  baz: process.env.NODE_ENV === "production" ? "prod" : "dev",
});

export default runtimeConfig;
```

The second file will be your most commonly access client file that will export your hook. I recommend naming the file `lib/config.ts`:

```typescript
"use client";

import runtimeConfig from "./config-register";
import createProvider from "next-dynamic-runtime-config/provider";

const { RuntimeConfigContext, RuntimeConfigProvider, useRuntimeConfig } = createProvider(runtimeConfig);

export { RuntimeConfigContext, RuntimeConfigProvider, useRuntimeConfig };
export default useRuntimeConfig;
```

Next in your `app/providers.tsx` add the RuntimeConfigProvider:

```typescript
import { RuntimeConfigProvider } from "@/lib/config";

export default function Providers({ children }) {
  return (
    <RuntimeConfigProvider>
      <FooProvider>
        {children}
      </FooProvider>
    </RuntimeConfigProvider>
  )
}
```

Finally, in your root layout you **must** initialize the "init" script in order to provide configuration to the client. As the init component provides a [`beforeInteractive` script](https://nextjs.org/docs/pages/building-your-application/optimizing/scripts#strategy) _and_ it it MUST be placed in the root layout in order to ensure it is available on ALL client pages. Add the following to `app/layout.tsx`:

```typescript
// ...snip...
import RuntimeConfigInit from "next-dynamic-runtime-config/init";
import runtimeConfig from "@/lib/config-register";

// ...snip...

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      {/* snip */}
      <body>
        <Providers>{children}</Providers>
        <RuntimeConfigInit config={runtimeConfig} />
      </body>
    </html>
  );
}
```

Congratulations! You're now able to use the hook to access runtime configuration in your components, for example:

```typescript
"use client";

import { useRuntimeConfig } from '@/src/config'

export default function ClientPage() {
  const config = useRuntimeConfig();
  return (
    <div>
      Config Item foo: {config.foo}
    </div>
  )
}
```

## Support

This project exists to serve my needs in projects I work on. I will do my best to support any issues or PRs, however this project may be abandoned at any time. It is simple enough and licensed appropriately that you should feel free to copy-paste the contents into your apps or fork this project if you are concerned about long-term support.
