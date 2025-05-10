
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Row } from "@/types";
import { cn } from "@/lib/utils";

interface HeatmapCellProps {
  rowIndex: number;
  position: number;
  level: number | null;
  onCellClick: (rowId: number, position: number) => void;
  isMobile: boolean;
}

function HeatmapCell({ rowIndex, position, level, onCellClick, isMobile }: HeatmapCellProps) {
  const getCellColor = (level: number | null) => {
    if (level === null) return "bg-gray-100";
    if (level <= 2) return "bg-incidence-low";
    if (level <= 5) return "bg-incidence-medium";
    if (level <= 8) return "bg-incidence-high";
    return "bg-incidence-critical";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => onCellClick(rowIndex + 1, position + 1)}
            className={cn(
              getCellColor(level),
              "cursor-pointer",
              isMobile ? "w-6 h-6" : "w-12 h-12",
              "transition-colors hover:opacity-80"
            )}
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Surco {rowIndex + 1}, Subsección {position + 1}:{" "}
            {level !== null ? `Nivel ${level}` : "Sin datos"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function HeatmapVisualization() {
  const { getFilteredDataByDate, selectRow, selectedDate } = useData();
  const filteredData = getFilteredDataByDate();
  const isMobile = useIsMobile();

  // Generate heatmap data - now with exactly 10 positions per row
  const generateHeatmapData = (rows: Row[]) => {
    return rows.map((row) => {
      const rowData = new Array(10).fill(null);
      
      // Group records by subsection (1-10)
      row.records.forEach((record) => {
        if (record.subsection >= 1 && record.subsection <= 10) {
          // Use subsection as the index (0-9 after adjustment)
          rowData[record.subsection - 1] = record.level;
        }
      });
      
      return rowData;
    });
  };

  const heatmapData = generateHeatmapData(filteredData.rows);

  const handleCellClick = (rowId: number, subsection: number) => {
    selectRow(rowId);
  };

  // Calculate summary statistics
  const calculateStats = () => {
    const allLevels = filteredData.rows.flatMap(row => 
      row.records.map(record => record.level)
    );
    
    const totalRecords = allLevels.length;
    
    if (totalRecords === 0) return { avg: 0, max: 0, coverage: 0 };
    
    const avg = allLevels.reduce((sum, level) => sum + level, 0) / totalRecords;
    const max = Math.max(...allLevels);
    const totalPossible = filteredData.rows.length * 10; // Now only 10 positions per row
    const coverage = (totalRecords / totalPossible) * 100;
    
    return { avg, max, coverage };
  };
  
  const stats = calculateStats();

  // Legend elements
  const legendItems = [
    { label: "Bajo (0-2)", color: "bg-incidence-low" },
    { label: "Medio (3-5)", color: "bg-incidence-medium" },
    { label: "Alto (6-8)", color: "bg-incidence-high" },
    { label: "Crítico (9-10)", color: "bg-incidence-critical" },
    { label: "Sin datos", color: "bg-gray-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Nivel Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center">
              {stats.avg.toFixed(1)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Nivel Máximo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center">
              {stats.max}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Cobertura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center">
              {stats.coverage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Mapa de Calor - Incidencia de Plagas
            {selectedDate && ` (${new Date(selectedDate).toLocaleDateString()})`}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${item.color}`}></div>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className={isMobile ? "h-80" : "h-[500px]"}>
            <div className="flex flex-col">
              {/* Row labels */}
              <div className="flex">
                <div className={cn("flex-shrink-0", isMobile ? "w-12" : "w-16")}></div>
                <div className="flex">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={cn("font-semibold text-center", isMobile ? "w-6" : "w-12")}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap rows */}
              {heatmapData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  <div 
                    className={cn(
                      "flex-shrink-0 flex items-center justify-center font-semibold border-r", 
                      isMobile ? "w-12" : "w-16"
                    )}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => selectRow(rowIndex + 1)}
                    >
                      {rowIndex + 1}
                    </Button>
                  </div>
                  <div className="flex">
                    {row.map((level, position) => (
                      <HeatmapCell
                        key={position}
                        rowIndex={rowIndex}
                        position={position}
                        level={level}
                        onCellClick={handleCellClick}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
