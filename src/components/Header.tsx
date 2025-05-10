
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Home } from "lucide-react";

export function Header() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  return (
    <header className="bg-green-dark text-white py-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <h1 className="font-semibold text-xl md:text-2xl mb-2 md:mb-0">
          Control de Plagas - Invernadero
        </h1>
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
      </div>
    </header>
  );
}
