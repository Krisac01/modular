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
import CacaoPathogens from "./pages/CacaoPathogens";
import Supplies from "./pages/Supplies";
import Tools from "./pages/Tools";
import Location from "./pages/Location";
import FacialRecognition from "./pages/FacialRecognition";
import AdminPanel from "./pages/AdminPanel";
import LocationManagement from "./pages/LocationManagement";
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";
import ActivityAssignment from "./pages/ActivityAssignment";
import SupplyDatabase from "./pages/SupplyDatabase";
import ToolDatabase from "./pages/ToolDatabase";
import SystemSettings from "./pages/SystemSettings";
import Reports from "./pages/Reports";
import AIAlerts from "./pages/AIAlerts";
import { UserProvider, useUser } from "@/context/UserContext";

const queryClient = new QueryClient();

// Componente para proteger rutas
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { currentUser, isAdmin } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/menu" replace />;
  }
  
  return <>{children}</>;
};

// Componente para redirección inicial
const InitialRedirect = () => {
  const { currentUser, isAdmin } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirigir según el rol del usuario
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/menu" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />
      
      {/* Redirección inicial basada en rol */}
      <Route path="/" element={<InitialRedirect />} />
      
      {/* Rutas de administrador */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="/admin/locations" element={
        <ProtectedRoute requireAdmin>
          <LocationManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/activities" element={
        <ProtectedRoute requireAdmin>
          <ActivityAssignment />
        </ProtectedRoute>
      } />
      <Route path="/admin/supplies-db" element={
        <ProtectedRoute requireAdmin>
          <SupplyDatabase />
        </ProtectedRoute>
      } />
      <Route path="/admin/tools-db" element={
        <ProtectedRoute requireAdmin>
          <ToolDatabase />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requireAdmin>
          <SystemSettings />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute requireAdmin>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/admin/ai-alerts" element={
        <ProtectedRoute requireAdmin>
          <AIAlerts />
        </ProtectedRoute>
      } />
      
      {/* Rutas de usuario (accesibles por ambos roles) */}
      <Route path="/menu" element={
        <ProtectedRoute>
          <MainMenu />
        </ProtectedRoute>
      } />
      <Route path="/data" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/facial-recognition" element={
        <ProtectedRoute>
          <FacialRecognition />
        </ProtectedRoute>
      } />
      <Route path="/location" element={
        <ProtectedRoute>
          <Location />
        </ProtectedRoute>
      } />
      <Route path="/supplies" element={
        <ProtectedRoute>
          <Supplies />
        </ProtectedRoute>
      } />
      <Route path="/tools" element={
        <ProtectedRoute>
          <Tools />
        </ProtectedRoute>
      } />
      <Route path="/cacao-pathogens" element={
        <ProtectedRoute>
          <CacaoPathogens />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      
      {/* Rutas legacy para compatibilidad */}
      <Route path="/work-area" element={
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
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;