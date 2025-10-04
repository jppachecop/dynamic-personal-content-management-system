import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import { Tag } from "../types";

/**
 * API-based Tags Hook
 * Provides tag management functionality via backend API
 */

// Get all tags
export const useTags = () => {
  return useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: tagApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get popular tags
export const usePopularTags = (limit = 10) => {
  return useQuery({
    queryKey: queryKeys.tags.popular(limit),
    queryFn: () => tagApi.getPopular(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get tag by ID
export const useTag = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tags.detail(id),
    queryFn: () => tagApi.getById(id),
    enabled: !!id,
  });
};

// Create tag mutation
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tagData: Omit<Tag, "id">) =>
      tagApi.create(tagData),
    onSuccess: (newTag) => {
      // Invalidate and refetch tags lists
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      
      // Add the new tag to the cache
      queryClient.setQueryData(queryKeys.tags.detail(newTag.id), newTag);
      
      console.log("✅ Tag created via API:", newTag.name);
    },
    onError: (error) => {
      console.error("❌ Failed to create tag via API:", error);
    },
  });
};

// Update tag mutation
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: Partial<Omit<Tag, "id">> 
    }) => tagApi.update(id, data),
    onSuccess: (updatedTag, { id }) => {
      // Update the tag in the cache
      queryClient.setQueryData(queryKeys.tags.detail(id), updatedTag);
      
      // Invalidate tags lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      
      console.log("✅ Tag updated via API:", updatedTag.name);
    },
    onError: (error) => {
      console.error("❌ Failed to update tag via API:", error);
    },
  });
};

// Delete tag mutation
export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tagApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove tag from cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.tags.detail(deletedId) 
      });
      
      // Invalidate tags lists
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      
      console.log("✅ Tag deleted via API:", deletedId);
    },
    onError: (error) => {
      console.error("❌ Failed to delete tag via API:", error);
    },
  });
};

// Increment tag usage
export const useIncrementTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tagApi.increment,
    onSuccess: (_, tagId) => {
      // Invalidate tags to refresh usage counts
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.detail(tagId) });
      
      console.log("✅ Tag usage incremented via API:", tagId);
    },
    onError: (error) => {
      console.error("❌ Failed to increment tag usage via API:", error);
    },
  });
};

// Decrement tag usage
export const useDecrementTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tagApi.decrement,
    onSuccess: (_, tagId) => {
      // Invalidate tags to refresh usage counts
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.detail(tagId) });
      
      console.log("✅ Tag usage decremented via API:", tagId);
    },
    onError: (error) => {
      console.error("❌ Failed to decrement tag usage via API:", error);
    },
  });
};

// Update all tag counts
export const useUpdateTagCounts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tagApi.updateCounts,
    onSuccess: () => {
      // Invalidate all tag queries to refresh counts
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      
      console.log("✅ All tag counts updated via API");
    },
    onError: (error) => {
      console.error("❌ Failed to update tag counts via API:", error);
    },
  });
};

// Convenience hook for tag operations
export const useTagOperations = () => {
  const tags = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();
  const incrementTag = useIncrementTag();
  const decrementTag = useDecrementTag();
  const updateTagCounts = useUpdateTagCounts();

  return {
    // Data
    tags: tags.data || [],
    isLoading: tags.isLoading,
    error: tags.error,
    
    // Operations
    createTag: createTag.mutateAsync,
    updateTag: (
      id: string, 
      data: Partial<Omit<Tag, "id">>
    ) => updateTag.mutateAsync({ id, data }),
    deleteTag: deleteTag.mutateAsync,
    incrementTag: incrementTag.mutateAsync,
    decrementTag: decrementTag.mutateAsync,
    updateTagCounts: updateTagCounts.mutateAsync,
    
    // States
    isCreating: createTag.isPending,
    isUpdating: updateTag.isPending,
    isDeleting: deleteTag.isPending,
    isIncrementing: incrementTag.isPending,
    isDecrementing: decrementTag.isPending,
    isUpdatingCounts: updateTagCounts.isPending,
    
    // Utilities
    getTagById: (id: string) => tags.data?.find((t) => t.id === id),
    getTagByName: (name: string) => tags.data?.find((t) => t.name === name),
  };
};
