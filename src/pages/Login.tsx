import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema",
        });

        // Redirect based on role
        if (email === "admin@ejemplo.com") {
          navigate("/admin");
        } else {
          navigate("/menu");
        }
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas. Intente de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error del sistema",
        description: "Ocurrió un error inesperado. Intente de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (userType: 'admin' | 'user') => {
    if (userType === 'admin') {
      setEmail("admin@ejemplo.com");
      setPassword("admin123");
    } else {
      setEmail("usuario@ejemplo.com");
      setPassword("user123");
    }
  };

  return (
    <Layout hideHeader className="bg-gradient-to-r from-green-100 to-green-50">
      <div className="min-h-screen flex items-center justify-center p-4 relative"> {/* Contenedor relativo */}
        {/* Logo en la esquina superior derecha */}
        <img
          src="URL_DE_TU_LOGO" // <-- REEMPLAZA ESTO
          alt="Tu Logo"
          className="absolute top-4 right-4 h-16 w-16" // Clases de posicionamiento y tamaño
        />

        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/1b34c799-c8d6-481c-a574-7fcafc61c176.png"
                alt="Modular Agrosolutions"
                className="h-20 w-20"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-green-dark">
              Acceso al Sistema
            </CardTitle>
            <p className="text-sm text-gray-500">
              Seleccione su tipo de usuario e ingrese sus credenciales
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ... (resto del contenido del formulario sin cambios) ... */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Acceso Rápido (Demo)</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('admin')}
                  className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-red-50 hover:border-red-300"
                  disabled={isLoading}
                >
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="text-xs font-medium">Administrador</span>
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                    Gestión Completa
                  </Badge>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('user')}
                  className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-blue-50 hover:border-blue-300"
                  disabled={isLoading}
                >
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium">Usuario</span>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                    Registro de Datos
                  </Badge>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-gray-500">O ingrese manualmente</span>
              </div>
            </div>

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
          </CardContent>

          <CardFooter className="text-sm text-center text-gray-500 space-y-2">
            {/* ... (resto del pie de página sin cambios) ... */}
            <div className="w-full space-y-1">
              <p className="font-medium">Credenciales Demo:</p>
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-red-600" />
                    Admin:
                  </span>
                  <span className="font-mono">admin@ejemplo.com / admin123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-blue-600" />
                    Usuario:
                  </span>
                  <span className="font-mono">usuario@ejemplo.com / user123</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;