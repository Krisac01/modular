
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker() {
  const { selectedDate, setSelectedDate } = useData();
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    setSelectedDate(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Todos los datos"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setOpen(false);
          }}
          initialFocus
          className="p-3 pointer-events-auto"
        />
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="w-full"
          >
            Mostrar todos los datos
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
