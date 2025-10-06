import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cache time: 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests 3 times
      retry: 3,
    },
  },
});

// Query Keys Factory
export const queryKeys = {
  // Categories
  categories: {
    all: (withUsage = false, userId?: string) =>
      ["categories", { withUsage, userId }] as const,
  },
  // Notes
  notes: {
    byUser: (userId: string) => ["notes", "user", userId] as const,
  },
} as const;
