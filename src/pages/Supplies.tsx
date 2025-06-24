import { Layout } from "@/components/Layout";
import { SupplyProvider } from "@/context/SupplyContext";
import { SupplyInput } from "@/components/SupplyInput";
import { SupplyList } from "@/components/SupplyList";
import { Button } from "@/components/ui/button";
import { Download, Package } from "lucide-react";
import { useSupply } from "@/context/SupplyContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

function SupplyContent() {
  const { exportToCSV, data } = useSupply();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-green-medium" />
          <div>
            <h1 className="text-3xl font-bold text-green-dark">
              Posesión de Insumos
            </h1>
            <p className="text-gray-600 mt-1">
              Asignación y control de insumos agrícolas
            </p>
          </div>
        </div>
        <Button 
          onClick={exportToCSV}
          variant="outline" 
          className="flex items-center gap-2"
          disabled={data.records.length === 0}
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Content */}
      {isMobile ? (
        <Tabs defaultValue="assign" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assign">Asignar Insumo</TabsTrigger>
            <TabsTrigger value="list">
              Lista ({data.records.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assign">
            <SupplyInput />
          </TabsContent>
          <TabsContent value="list">
            <SupplyList />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SupplyInput />
          </div>
          <div>
            <SupplyList />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones de uso:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Complete la información básica del insumo (nombre, categoría, descripción)</li>
          <li>2. Agregue información técnica como ingrediente activo y concentración</li>
          <li>3. Tome una foto del producto para identificación visual</li>
          <li>4. Especifique la dosis asignada y el técnico responsable</li>
          <li>5. Detalle las instrucciones de uso y método de aplicación</li>
          <li>6. Incluya notas de seguridad y precauciones necesarias</li>
          <li>7. Registre información adicional como lote, proveedor y fecha de vencimiento</li>
        </ul>
      </div>
    </div>
  );
}

const Supplies = () => {
  return (
    <SupplyProvider>
      <Layout>
        <SupplyContent />
      </Layout>
    </SupplyProvider>
  );
};

export default Supplies;