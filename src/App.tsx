
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MainMenu from "./pages/MainMenu";
import Login from "./pages/Login";

const queryClient = new QueryClient();

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  
  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar la aplicación
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuth(auth);
    };
    
    checkAuth();
    // También podemos escuchar cambios en el localStorage para actualizar el estado
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Ruta de login accesible públicamente */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas que requieren autenticación */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            } />
            <Route path="/location" element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            } />
            <Route path="/work-area" element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            } />
            <Route path="/supplies" element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            } />
            <Route path="/tools" element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            } />
            <Route path="/logbook" element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            } />
            <Route path="/ai-alerts" element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            } />
            
            {/* Ruta para 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
