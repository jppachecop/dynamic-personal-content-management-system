import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { noteApi } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import { Note } from "../types";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { toast } from "./use-toast";

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
export const useNotesByUser = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.notes.byUser(user?.id || ""),
    queryFn: () => noteApi.getByUserId(user?.id || ""),
    enabled: !!user,
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
  const { user } = useAuth();
  const { selectNote, categories } = useApp();

  return useMutation({
    mutationFn: ({ title }: { title: string }) => {
      const defaultCategoryId = categories[0]?.id || "";

      return noteApi.create({
        title,
        content: "",
        tags: [],
        categoryId: defaultCategoryId,
        userId: user?.id || "",
        isFavorite: false,
      });
    },
    onSuccess: (newNote: Note) => {
      // Invalidate and refetch notes lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.filtered({
          userId: newNote.userId,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.byUser(newNote.userId),
      });

      // Add the new note to the cache
      queryClient.setQueryData(queryKeys.notes.detail(newNote.id), newNote);

      console.log("✅ Note created via API:", newNote.title);

      selectNote(newNote);

      toast({
        title: "Nota criada",
        description: "Nova nota criada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("❌ Failed to create note via API:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar nota.",
        variant: "destructive",
      });
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
      // // Update the note in the cache
      // queryClient.setQueryData(queryKeys.notes.detail(id), updatedNote);

      // Invalidate notes lists to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.filtered({
          userId: updatedNote.userId,
        }),
      });
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
export const useNoteOperations = () => {
  const notes = useNotesByUser();
  const createNote = useCreateNote();

  return {
    // Data
    notes: notes.data || [],
    isLoading: notes.isLoading,
    error: notes.error,

    // Operations
    createNote: createNote.mutateAsync,
  };
};
