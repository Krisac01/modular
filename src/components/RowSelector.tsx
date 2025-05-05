
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

export function RowSelector() {
  const { data, selectedRow, selectRow } = useData();
  const isMobile = useIsMobile();
  
  // Group rows to display in tabs (for mobile) or in a single view (desktop)
  const rowGroups = isMobile
    ? Array.from({ length: Math.ceil(data.rows.length / 10) }, (_, i) => {
        const startIdx = i * 10;
        return data.rows.slice(startIdx, startIdx + 10);
      })
    : [data.rows];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Seleccionar Surco</h2>
      
      {isMobile ? (
        <Tabs defaultValue="0">
          <TabsList className="grid grid-cols-4 mb-2">
            {rowGroups.map((_, index) => (
              <TabsTrigger key={index} value={index.toString()}>
                {index * 10 + 1}-{Math.min((index + 1) * 10, data.rows.length)}
              </TabsTrigger>
            ))}
          </TabsList>
          {rowGroups.map((group, index) => (
            <TabsContent key={index} value={index.toString()}>
              <div className="grid grid-cols-5 gap-2">
                {group.map((row) => (
                  <Button
                    key={row.id}
                    variant={selectedRow?.id === row.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectRow(row.id)}
                    className={
                      row.records.length > 0
                        ? "border-green-medium border-2"
                        : ""
                    }
                  >
                    {row.id}
                    {row.records.length > 0 && (
                      <span className="text-xs ml-1">({row.records.length})</span>
                    )}
                  </Button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <ScrollArea className="h-72">
          <div className="grid grid-cols-10 gap-2">
            {data.rows.map((row) => (
              <Button
                key={row.id}
                variant={selectedRow?.id === row.id ? "default" : "outline"}
                onClick={() => selectRow(row.id)}
                className={
                  row.records.length > 0
                    ? "border-green-medium border-2"
                    : ""
                }
              >
                {row.id}
                {row.records.length > 0 && (
                  <span className="text-xs ml-1">({row.records.length})</span>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
