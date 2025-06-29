import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSubscription } from "@/context/SubscriptionContext";

const CheckoutSuccess = () => {
  const { refreshSubscription } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh subscription data when the component mounts
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md border-green-200 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-700">¡Pago Exitoso!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              Su pago ha sido procesado correctamente. Gracias por su suscripción a Agrosolutions.
            </p>
            
            <p className="text-gray-600">
              Ya puede disfrutar de todas las funcionalidades premium de nuestra plataforma.
            </p>
            
            <div className="pt-4 flex flex-col gap-3">
              <Button 
                onClick={() => navigate("/menu")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Home className="mr-2 h-4 w-4" />
                Ir al Menú Principal
              </Button>
              
              <Link to="/profile">
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Ver Detalles de Suscripción
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;