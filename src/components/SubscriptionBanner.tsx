import { useSubscription } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export function SubscriptionBanner() {
  const { subscription, isActive } = useSubscription();

  if (isActive) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500 text-white">Suscripción Activa</Badge>
          <span className="text-sm text-gray-600">
            Renovación: {subscription?.current_period_end 
              ? new Date(subscription.current_period_end * 1000).toLocaleDateString() 
              : 'fecha desconocida'}
          </span>
        </div>
        <Link to="/profile">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <CalendarCheck className="h-3 w-3 mr-1" />
            Detalles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">Sin Suscripción</Badge>
        <span className="text-sm text-gray-600">
          Suscríbase para acceder a todas las funcionalidades
        </span>
      </div>
      <Link to="/pricing">
        <Button size="sm" className="text-xs h-8 bg-amber-600 hover:bg-amber-700">
          <CreditCard className="h-3 w-3 mr-1" />
          Suscribirse
        </Button>
      </Link>
    </div>
  );
}