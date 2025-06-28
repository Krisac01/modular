import { Layout } from "@/components/Layout";
import { LocationProvider } from "@/context/LocationContext";
import { RFIDScanner } from "@/components/RFIDScanner";
import { LocationHistory } from "@/components/LocationHistory";
import { Button } from "@/components/ui/button";
import { Download, MapPin, Radio } from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

function LocationContent() {
  const { exportToCSV, data } = useLocation();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      {/* Header Banner Normalizado */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Actualizar Ubicación
              </h1>
              <p className="text-green-100 text-sm mt-1">
                Registro automático por acercamiento a tags RFID
              </p>
            </div>
          </div>
          <Button 
            onClick={exportToCSV}
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
            disabled={data.records.length === 0}
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Content */}
      {isMobile ? (
        <Tabs defaultValue="scanner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner">Escáner RFID</TabsTrigger>
            <TabsTrigger value="history">
              Historial ({data.records.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scanner">
            <RFIDScanner />
          </TabsContent>
          <TabsContent value="history">
            <LocationHistory />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <RFIDScanner />
          </div>
          <div>
            <LocationHistory />
          </div>
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ubicaciones Disponibles
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Invernadero Principal (Secciones A-E)</p>
            <p>• Campo Abierto (Zona Norte y Sur)</p>
            <p>• Área de Cacao (Secciones A-E)</p>
            <p>• Bodega de Insumos</p>
            <p>• Oficina Técnica</p>
            <p>• Área de Compostaje</p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Ventajas del Sistema RFID
          </h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>• Registro automático sin intervención manual</p>
            <p>• Precisión en la ubicación del personal</p>
            <p>• Trazabilidad completa de movimientos</p>
            <p>• Integración con GPS para coordenadas exactas</p>
            <p>• Historial detallado para análisis</p>
            <p>• Exportación de datos para reportes</p>
          </div>
        </div>
      </div>

      {/* Technical Requirements */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Requisitos Técnicos</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• Dispositivo móvil con capacidad NFC/RFID habilitada</p>
          <p>• Permisos de ubicación activados para GPS</p>
          <p>• Tags RFID programados y ubicados en puntos estratégicos</p>
          <p>• Conexión a internet para sincronización de datos</p>
        </div>
      </div>
    </div>
  );
}

const Location = () => {
  return (
    <LocationProvider>
      <Layout>
        <LocationContent />
      </Layout>
    </LocationProvider>
  );
};

export default Location;