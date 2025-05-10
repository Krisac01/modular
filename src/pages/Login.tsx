
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn, Google } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de login básico
    setTimeout(() => {
      // En una implementación real, esta validación debería hacerse en el servidor
      if (email === "admin@ejemplo.com" && password === "password") {
        // Guardar información de sesión en localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({ email, name: "Usuario Demo" }));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema",
        });
        
        navigate("/menu");
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas. Intente de nuevo.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);

    // Simulación de login con Google
    setTimeout(() => {
      // En una implementación real, aquí iría la autenticación con Google
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ 
        email: "usuario.google@gmail.com", 
        name: "Usuario Google" 
      }));
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema",
      });
      
      navigate("/menu");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Layout hideHeader className="bg-gradient-to-r from-green-100 to-green-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-green-dark">Control de Plagas</CardTitle>
            <p className="text-sm text-gray-500">Ingrese sus credenciales para acceder al sistema</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="correo@ejemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-gray-500">O continuar con</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full bg-white" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardContent>
          <CardFooter className="text-sm text-center text-gray-500">
            <p className="w-full">
              Credenciales demo: admin@ejemplo.com / password
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
