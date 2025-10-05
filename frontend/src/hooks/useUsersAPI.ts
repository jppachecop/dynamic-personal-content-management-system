import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import { User } from "../types";

/**
 * API-based Users Hook
 * Provides user management functionality via backend API
 */

// Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: userApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
};

// Login
export const useLogin = () => {
  return useMutation({
    mutationFn: (email: string) => userApi.login(email),
    onSuccess: (user) => {
      console.log("✅ User found via API:", user.name);
    },
    onError: (error) => {
      console.error("❌ Failed to find user via API:", error);
    },
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Omit<User, "id" | "createdAt" | "updatedAt">) =>
      userApi.create(userData),
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

      // Add the new user to the cache
      queryClient.setQueryData(queryKeys.users.detail(newUser.id), newUser);

      console.log("✅ User created via API:", newUser.name);
    },
    onError: (error) => {
      console.error("❌ Failed to create user via API:", error);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
    }) => userApi.update(id, data),
    onSuccess: (updatedUser, { id }) => {
      // Update the user in the cache
      queryClient.setQueryData(queryKeys.users.detail(id), updatedUser);

      // Invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

      console.log("✅ User updated via API:", updatedUser.name);
    },
    onError: (error) => {
      console.error("❌ Failed to update user via API:", error);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove user from cache
      queryClient.removeQueries({
        queryKey: queryKeys.users.detail(deletedId),
      });

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

      console.log("✅ User deleted via API:", deletedId);
    },
    onError: (error) => {
      console.error("❌ Failed to delete user via API:", error);
    },
  });
};

// Convenience hook for user operations
export const useUserOperations = () => {
  const users = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  return {
    // Data
    users: users.data || [],
    isLoading: users.isLoading,
    error: users.error,

    // Operations
    updateUser: (
      id: string,
      data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
    ) => updateUser.mutateAsync({ id, data }),
    deleteUser: deleteUser.mutateAsync,

    // Utilities
    getUserById: (id: string) => users.data?.find((u) => u.id === id),
  };
};
