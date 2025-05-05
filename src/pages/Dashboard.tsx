
import { Layout } from "@/components/Layout";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import { DataProvider } from "@/context/DataContext";
import { SubsectionTable } from "@/components/SubsectionTable";

const Dashboard = () => {
  return (
    <DataProvider>
      <Layout>
        <div className="space-y-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-dark">Dashboard de Incidencia de Plagas</h1>
          <HeatmapVisualization />
          <SubsectionTable />
        </div>
      </Layout>
    </DataProvider>
  );
};

export default Dashboard;
