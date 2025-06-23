
import { Layout } from "@/components/Layout";
import { CacaoPathogenProvider } from "@/context/CacaoPathogenContext";
import { CacaoSectionSelector } from "@/components/CacaoSectionSelector";
import { CacaoPathogenInput } from "@/components/CacaoPathogenInput";
import { CacaoPhotoCapture } from "@/components/CacaoPhotoCapture";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCacaoPathogen } from "@/context/CacaoPathogenContext";

function CacaoPathogenContent() {
  const { exportToCSV } = useCacaoPathogen();
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-dark">
            Control de Patógenos del Cacao
          </h1>
          <p className="text-gray-600 mt-2">
            Registro y seguimiento de incidencia de patógenos en árboles de cacao
          </p>
        </div>
        <Button 
          onClick={exportToCSV}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Section Selector */}
      <CacaoSectionSelector />

      {/* Main content in responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Pathogen Input */}
        <div className="space-y-6">
          <CacaoPathogenInput />
        </div>

        {/* Right column - Photo Capture */}
        <div className="space-y-6">
          <CacaoPhotoCapture 
            photos={photos}
            onPhotosChange={setPhotos}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Instrucciones de uso:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Seleccione la sección donde se encuentra el árbol de cacao</li>
          <li>2. Ingrese el número del árbol y el tipo de patógeno detectado</li>
          <li>3. Evalúe el nivel de incidencia del patógeno (0=sin síntomas, 10=severamente afectado)</li>
          <li>4. Tome fotografías como evidencia del patógeno</li>
          <li>5. Guarde el registro para su posterior análisis</li>
        </ul>
      </div>
    </div>
  );
}

const CacaoPathogens = () => {
  return (
    <CacaoPathogenProvider>
      <Layout>
        <CacaoPathogenContent />
      </Layout>
    </CacaoPathogenProvider>
  );
};

export default CacaoPathogens;
