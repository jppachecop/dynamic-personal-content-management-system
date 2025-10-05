import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Note, Category } from "@/types";
import { useCategoryOperations } from "@/hooks/useCategoriesAPI";
import { useNoteOperations } from "@/hooks/useNotesAPI";
import { useCreateNote } from "@/hooks/useNotesAPI";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

interface AppState {
  selectedNote: Note | null;
  searchQuery: string;
  selectedCategory: string | null;
  isLoading: boolean;
  sidebarOpen: boolean;
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SELECTED_NOTE"; payload: Note | null }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string | null }
  | { type: "TOGGLE_SIDEBAR" };

const initialState: AppState = {
  selectedNote: null,
  searchQuery: "",
  selectedCategory: null,
  isLoading: true,
  sidebarOpen: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SELECTED_NOTE":
      return { ...state, selectedNote: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  notes: Note[];
  categories: Category[];
  dispatch: React.Dispatch<AppAction>;
  createNote: (title: string, content?: string | null) => Promise<void>;
  selectNote: (note: Note | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  const categoryOps = useCategoryOperations(user?.id || "");
  const noteOps = useNoteOperations(user?.id || "");
  const createNoteMutation = useCreateNote();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Se não há usuário logado, apenas finaliza o loading
        if (!user) {
          dispatch({ type: "SET_LOADING", payload: false });
          return;
        }

        // Aguarda os hooks carregarem apenas se há usuário
        if (categoryOps.isLoading || noteOps.isLoading) {
          return;
        }

        console.log("✅ App initialized for user:", user.name);
        console.log("✅ Loaded categories:", categoryOps.categories.length);
        console.log("✅ Loaded notes:", noteOps.notes.length);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        toast({
          title: "Erro",
          description: "Falha ao inicializar a aplicação.",
          variant: "destructive",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeApp();
  }, [
    user?.id, // Só recarrega se o usuário mudar
    categoryOps.isLoading,
    noteOps.isLoading,
    categoryOps.categories.length,
    noteOps.notes.length,
  ]);

  const createNote = async (title: string, content: string | null = null) => {
    if (!user) return;

    try {
      // Pega a primeira categoria disponível ou usa um ID padrão
      const defaultCategoryId = categoryOps.categories[0]?.id || "";
      
      const newNote = await createNoteMutation.mutateAsync({
        title,
        content,
        tags: [],
        categoryId: defaultCategoryId,
        userId: user.id,
        isFavorite: false,
      });

      dispatch({ type: "SET_SELECTED_NOTE", payload: newNote });

      toast({
        title: "Nota criada",
        description: "Nova nota criada com sucesso.",
      });
    } catch (error) {
      console.error("Failed to create note:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar nota.",
        variant: "destructive",
      });
    }
  };

  const selectNote = (note: Note | null) => {
    dispatch({ type: "SET_SELECTED_NOTE", payload: note });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  const setSelectedCategory = (category: string | null) => {
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const value: AppContextType = {
    state,
    notes: noteOps.notes,
    categories: categoryOps.categories,
    dispatch,
    createNote,
    selectNote,
    setSearchQuery,
    setSelectedCategory,
    toggleSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
