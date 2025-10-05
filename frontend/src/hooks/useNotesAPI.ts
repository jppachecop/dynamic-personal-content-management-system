import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { noteApi } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import { Note } from "../types";

/**
 * API-based Notes Hook
 * Provides note management functionality via backend API
 */

// Get all notes with optional filters
export const useNotes = (params: {
  userId: string;
  category?: string;
  tag?: string;
  favorites?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: params ? queryKeys.notes.filtered(params) : queryKeys.notes.all,
    queryFn: () => noteApi.getAll(params),
    staleTime: 1000 * 60 * 2, // 2 minutes (notes change more frequently)
  });
};

// Get notes by user ID
export const useNotesByUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.notes.byUser(userId),
    queryFn: () => noteApi.getByUserId(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get note by ID
export const useNote = (id: string) => {
  return useQuery({
    queryKey: queryKeys.notes.detail(id),
    queryFn: () => noteApi.getById(id),
    enabled: !!id,
  });
};

// Search notes
export const useSearchNotes = (query: string, userId: string) => {
  return useQuery({
    queryKey: queryKeys.notes.search(query, userId),
    queryFn: () => noteApi.getAll({ search: query, userId }),
    enabled: !!query && query.length > 0,
    staleTime: 1000 * 30, // 30 seconds for search results
  });
};

// Create note mutation
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) =>
      noteApi.create(noteData),
    onSuccess: (newNote) => {
      // Invalidate and refetch notes lists
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.byUser(newNote.userId),
      });

      // Add the new note to the cache
      queryClient.setQueryData(queryKeys.notes.detail(newNote.id), newNote);

      console.log("✅ Note created via API:", newNote.title);
    },
    onError: (error) => {
      console.error("❌ Failed to create note via API:", error);
    },
  });
};

// Update note mutation
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>;
    }) => noteApi.update(id, data),
    onSuccess: (updatedNote, { id }) => {
      // Update the note in the cache
      queryClient.setQueryData(queryKeys.notes.detail(id), updatedNote);

      // Invalidate notes lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.byUser(updatedNote.userId),
      });

      console.log("✅ Note updated via API:", updatedNote.title);
    },
    onError: (error) => {
      console.error("❌ Failed to update note via API:", error);
    },
  });
};

// Delete note mutation
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noteApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove note from cache
      queryClient.removeQueries({
        queryKey: queryKeys.notes.detail(deletedId),
      });

      // Invalidate notes lists
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });

      console.log("✅ Note deleted via API:", deletedId);
    },
    onError: (error) => {
      console.error("❌ Failed to delete note via API:", error);
    },
  });
};

// Convenience hook for note operations
export const useNoteOperations = (userId: string) => {
  const notes = useNotes({ userId });
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  return {
    // Data
    notes: notes.data || [],
    isLoading: notes.isLoading,
    error: notes.error,

    // Operations
    createNote: createNote.mutateAsync,
    updateNote: (
      id: string,
      data: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>
    ) => updateNote.mutateAsync({ id, data }),
    deleteNote: deleteNote.mutateAsync,

    // States
    isCreating: createNote.isPending,
    isUpdating: updateNote.isPending,
    isDeleting: deleteNote.isPending,

    // Utilities
    getNoteById: (id: string) => notes.data?.find((n) => n.id === id),
    getFavoriteNotes: () => notes.data?.filter((n) => n.isFavorite) || [],
  };
};
