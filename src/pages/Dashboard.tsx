
import { Layout } from "@/components/Layout";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import { DataProvider } from "@/context/DataContext";
import { SubsectionTable } from "@/components/SubsectionTable";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";

const DashboardContent = () => {
  const { selectedDate, exportToCSV } = useData();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-green-dark">Dashboard de Incidencia de Plagas</h1>
        <div className="flex flex-wrap items-center gap-4">
          <DatePicker />
          <Button 
            onClick={exportToCSV} 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar {selectedDate ? `(${format(selectedDate, "dd/MM/yyyy")})` : "todo"}
          </Button>
        </div>
      </div>
      <HeatmapVisualization />
      <SubsectionTable />
    </div>
  );
};

const Dashboard = () => {
  return (
    <DataProvider>
      <Layout>
        <DashboardContent />
      </Layout>
    </DataProvider>
  );
};

export default Dashboard;
