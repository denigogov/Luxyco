import React from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./queryClient";
import { idbPersister } from "./idbPersister";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: idbPersister,
        maxAge: 24 * 60 * 60_000,
        buster: "v1",
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const key0 = (query.queryKey as any[])?.[0];

            console.log(key0);
            return key0 === "customers" && query.state.status === "success";
          },
        },
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
