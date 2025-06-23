
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCacaoPathogen } from "@/context/CacaoPathogenContext";
import { cn } from "@/lib/utils";

export function CacaoSectionSelector() {
  const { data, selectedSection, selectSection } = useCacaoPathogen();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Sección</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {data.sections.map((section) => (
            <Button
              key={section.id}
              variant={selectedSection?.id === section.id ? "default" : "outline"}
              onClick={() => selectSection(section.id)}
              className={cn(
                "h-16 flex flex-col items-center justify-center",
                selectedSection?.id === section.id && "bg-green-medium hover:bg-green-dark"
              )}
            >
              <span className="text-lg font-bold">Sección {section.name}</span>
              <Badge variant="secondary" className="mt-1">
                {section.records.length} registros
              </Badge>
            </Button>
          ))}
        </div>

        {selectedSection && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-dark">
              <strong>Sección seleccionada:</strong> {selectedSection.name} | 
              <strong> Registros:</strong> {selectedSection.records.length} | 
              <strong> Árboles máximos:</strong> {selectedSection.maxTrees}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
