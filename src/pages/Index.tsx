import { Layout } from "@/components/Layout";
import { DataCollection } from "@/components/DataCollection";
import { DataProvider } from "@/context/DataContext";
import { LayoutGrid, User, ChevronDown, UserCircle, Settings, LogOut, Home } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yyyy");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente",
    });
    
    navigate("/login");
  };

  const handleProfile = () => {
    toast({
      title: "Perfil de usuario",
      description: "Funcionalidad en desarrollo",
    });
  };

  const handleSettings = () => {
    toast({
      title: "Configuración",
      description: "Funcionalidad en desarrollo",
    });
  };

  return (
    <DataProvider>
      <Layout>
        <div className="space-y-6">
          {/* Header Banner Normalizado */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-full p-3">
                  <LayoutGrid className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Registro de Incidencia de Plagas
                  </h1>
                  <p className="text-green-100 text-sm mt-1">
                    Control y seguimiento de plagas en invernadero
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 rounded-lg px-4 py-2 border border-white/30">
                  <div className="text-white font-medium text-sm">
                    Fecha: {formattedDate}
                  </div>
                </div>
                
                {/* Botón Inicio */}
                <Link to="/menu">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Inicio</span>
                  </Button>
                </Link>
                
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Mi Cuenta</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-white border border-gray-200 shadow-lg"
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || 'usuario@ejemplo.com'}
                      </p>
                    </div>
                    
                    <DropdownMenuItem 
                      onClick={handleProfile}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <UserCircle className="h-4 w-4" />
                      Ver Perfil
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={handleSettings}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <Settings className="h-4 w-4" />
                      Configuración
                    </DropdownMenuItem>
                    
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

          <DataCollection />
        </div>
      </Layout>
    </DataProvider>
  );
};

export default Index;