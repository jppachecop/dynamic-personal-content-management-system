import React, { createContext, useContext, useState, ReactNode } from "react";
import { Category, Note } from "@/types";

interface AppContextType {
  // Apenas estado da UI - dados vêm diretamente dos hooks
  selectedNote: Note | null;
  searchQuery: string;
  selectedCategory: string | null;
  sidebarOpen: boolean;

  // Actions simples
  selectNote: (note: Note | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleSidebar: () => void;

  // Dados vindos dos hooks
  categories: Category[];
  notes: Note[];
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
  categories: Category[];
  notes: Note[];
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  categories,
  notes,
}) => {
  // Apenas estado da UI
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value: AppContextType = {
    selectedNote,
    searchQuery,
    selectedCategory,
    sidebarOpen,
    selectNote: setSelectedNote,
    setSearchQuery,
    setSelectedCategory,
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
    categories,
    notes,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
