import { ReactNode } from "react";
import { Header } from "./Header";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  hideHeader?: boolean;
  title?: string;
}

export function Layout({ children, className, hideHeader = false, title }: LayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // No mostrar el botón flotante en la página de reconocimiento facial o login
  const showFloatingButton = !hideHeader && 
    location.pathname !== "/facial-recognition" && 
    location.pathname !== "/login";
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideHeader && <Header />}
      <main
        className={cn(
          "flex-1 container mx-auto px-4 py-6",
          isMobile ? "max-w-full" : "max-w-7xl",
          className
        )}
      >
        {title && (
          <h1 className="text-2xl md:text-3xl font-bold text-green-dark mb-6">{title}</h1>
        )}
        {children}
      </main>

      {/* Floating Facial Recognition Button */}
      {showFloatingButton && (
        <Link to="/facial-recognition">
          <Button 
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group"
            size="lg"
          >
            <User className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-200" />
            <span className="sr-only">Reconocimiento Facial</span>
          </Button>
        </Link>
      )}
    </div>
  );
}