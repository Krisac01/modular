
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export function IncidenceInput() {
  const { selectedRow, addIncidenceRecord } = useData();
  const [position, setPosition] = useState<number>(1);
  const [level, setLevel] = useState(0);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRow) {
      toast.error("Por favor seleccione un surco primero");
      return;
    }

    addIncidenceRecord({
      rowId: selectedRow.id,
      position,
      level,
      notes,
      subsection: position, // Use position as subsection since they're both 1-10 now
    });

    // Reset form
    setPosition(1);
    setLevel(0);
    setNotes("");
  };

  // Determine the color based on the level
  const getColorClass = (level: number) => {
    if (level <= 2) return "text-incidence-low";
    if (level <= 5) return "text-incidence-medium";
    if (level <= 8) return "text-incidence-high";
    return "text-incidence-critical";
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
        <CardTitle>Registrar Incidencia de Plaga</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedRow ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="position">
                  Posición en el Surco {selectedRow.name} (1-10)
                </Label>
                <span className="font-medium">
                  {position}
                </span>
              </div>
              <Slider
                id="position"
                min={1}
                max={10}
                step={1}
                value={[position]}
                onValueChange={(values) => setPosition(values[0])}
                className="py-4"
              />
              <div className="grid grid-cols-10 text-xs text-gray-500">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="text-center">{i + 1}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="level">Nivel de Incidencia (0-10)</Label>
                <span className={cn("font-medium", getColorClass(level))}>
                  {level} - {getLevelLabel(level)}
                </span>
              </div>
              <Slider
                id="level"
                min={0}
                max={10}
                step={1}
                value={[level]}
                onValueChange={(values) => setLevel(values[0])}
                className="py-4"
              />
              <div className="grid grid-cols-11 text-xs text-gray-500">
                {Array.from({ length: 11 }, (_, i) => (
                  <div key={i} className="text-center">{i}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Observaciones adicionales..."
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
            Seleccione un surco para comenzar a registrar datos
          </div>
        )}
      </CardContent>
    </Card>
  );
}
