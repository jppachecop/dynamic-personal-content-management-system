import React from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const UnauthenticatedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <WelcomeScreen />;
};
