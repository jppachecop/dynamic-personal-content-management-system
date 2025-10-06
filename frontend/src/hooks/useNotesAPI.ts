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

// Get notes by user ID
export const useNotesByUser = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.notes.byUser(user?.id || ""),
    queryFn: () => noteApi.getByUserId(user?.id || ""),
    enabled: !!user,
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.byUser(newNote.userId),
      });

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
    onSuccess: (updatedNote) => {
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: noteApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.byUser(user?.id),
      });

      console.log("✅ Note deleted via API:", deletedId);
    },
    onError: (error) => {
      console.error("❌ Failed to delete note via API:", error);
    },
  });
};
