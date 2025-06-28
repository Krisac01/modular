import { Layout } from "@/components/Layout";
import { SupplyProvider } from "@/context/SupplyContext";
import { SupplyInput } from "@/components/SupplyInput";
import { SupplyList } from "@/components/SupplyList";
import { Button } from "@/components/ui/button";
import { Download, Package, User, ChevronDown, UserCircle, Settings, LogOut } from "lucide-react";
import { useSupply } from "@/context/SupplyContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SupplyContent() {
  const { exportToCSV, data } = useSupply();
  const isMobile = useIsMobile();
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
      {/* Header Banner Normalizado */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Posesión de Insumos
              </h1>
              <p className="text-green-100 text-sm mt-1">
                Asignación y control de insumos agrícolas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
              disabled={data.records.length === 0}
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            
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

      {/* Content */}
      {isMobile ? (
        <Tabs defaultValue="assign" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assign">Asignar Insumo</TabsTrigger>
            <TabsTrigger value="list">
              Lista ({data.records.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assign">
            <SupplyInput />
          </TabsContent>
          <TabsContent value="list">
            <SupplyList />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SupplyInput />
          </div>
          <div>
            <SupplyList />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones de uso:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Complete la información básica del insumo (nombre, categoría, descripción)</li>
          <li>2. Agregue información técnica como ingrediente activo y concentración</li>
          <li>3. Tome una foto del producto para identificación visual</li>
          <li>4. Especifique la dosis asignada y el técnico responsable</li>
          <li>5. Detalle las instrucciones de uso y método de aplicación</li>
          <li>6. Incluya notas de seguridad y precauciones necesarias</li>
          <li>7. Registre información adicional como lote, proveedor y fecha de vencimiento</li>
        </ul>
      </div>
    </div>
  );
}

const Supplies = () => {
  return (
    <SupplyProvider>
      <Layout>
        <SupplyContent />
      </Layout>
    </SupplyProvider>
  );
};

export default Supplies;