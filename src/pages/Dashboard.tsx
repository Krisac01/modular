import { Layout } from "@/components/Layout";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import { DataProvider } from "@/context/DataContext";
import { SubsectionTable } from "@/components/SubsectionTable";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Download, LayoutGrid, User, ChevronDown, UserCircle, Settings, LogOut, Home } from "lucide-react";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";
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

const DashboardContent = () => {
  const { selectedDate, exportToCSV } = useData();
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
    <div className="space-y-6">
      {/* Header Banner Optimizado para Móvil */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4">
          {/* Fila Superior - Título e Ícono */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
              <LayoutGrid className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                Dashboard de Incidencia de Plagas
              </h1>
              <p className="text-green-100 text-xs md:text-sm mt-1 leading-tight">
                Visualización y análisis de datos de control de plagas
              </p>
            </div>
          </div>
          
          {/* Fila Inferior - Controles */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="order-2 sm:order-1 w-full sm:w-auto">
              <DatePicker />
            </div>
            
            <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-end">
              <Button 
                onClick={exportToCSV} 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5 px-3 py-2 h-9 text-sm"
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 flex-shrink-0" />
                <span className="hidden xs:inline">
                  Exportar {selectedDate ? `(${format(selectedDate, "dd/MM")})` : "todo"}
                </span>
                <span className="xs:hidden">CSV</span>
              </Button>
              
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
                      {user?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
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
      </div>

      <HeatmapVisualization />
      <SubsectionTable />
    </div>
  );
};

const Dashboard = () => {
  return (
    <DataProvider>
      <Layout>
        <DashboardContent />
      </Layout>
    </DataProvider>
  );
};

export default Dashboard;