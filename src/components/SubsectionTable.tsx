
import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Grid2X2 } from "lucide-react";

export function SubsectionTable() {
  const { data } = useData();
  
  // Generate subsection data from records
  const generateSubsectionData = () => {
    const subsectionData = [];
    
    for (let rowId = 1; rowId <= data.rows.length; rowId++) {
      const row = data.rows.find(r => r.id === rowId);
      if (!row) continue;
      
      // Initialize 10 subsections for each row
      for (let subsection = 1; subsection <= 10; subsection++) {
        // Find records in this subsection (positions (subsection-1)*10+1 to subsection*10)
        const startPosition = (subsection - 1) * 10 + 1;
        const endPosition = subsection * 10;
        
        const subsectionRecords = row.records.filter(
          record => record.position >= startPosition && record.position <= endPosition
        );
        
        // Calculate average level if records exist
        let level = null;
        if (subsectionRecords.length > 0) {
          level = subsectionRecords.reduce((sum, record) => sum + record.level, 0) / subsectionRecords.length;
        }
        
        subsectionData.push({
          rowId,
          subsection,
          level
        });
      }
    }
    
    return subsectionData;
  };
  
  const subsectionData = generateSubsectionData();
  
  // Get background color based on incidence level
  const getLevelColor = (level: number | null) => {
    if (level === null) return "bg-gray-100";
    if (level <= 2) return "bg-incidence-low";
    if (level <= 5) return "bg-incidence-medium";
    if (level <= 8) return "bg-incidence-high";
    return "bg-incidence-critical";
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Grid2X2 className="h-5 w-5" />
            Tabla de Subsecciones por Surco
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Visualización por 10 subsecciones para cada surco (cada subsección representa el 10% del área)
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Surco</TableHead>
                {Array.from({ length: 10 }, (_, i) => (
                  <TableHead key={i} className="text-center">
                    {i + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: data.rows.length }, (_, rowIndex) => {
                const rowId = rowIndex + 1;
                
                return (
                  <TableRow key={rowId}>
                    <TableCell className="font-medium">{rowId}</TableCell>
                    {Array.from({ length: 10 }, (_, subsectionIndex) => {
                      const subsection = subsectionIndex + 1;
                      const subsectionInfo = subsectionData.find(
                        s => s.rowId === rowId && s.subsection === subsection
                      );
                      const level = subsectionInfo?.level;
                      const colorClass = getLevelColor(level);
                      
                      return (
                        <TableCell 
                          key={subsection} 
                          className={cn("text-center", colorClass)}
                        >
                          {level !== null ? level.toFixed(1) : "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
