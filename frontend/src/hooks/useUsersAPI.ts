import { useMutation } from "@tanstack/react-query";
import { userApi } from "../lib/api";
import { User } from "../types";

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
  return useMutation({
    mutationFn: (userData: Omit<User, "id" | "createdAt" | "updatedAt">) =>
      userApi.create(userData),
    onSuccess: (newUser) => {
      console.log("✅ User created via API:", newUser.name);
    },
    onError: (error) => {
      console.error("❌ Failed to create user via API:", error);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
    }) => userApi.update(id, data),
    onSuccess: (updatedUser) => {
      console.log("✅ User updated via API:", updatedUser.name);
    },
    onError: (error) => {
      console.error("❌ Failed to update user via API:", error);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: (_, deletedId) => {
      console.log("✅ User deleted via API:", deletedId);
    },
    onError: (error) => {
      console.error("❌ Failed to delete user via API:", error);
    },
  });
};
