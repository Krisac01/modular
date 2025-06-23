
import { useState } from "react";
import { useCacaoPathogen } from "@/context/CacaoPathogenContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { PATHOGEN_TYPES, PathogenType } from "@/types/cacaoPathogens";

export function CacaoPathogenInput() {
  const { selectedSection, addPathogenRecord } = useCacaoPathogen();
  const [treeNumber, setTreeNumber] = useState<number>(1);
  const [pathogenType, setPathogenType] = useState<PathogenType | "">("");
  const [incidenceLevel, setIncidenceLevel] = useState(0);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSection) {
      toast.error("Por favor seleccione una sección primero");
      return;
    }

    if (!pathogenType) {
      toast.error("Por favor seleccione el tipo de patógeno");
      return;
    }

    if (treeNumber < 1 || treeNumber > selectedSection.maxTrees) {
      toast.error(`El número de árbol debe estar entre 1 y ${selectedSection.maxTrees}`);
      return;
    }

    addPathogenRecord({
      section: selectedSection.name,
      treeNumber,
      pathogenType,
      incidenceLevel,
      notes,
      photos: [], // Photos will be added separately
    });

    // Reset form
    setTreeNumber(1);
    setPathogenType("");
    setIncidenceLevel(0);
    setNotes("");
  };

  // Determine the color based on the level
  const getColorClass = (level: number) => {
    if (level <= 2) return "text-green-600";
    if (level <= 5) return "text-yellow-600";
    if (level <= 8) return "text-orange-600";
    return "text-red-600";
  };

  // Get label for the level
  const getLevelLabel = (level: number) => {
    if (level <= 2) return "Baja";
    if (level <= 5) return "Media";
    if (level <= 8) return "Alta";
    return "Crítica";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Incidencia de Patógeno</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedSection ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="treeNumber">
                  Número del Árbol (1-{selectedSection.maxTrees})
                </Label>
                <Input
                  id="treeNumber"
                  type="number"
                  min={1}
                  max={selectedSection.maxTrees}
                  value={treeNumber}
                  onChange={(e) => setTreeNumber(parseInt(e.target.value) || 1)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pathogenType">Tipo de Patógeno</Label>
                <Select value={pathogenType} onValueChange={setPathogenType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el patógeno" />
                  </SelectTrigger>
                  <SelectContent>
                    {PATHOGEN_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="incidenceLevel">Nivel de Incidencia (0-10)</Label>
                <span className={cn("font-medium", getColorClass(incidenceLevel))}>
                  {incidenceLevel} - {getLevelLabel(incidenceLevel)}
                </span>
              </div>
              <Slider
                id="incidenceLevel"
                min={0}
                max={10}
                step={1}
                value={[incidenceLevel]}
                onValueChange={(values) => setIncidenceLevel(values[0])}
                className="py-4"
              />
              <div className="grid grid-cols-11 text-xs text-gray-500">
                {Array.from({ length: 11 }, (_, i) => (
                  <div key={i} className="text-center">{i}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Descripción del patógeno, síntomas observados, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full bg-green-medium hover:bg-green-dark">
              Guardar Registro
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Seleccione una sección para comenzar a registrar patógenos
          </div>
        )}
      </CardContent>
    </Card>
  );
}
