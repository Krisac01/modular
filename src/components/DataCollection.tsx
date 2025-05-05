
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { RowSelector } from "./RowSelector";
import { IncidenceInput } from "./IncidenceInput";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IncidenceRecord } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

export function DataCollection() {
  const { selectedRow, data, deleteIncidenceRecord } = useData();
  const [activeTab, setActiveTab] = useState<"input" | "records">("input");
  const isMobile = useIsMobile();
  
  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get badge color class based on level
  const getLevelBadgeClass = (level: number) => {
    if (level <= 2) return "bg-incidence-low";
    if (level <= 5) return "bg-incidence-medium";
    if (level <= 8) return "bg-incidence-high";
    return "bg-incidence-critical";
  };

  const handleDeleteRecord = (record: IncidenceRecord) => {
    if (confirm("¿Está seguro de que desea eliminar este registro?")) {
      deleteIncidenceRecord(record.id);
    }
  };

  return (
    <div className="space-y-6">
      <RowSelector />

      {isMobile ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="input">Nuevo Registro</TabsTrigger>
            <TabsTrigger value="records">
              Registros{" "}
              {selectedRow?.records.length ? (
                <Badge variant="outline" className="ml-2">
                  {selectedRow.records.length}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input">
            <IncidenceInput />
          </TabsContent>
          <TabsContent value="records">
            <RecordsTable
              records={selectedRow?.records || []}
              onDelete={handleDeleteRecord}
              formatDate={formatDate}
              getLevelBadgeClass={getLevelBadgeClass}
              isMobile={isMobile}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <IncidenceInput />
          </div>
          <div>
            <RecordsTable
              records={selectedRow?.records || []}
              onDelete={handleDeleteRecord}
              formatDate={formatDate}
              getLevelBadgeClass={getLevelBadgeClass}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

      {/* Summary information */}
      <Alert>
        <AlertTitle>Resumen</AlertTitle>
        <AlertDescription>
          Total de surcos: {data.rows.length} | 
          Total de registros: {data.rows.reduce((acc, row) => acc + row.records.length, 0)} |
          Última actualización: {formatDate(data.lastUpdated)}
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface RecordsTableProps {
  records: IncidenceRecord[];
  onDelete: (record: IncidenceRecord) => void;
  formatDate: (timestamp: number) => string;
  getLevelBadgeClass: (level: number) => string;
  isMobile: boolean;
}

function RecordsTable({
  records,
  onDelete,
  formatDate,
  getLevelBadgeClass,
  isMobile
}: RecordsTableProps) {
  const sortedRecords = [...records].sort((a, b) => a.position - b.position);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros del Surco</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length > 0 ? (
          <ScrollArea className={isMobile ? "h-64" : "h-96"}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pos.</TableHead>
                  <TableHead>Nivel</TableHead>
                  {!isMobile && <TableHead>Fecha</TableHead>}
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.position}</TableCell>
                    <TableCell>
                      <Badge className={cn(getLevelBadgeClass(record.level))}>
                        {record.level}
                      </Badge>
                    </TableCell>
                    {!isMobile && <TableCell>{formatDate(record.timestamp)}</TableCell>}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            ...
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onDelete(record)}
                            className="text-red-600"
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay registros para este surco
          </div>
        )}
      </CardContent>
    </Card>
  );
}
