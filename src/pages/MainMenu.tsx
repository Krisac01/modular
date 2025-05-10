
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, LayoutGrid, Package, Wrench, BookOpen } from "lucide-react";

const MainMenu = () => {
  const menuItems = [
    {
      title: "Actualizar Ubicación",
      icon: <MapPin className="h-8 w-8" />,
      path: "/location",
      description: "Actualizar la ubicación del trabajo en campo"
    },
    {
      title: "Actualizar Área de trabajo",
      icon: <LayoutGrid className="h-8 w-8" />,
      path: "/work-area",
      description: "Administrar el área de trabajo actual"
    },
    {
      title: "Registrar Posesión de Insumo",
      icon: <Package className="h-8 w-8" />,
      path: "/supplies",
      description: "Registro de insumos adquiridos o utilizados"
    },
    {
      title: "Registrar Posesión de Herramienta",
      icon: <Wrench className="h-8 w-8" />,
      path: "/tools",
      description: "Registro de herramientas adquiridas o utilizadas"
    },
    {
      title: "Bitácora electrónica/Registro de actividad",
      icon: <BookOpen className="h-8 w-8" />,
      path: "/logbook",
      description: "Registro de actividades, incluyendo control de plagas"
    }
  ];

  return (
    <Layout hideHeader>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-dark text-center mb-8">
          Menú Principal
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path} className="block">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-gray-100">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-green-50 p-3 mb-4 text-green-dark">
                    {item.icon}
                  </div>
                  <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Special card for Control de Plagas - Invernadero */}
          <Link to="/" className="block">
            <Card className="h-full bg-green-50 transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-green-100">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-3 mb-4 text-green-dark">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h2 className="font-semibold text-lg mb-2">
                  Control de Plagas - Invernadero
                </h2>
                <p className="text-sm text-gray-600">
                  Registro y seguimiento de incidencia de plagas
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default MainMenu;
