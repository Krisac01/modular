import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, LayoutGrid, Package, Wrench, BookOpen, Lightbulb, Bug, User, Settings } from "lucide-react";

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
      icon: <Settings className="h-8 w-8" />,
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
      title: "Alertas y Recomendaciones AI",
      icon: <Lightbulb className="h-8 w-8" />,
      path: "/ai-alerts",
      description: "Análisis inteligente de datos con AI"
    }
  ];

  return (
    <Layout hideHeader>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/1b34c799-c8d6-481c-a574-7fcafc61c176.png" 
            alt="Modular Agrosolutions" 
            className="h-16 w-16 mb-4"
          />
          <h1 className="text-3xl font-bold text-green-dark text-center">
            Menú Principal
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path} className="block">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-gray-100">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="rounded-full p-3 mb-4 bg-green-50 text-green-dark">
                    {item.icon}
                  </div>
                  <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Bitácora electrónica card with expanded content */}
          <Link to="/logbook" className="block col-span-1 md:col-span-2 lg:col-span-3">
            <Card className="h-full bg-green-50 transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-green-100">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-3 mb-4 text-green-dark">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h2 className="font-semibold text-lg mb-2">
                  Bitácora electrónica/Registro de actividad
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Registro de actividades, incluyendo control de plagas y patógenos
                </p>

                {/* Sub-options container */}
                <div className="w-full max-w-2xl mt-2 grid md:grid-cols-2 gap-4">
                  <Link to="/data" className="block">
                    <Card className="h-full bg-white transition-all duration-200 hover:shadow-md hover:scale-102">
                      <CardContent className="pt-4 pb-4 flex flex-col items-center text-center">
                        <div className="rounded-full bg-green-50 p-2 mb-2 text-green-600">
                          <LayoutGrid className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-md mb-1">
                          Control de Plagas - Invernadero
                        </h3>
                        <p className="text-xs text-gray-600">
                          Registro y seguimiento de incidencia de plagas
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/cacao-pathogens" className="block">
                    <Card className="h-full bg-white transition-all duration-200 hover:shadow-md hover:scale-102">
                      <CardContent className="pt-4 pb-4 flex flex-col items-center text-center">
                        <div className="rounded-full bg-orange-50 p-2 mb-2 text-orange-600">
                          <Bug className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-md mb-1">
                          Control de patógenos - Incidencia de patógenos del cacao
                        </h3>
                        <p className="text-xs text-gray-600">
                          Registro y seguimiento de patógenos del cacao
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Floating Facial Recognition Button */}
      <Link to="/facial-recognition">
        <Button 
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group"
          size="lg"
        >
          <User className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-200" />
          <span className="sr-only">Reconocimiento Facial</span>
        </Button>
      </Link>
    </Layout>
  );
};

export default MainMenu;