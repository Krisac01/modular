
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Home, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

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

  return (
    <header className="bg-green-dark text-white py-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <img 
            src="/lovable-uploads/1b34c799-c8d6-481c-a574-7fcafc61c176.png" 
            alt="Modular Agrosolutions" 
            className="h-9 w-9 md:h-12 md:w-12"
          />
          <h1 className="font-semibold text-lg md:text-xl">
            Control de Plagas - Invernadero
          </h1>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <nav>
            <ul className="flex space-x-6 text-sm md:text-base">
              <li>
                <Link
                  to="/menu"
                  className={cn(
                    "py-2 px-1 border-b-2 flex items-center gap-1",
                    pathname === "/menu" ? "border-white" : "border-transparent"
                  )}
                >
                  <Home className="h-4 w-4" />
                  {isMobile ? "Menu" : "Menú Principal"}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className={cn(
                    "py-2 px-1 border-b-2",
                    pathname === "/" ? "border-white" : "border-transparent"
                  )}
                >
                  {isMobile ? "Datos" : "Recolección de Datos"}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className={cn(
                    "py-2 px-1 border-b-2",
                    pathname === "/dashboard" ? "border-white" : "border-transparent"
                  )}
                >
                  {isMobile ? "Mapa" : "Dashboard"}
                </Link>
              </li>
            </ul>
          </nav>
          
          {user && (
            <div className="flex items-center gap-2 border-l pl-4 ml-2">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="text-sm hidden md:inline">{user.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-green-600 text-white" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline ml-1">Cerrar sesión</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
