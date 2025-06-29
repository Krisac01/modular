import { Layout } from "@/components/Layout";
import { UserProfile as UserProfileComponent } from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, UserCircle, Settings, LogOut, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserProfilePage = () => {
  const { currentUser, isAdmin, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente",
    });
    navigate("/login");
  };

  const handleSettings = () => {
    toast({
      title: "Configuración",
      description: "Funcionalidad en desarrollo",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4">
            {/* Fila Superior - Título e Ícono */}
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
                <User className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                  Perfil de Usuario
                </h1>
                <p className="text-green-100 text-xs md:text-sm mt-1 leading-tight">
                  Gestiona tu información personal y preferencias
                </p>
              </div>
            </div>
            
            {/* Fila Inferior - Controles */}
            <div className="flex items-center justify-end gap-2">
              {/* Botón Inicio */}
              <Link to="/menu">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9"
                >
                  <Home className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xs:inline text-sm">Inicio</span>
                </Button>
              </Link>
              
              {/* User Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9"
                  >
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden xs:inline text-sm">Mi Cuenta</span>
                    <ChevronDown className="h-3 w-3 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white border border-gray-200 shadow-lg"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {currentUser?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser?.email || 'usuario@ejemplo.com'}
                    </p>
                  </div>
                  
                  <DropdownMenuItem 
                    onClick={handleSettings}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="my-1 border-gray-100" />
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Settings className="h-4 w-4" />
                          Panel de Administración
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator className="my-1 border-gray-100" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <UserProfileComponent />
      </div>
    </Layout>
  );
};

export default UserProfilePage;