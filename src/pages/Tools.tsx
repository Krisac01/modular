import { Layout } from "@/components/Layout";
import { ToolProvider } from "@/context/ToolContext";
import { ToolInput } from "@/components/ToolInput";
import { ToolList } from "@/components/ToolList";
import { Button } from "@/components/ui/button";
import { Download, Wrench } from "lucide-react";
import { useTool } from "@/context/ToolContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

function ToolContent() {
  const { exportToCSV, data } = useTool();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      {/* Header Banner Normalizado */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Posesión de Herramientas
              </h1>
              <p className="text-green-100 text-sm mt-1">
                Asignación y control de herramientas agrícolas
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
        <Tabs defaultValue="assign" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assign">Asignar Herramienta</TabsTrigger>
            <TabsTrigger value="list">
              Lista ({data.records.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assign">
            <ToolInput />
          </TabsContent>
          <TabsContent value="list">
            <ToolList />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ToolInput />
          </div>
          <div>
            <ToolList />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones de uso:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Complete la información básica de la herramienta (nombre, categoría, descripción)</li>
          <li>2. Agregue información técnica como marca, modelo y número de serie</li>
          <li>3. Tome una foto de la herramienta para identificación visual</li>
          <li>4. Especifique el técnico asignador y la persona a quien se asigna</li>
          <li>5. Evalúe y registre el estado actual de la herramienta</li>
          <li>6. Detalle las instrucciones de mantenimiento y seguridad</li>
          <li>7. Registre fechas importantes como mantenimientos y garantía</li>
          <li>8. Incluya la ubicación donde se utilizará la herramienta</li>
        </ul>
      </div>
    </div>
  );
}

const Tools = () => {
  return (
    <ToolProvider>
      <Layout>
        <ToolContent />
      </Layout>
    </ToolProvider>
  );
};

export default Tools;