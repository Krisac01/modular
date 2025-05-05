
import { Layout } from "@/components/Layout";
import { DataCollection } from "@/components/DataCollection";
import { DataProvider } from "@/context/DataContext";

const Index = () => {
  return (
    <DataProvider>
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-green-dark">Registro de Incidencia de Plagas</h1>
          <DataCollection />
        </div>
      </Layout>
    </DataProvider>
  );
};

export default Index;
