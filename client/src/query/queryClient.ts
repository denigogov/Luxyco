import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",

      // good defaults for admin dashboards
      staleTime: 60_000, // data fresh for 30s
      gcTime: 10 * 60_000, // cache kept for 10 min
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // don't retry 4xx (validation/auth)
        const status = error?.status ?? error?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      networkMode: "offlineFirst",
      retry: 0,
    },
  },
});
