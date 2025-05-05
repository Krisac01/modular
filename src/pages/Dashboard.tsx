
import { Layout } from "@/components/Layout";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import { DataProvider } from "@/context/DataContext";

const Dashboard = () => {
  return (
    <DataProvider>
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-green-dark">Dashboard de Incidencia de Plagas</h1>
          <HeatmapVisualization />
        </div>
      </Layout>
    </DataProvider>
  );
};

export default Dashboard;
