import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, Home, LogOut, Settings, User, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { redirectToCheckout } from "@/lib/stripe";
import { STRIPE_PRODUCTS } from "@/stripe-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Pricing = () => {
  const { currentUser, isAdmin, logout } = useUser();
  const { subscription, isActive } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente",
    });
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    toast({
      title: "Configuración",
      description: "Funcionalidad en desarrollo",
    });
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      await redirectToCheckout(STRIPE_PRODUCTS.annualSubscription);
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar su solicitud. Por favor intente de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 md:p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2 md:p-3 flex-shrink-0">
                <User className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                  Planes y Precios
                </h1>
                <p className="text-green-100 text-xs md:text-sm mt-1 leading-tight">
                  Elija el plan que mejor se adapte a sus necesidades
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2">
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
                      {currentUser?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser?.email || 'usuario@ejemplo.com'}
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

        {/* Subscription Status */}
        {currentUser && (
          <Card className={isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Estado de Suscripción</h3>
                  {isActive ? (
                    <div className="flex items-center mt-2">
                      <Badge className="bg-green-500 text-white">Activa</Badge>
                      <span className="ml-2 text-sm text-gray-600">
                        Su suscripción está activa hasta {subscription?.current_period_end 
                          ? new Date(subscription.current_period_end * 1000).toLocaleDateString() 
                          : 'fecha desconocida'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="border-gray-300 text-gray-600">Sin suscripción</Badge>
                      <span className="ml-2 text-sm text-gray-600">
                        No tiene una suscripción activa
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Card */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-start-2">
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="text-center pb-2">
                <Badge className="mx-auto mb-2 bg-green-500">Recomendado</Badge>
                <CardTitle className="text-2xl">Suscripción Anual</CardTitle>
                <CardDescription>Acceso completo a todas las funcionalidades</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$125</span>
                  <span className="text-gray-500 ml-2">/año</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Acceso a todas las bitácoras electrónicas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Gestión de usuarios y permisos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Reportes y análisis avanzados</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Alertas inteligentes y predicciones</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Soporte técnico prioritario</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Actualizaciones gratuitas</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleSubscribe}
                  disabled={isLoading || isActive}
                >
                  {isLoading ? "Procesando..." : isActive ? "Ya Suscrito" : "Suscribirse Ahora"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">¿Qué incluye la suscripción?</h3>
              <p className="text-sm text-gray-600">
                La suscripción anual incluye acceso completo a todas las funcionalidades del sistema, incluyendo bitácoras electrónicas, 
                gestión de usuarios, reportes avanzados, alertas inteligentes y soporte técnico prioritario.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">¿Cómo se renueva mi suscripción?</h3>
              <p className="text-sm text-gray-600">
                Su suscripción se renovará automáticamente al final del período anual. Recibirá una notificación por correo electrónico 
                antes de la renovación.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">¿Puedo cancelar mi suscripción?</h3>
              <p className="text-sm text-gray-600">
                Sí, puede cancelar su suscripción en cualquier momento desde su perfil de usuario. Si cancela, mantendrá el acceso 
                hasta el final del período pagado.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">¿Ofrecen soporte técnico?</h3>
              <p className="text-sm text-gray-600">
                Sí, todos los suscriptores tienen acceso a soporte técnico prioritario por correo electrónico y chat en vivo 
                durante horas laborales.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Pricing;