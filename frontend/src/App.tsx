import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import { WelcomeScreen } from "./components/layout/WelcomeScreen";
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout";
import { UnauthenticatedLayout } from "./components/layout/UnauthenticatedLayout";
import { AppLayout } from "./components/layout/AppLayout";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster />
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
);

export default App;
