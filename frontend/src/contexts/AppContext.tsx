import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from "react";
import {
  AppState,
  User,
  Note,
  Tag,
  Category,
  ViewMode,
  SortBy,
  SortOrder,
} from "@/types";
import { toast } from "@/hooks/use-toast";
import { useUserOperations } from "@/hooks/useUsersAPI";
import { useCategoryOperations } from "@/hooks/useCategoriesAPI";
import { useTagOperations } from "@/hooks/useTagsAPI";
import { useNoteOperations } from "@/hooks/useNotesAPI";

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "SET_SELECTED_NOTE"; payload: Note | null }
  | { type: "SET_NOTES"; payload: Note[] }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "UPDATE_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "SET_TAGS"; payload: Tag[] }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string | null }
  | { type: "SET_SELECTED_TAGS"; payload: string[] }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "SET_SORT_BY"; payload: SortBy }
  | { type: "SET_SORT_ORDER"; payload: SortOrder }
  | { type: "TOGGLE_SIDEBAR" };

const initialState: AppState = {
  currentUser: null,
  selectedNote: null,
  notes: [],
  tags: [],
  categories: [],
  searchQuery: "",
  selectedCategory: null,
  selectedTags: [],
  viewMode: "list",
  sortBy: "updated",
  sortOrder: "desc",
  isLoading: true,
  sidebarOpen: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "SET_SELECTED_NOTE":
      return { ...state, selectedNote: action.payload };
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "ADD_NOTE":
      return { ...state, notes: [action.payload, ...state.notes] };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
        selectedNote:
          state.selectedNote?.id === action.payload.id
            ? action.payload
            : state.selectedNote,
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        selectedNote:
          state.selectedNote?.id === action.payload ? null : state.selectedNote,
      };
    case "SET_TAGS":
      return { ...state, tags: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_SELECTED_TAGS":
      return { ...state, selectedTags: action.payload };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "SET_SORT_ORDER":
      return { ...state, sortOrder: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  createUser: (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  loginUser: (email: string) => Promise<void>;
  logoutUser: () => void;
  createNote: (title: string, content?: string) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  selectNote: (note: Note | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    localStorage.getItem("currentUserId")
  );
  
  const userOps = useUserOperations();
  const categoryOps = useCategoryOperations();
  const tagOps = useTagOperations();
  // Only load notes if we have a current user
  const noteOps = useNoteOperations(currentUserId || "");

  useEffect(() => {
    const initializeApp = async () => {
      // Wait for API hooks to be ready (skip noteOps if no user)
      if (
        userOps.isLoading ||
        categoryOps.isLoading ||
        tagOps.isLoading ||
        (currentUserId && noteOps.isLoading)
      ) {
        return;
      }

      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Update state with current data - categories and tags
        dispatch({ type: "SET_CATEGORIES", payload: categoryOps.categories });
        dispatch({ type: "SET_TAGS", payload: tagOps.tags });

        // Handle current user session
        if (currentUserId) {
          const user = userOps.getUserById(currentUserId);
          if (user) {
            dispatch({ type: "SET_CURRENT_USER", payload: user });
            // Load user-specific notes
            dispatch({ type: "SET_NOTES", payload: noteOps.notes });
            console.log("✅ Loaded user from API:", user.name);
            console.log("✅ Loaded user notes from API:", noteOps.notes.length);
          } else {
            // User not found, clear session
            localStorage.removeItem("currentUserId");
            setCurrentUserId(null);
            console.log("❌ User not found in API, cleared session");
          }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUserId,
    userOps.isLoading,
    categoryOps.isLoading,
    tagOps.isLoading,
    noteOps.isLoading,
    categoryOps.categories.length,
    tagOps.tags.length,
    noteOps.notes.length,
  ]);

  const createUser = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      // Use API
      const user = await userOps.createUser(userData);
      dispatch({ type: "SET_CURRENT_USER", payload: user });
      localStorage.setItem("currentUserId", user.id);
      setCurrentUserId(user.id);
      toast({
        title: "Usuário criado",
        description: `Bem-vindo, ${user.name}! (API)`,
      });
    } catch (error) {
      console.error("Failed to create user:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar usuário.",
        variant: "destructive",
      });
    }
  };

  const loginUser = async (email: string) => {
    try {
      // Use API
      const user = userOps.getUserByEmail(email);

      if (user) {
        dispatch({ type: "SET_CURRENT_USER", payload: user });
        localStorage.setItem("currentUserId", user.id);
        setCurrentUserId(user.id);
        // Notes will be loaded automatically via useEffect when currentUserId changes
        toast({
          title: "Login realizado",
          description: `Bem-vindo de volta, ${user.name}! (API)`,
        });
      } else {
        toast({
          title: "Usuário não encontrado",
          description: "Email não cadastrado.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to login:", error);
      toast({
        title: "Erro",
        description: "Falha ao fazer login.",
        variant: "destructive",
      });
    }
  };

  const logoutUser = () => {
    dispatch({ type: "SET_CURRENT_USER", payload: null });
    dispatch({ type: "SET_NOTES", payload: [] });
    dispatch({ type: "SET_SELECTED_NOTE", payload: null });
    localStorage.removeItem("currentUserId");
    setCurrentUserId(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const createNote = async (title: string, content: string | null = null) => {
    if (!currentUserId) return;

    try {
      const noteData = {
        title,
        content,
        tags: [],
        category: state.categories[0]?.name || "Geral",
        userId: currentUserId,
        isFavorite: false,
      };

      // Use API
      const note = await noteOps.createNote(noteData);
      dispatch({ type: "ADD_NOTE", payload: note });
      dispatch({ type: "SET_SELECTED_NOTE", payload: note });

      toast({
        title: "Nota criada",
        description: `"${title}" foi criada com sucesso. (API)`,
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

  const updateNote = async (note: Note) => {
    try {
      // Use API
      const updatedNote = await noteOps.updateNote(note.id, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        category: note.category,
        isFavorite: note.isFavorite,
      });
      dispatch({ type: "UPDATE_NOTE", payload: updatedNote });
    } catch (error) {
      console.error("Failed to update note:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar nota.",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      // Use API
      await noteOps.deleteNote(id);
      dispatch({ type: "DELETE_NOTE", payload: id });
      toast({
        title: "Nota excluída",
        description: "A nota foi removida com sucesso. (API)",
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir nota.",
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

  const setSelectedTags = (tags: string[]) => {
    dispatch({ type: "SET_SELECTED_TAGS", payload: tags });
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    createUser,
    loginUser,
    logoutUser,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setSearchQuery,
    setSelectedCategory,
    setSelectedTags,
    toggleSidebar,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
