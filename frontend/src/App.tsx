import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import { WelcomeScreen } from "./components/ui/WelcomeScreen";
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout";
import { UnauthenticatedLayout } from "./components/layout/UnauthenticatedLayout";
import { AppLayout } from "./components/layout/AppLayout";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<UnauthenticatedLayout />}>
            <Route path="/" element={<WelcomeScreen />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route path="/home" element={<AuthenticatedLayout />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
