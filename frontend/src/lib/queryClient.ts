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
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
  },
});

// Query Keys Factory
export const queryKeys = {
  // Users
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
  },
  // Categories
  categories: {
    all: (withUsage = false, userId?: string) =>
      ["categories", { withUsage, userId }] as const,
    detail: (id: string) => ["categories", id] as const,
    usage: (id: string) => ["categories", id, "usage"] as const,
  },
  // Notes
  notes: {
    all: ["notes"] as const,
    byUser: (userId: string) => ["notes", "user", userId] as const,
    filtered: (filters: Record<string, unknown>) =>
      ["notes", "filtered", filters] as const,
    detail: (id: string) => ["notes", id] as const,
    search: (query: string, userId?: string) =>
      ["notes", "search", query, userId] as const,
  },
  // Health
  health: ["health"] as const,
} as const;
