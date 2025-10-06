import React from "react";
import { AuthenticatedLayout } from "./AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeScreen } from "./WelcomeScreen";
import { LoadingScreen } from "./LoadingScreen";
import { AppProvider } from "@/contexts/AppContext";
import { useCategories } from "@/hooks/useCategoriesAPI";
import { useNotesByUser } from "@/hooks/useNotesAPI";

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: notes, isLoading: notesLoading } = useNotesByUser();

  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  if (categoriesLoading || notesLoading) {
    return <LoadingScreen />;
  }

  return (
    <AppProvider categories={categories || []} notes={notes || []}>
      <AuthenticatedLayout />
    </AppProvider>
  );
};
