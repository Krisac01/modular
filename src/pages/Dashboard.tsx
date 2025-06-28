import { Layout } from "@/components/Layout";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import { DataProvider } from "@/context/DataContext";
import { SubsectionTable } from "@/components/SubsectionTable";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Download, LayoutGrid } from "lucide-react";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";

const DashboardContent = () => {
  const { selectedDate, exportToCSV } = useData();
  
  return (
    <div className="space-y-6">
      {/* Header Banner Normalizado */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <LayoutGrid className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Dashboard de Incidencia de Plagas
              </h1>
              <p className="text-green-100 text-sm mt-1">
                Visualización y análisis de datos de control de plagas
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <DatePicker />
            <Button 
              onClick={exportToCSV} 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Exportar {selectedDate ? `(${format(selectedDate, "dd/MM/yyyy")})` : "todo"}
            </Button>
          </div>
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