import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import { Category } from "../types";
import { useAuth } from "../contexts/AuthContext";
/**
 * API-based Categories Hook
 * Provides category management functionality via backend API
 */

// Get all categories
export const useCategories = (withUsage = true) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.categories.all(withUsage, user?.id),
    queryFn: () => categoryApi.getAll(user?.id, withUsage),
    enabled: !!user?.id, // Only run if userId is provided
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (categoryData: Omit<Category, "id">) =>
      categoryApi.create(categoryData),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all(true, user?.id),
      });

      console.log("✅ Category created via API:", newCategory.name);
    },
    onError: (error) => {
      console.error("❌ Failed to create category via API:", error);
    },
  });
};
