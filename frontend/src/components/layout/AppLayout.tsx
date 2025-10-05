import React from "react";
import { AuthenticatedLayout } from "./AuthenticatedLayout";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeScreen } from "../ui/WelcomeScreen";
import { AppProvider } from "@/contexts/AppContext";

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  return (
    <AppProvider>
      <AuthenticatedLayout />
    </AppProvider>
  );
};
