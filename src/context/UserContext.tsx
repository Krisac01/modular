import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, DEMO_USERS } from "@/types/user";
import { toast } from "@/components/ui/sonner";

interface UserContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: keyof User['permissions']) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication
    const user = DEMO_USERS.find(u => u.email === email);
    
    if (!user) {
      return false;
    }

    // Simple password check (in real app, this would be secure)
    const validPassword = (email === "admin@ejemplo.com" && password === "admin123") ||
                         (email === "usuario@ejemplo.com" && password === "user123");

    if (!validPassword) {
      return false;
    }

    // Update last login
    const updatedUser = { ...user, lastLogin: Date.now() };
    setCurrentUser(updatedUser);
    
    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("isAuthenticated", "true");
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user"); // Legacy cleanup
  };

  const hasPermission = (permission: keyof User['permissions']): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions[permission] === true;
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}