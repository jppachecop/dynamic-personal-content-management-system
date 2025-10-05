import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>("currentUser", null);
  const navigate = useNavigate();

  // Call this function when you want to authenticate the user
  const login = (userData: User) => {
    setUser(userData);
    navigate("/home");
    toast({
      title: "Login realizado",
      description: `Bem-vindo, ${userData.name}!`,
    });
  };

  // Call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
