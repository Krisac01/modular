import { ReactNode } from "react";
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
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main
        className={cn(
          "flex-1 container mx-auto px-4 py-6",
          isMobile ? "max-w-full" : "max-w-7xl",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}