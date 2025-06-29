import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckoutCanceled = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md border-gray-200 shadow-lg">
          <CardHeader className="text-center pb-2">
            <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-2xl text-gray-700">Pago Cancelado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              Su proceso de pago ha sido cancelado. No se ha realizado ningún cargo.
            </p>
            
            <p className="text-gray-600">
              Si tuvo algún problema durante el proceso, por favor contacte a nuestro equipo de soporte.
            </p>
            
            <div className="pt-4 flex flex-col gap-3">
              <Button 
                onClick={() => navigate("/pricing")}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Planes y Precios
              </Button>
              
              <Button 
                onClick={() => navigate("/menu")}
                variant="outline" 
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Ir al Menú Principal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CheckoutCanceled;