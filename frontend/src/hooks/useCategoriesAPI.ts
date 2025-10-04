import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import { Category } from "../types";

/**
 * API-based Categories Hook
 * Replaces IndexedDB categories functionality with backend API calls
 */

// Get all categories
export const useCategories = (withUsage?: boolean) => {
  return useQuery({
    queryKey: withUsage ? queryKeys.categories.withUsage : queryKeys.categories.all,
    queryFn: () => categoryApi.getAll(withUsage),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryApi.getById(id),
    enabled: !!id,
  });
};

// Get category usage count
export const useCategoryUsage = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.usage(id),
    queryFn: () => categoryApi.getUsage(id),
    enabled: !!id,
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryData: Omit<Category, "id">) =>
      categoryApi.create(categoryData),
    onSuccess: (newCategory) => {
      // Invalidate and refetch categories lists
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.withUsage });
      
      // Add the new category to the cache
      queryClient.setQueryData(queryKeys.categories.detail(newCategory.id), newCategory);
      
      console.log("✅ Category created via API:", newCategory.name);
    },
    onError: (error) => {
      console.error("❌ Failed to create category via API:", error);
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: Partial<Omit<Category, "id">> 
    }) => categoryApi.update(id, data),
    onSuccess: (updatedCategory, { id }) => {
      // Update the category in the cache
      queryClient.setQueryData(queryKeys.categories.detail(id), updatedCategory);
      
      // Invalidate categories lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.withUsage });
      
      console.log("✅ Category updated via API:", updatedCategory.name);
    },
    onError: (error) => {
      console.error("❌ Failed to update category via API:", error);
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove category from cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.categories.detail(deletedId) 
      });
      queryClient.removeQueries({ 
        queryKey: queryKeys.categories.usage(deletedId) 
      });
      
      // Invalidate categories lists
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.withUsage });
      
      console.log("✅ Category deleted via API:", deletedId);
    },
    onError: (error) => {
      console.error("❌ Failed to delete category via API:", error);
    },
  });
};

// Convenience hook for category operations
export const useCategoryOperations = () => {
  const categories = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  return {
    // Data
    categories: categories.data || [],
    isLoading: categories.isLoading,
    error: categories.error,
    
    // Operations
    createCategory: createCategory.mutateAsync,
    updateCategory: (
      id: string, 
      data: Partial<Omit<Category, "id">>
    ) => updateCategory.mutateAsync({ id, data }),
    deleteCategory: deleteCategory.mutateAsync,
    
    // States
    isCreating: createCategory.isPending,
    isUpdating: updateCategory.isPending,
    isDeleting: deleteCategory.isPending,
    
    // Utilities
    getCategoryById: (id: string) => categories.data?.find((c) => c.id === id),
    getCategoryByName: (name: string) => categories.data?.find((c) => c.name === name),
  };
};
