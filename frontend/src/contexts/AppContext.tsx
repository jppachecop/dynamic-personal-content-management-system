import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { AppState, User, Note, Category } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useUserOperations } from "@/hooks/useUsersAPI";
import { useCategoryOperations } from "@/hooks/useCategoriesAPI";
import { useNoteOperations } from "@/hooks/useNotesAPI";

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "SET_SELECTED_NOTE"; payload: Note | null }
  | { type: "SET_NOTES"; payload: Note[] }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "UPDATE_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string | null }
  | { type: "TOGGLE_SIDEBAR" };

const initialState: AppState = {
  currentUser: null,
  selectedNote: null,
  notes: [],
  categories: [],
  searchQuery: "",
  selectedCategory: null,
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
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
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
  dispatch: React.Dispatch<AppAction>;
  logoutUser: () => void;
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

  const userOps = useUserOperations();
  const categoryOps = useCategoryOperations(state.currentUser?.id || "");
  const noteOps = useNoteOperations(state.currentUser?.id || "");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        if (userOps.isLoading || categoryOps.isLoading || noteOps.isLoading) {
          return;
        }

        // Update state with current data - categories
        dispatch({ type: "SET_CATEGORIES", payload: categoryOps.categories });

        // Handle current user session from localStorage
        const storedUserId = localStorage.getItem("currentUserId");
        if (storedUserId && !state.currentUser) {
          const user = userOps.getUserById(storedUserId);
          if (user) {
            dispatch({ type: "SET_CURRENT_USER", payload: user });
            console.log(
              "✅ Restored user session from localStorage:",
              user.name
            );
          } else {
            // User not found, clear session
            localStorage.removeItem("currentUserId");
            console.log("❌ User not found in API, cleared session");
          }
        }

        // Load notes for the current user
        if (state.currentUser) {
          dispatch({ type: "SET_NOTES", payload: noteOps.notes });
          console.log("✅ Loaded user notes from API:", noteOps.notes.length);
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
  }, [
    categoryOps.isLoading,
    noteOps.isLoading,
    noteOps.notes,
    state.currentUser,
    userOps.isLoading,
    userOps.users,
  ]);

  const logoutUser = () => {
    dispatch({ type: "SET_CURRENT_USER", payload: null });
    dispatch({ type: "SET_NOTES", payload: [] });
    dispatch({ type: "SET_SELECTED_NOTE", payload: null });
    localStorage.removeItem("currentUserId");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const createNote = async (title: string, content: string | null = null) => {
    if (!state.currentUser) return;

    try {
      const noteData = {
        title,
        content,
        tags: [],
        categoryId: state.categories[0]?.id || "",
        userId: state.currentUser.id,
        isFavorite: false,
      };

      const note = await noteOps.createNote(noteData);
      dispatch({ type: "ADD_NOTE", payload: note });
      dispatch({ type: "SET_SELECTED_NOTE", payload: note });

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

  const contextValue: AppContextType = {
    state,
    dispatch,
    logoutUser,
    createNote,
    selectNote,
    setSearchQuery,
    setSelectedCategory,
    toggleSidebar,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
