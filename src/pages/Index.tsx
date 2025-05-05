
import { Layout } from "@/components/Layout";
import { DataCollection } from "@/components/DataCollection";
import { DataProvider } from "@/context/DataContext";
import { format } from "date-fns";

const Index = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yyyy");

  return (
    <DataProvider>
      <Layout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-green-dark">Registro de Incidencia de Plagas</h1>
            <div className="text-green-medium font-medium">
              Fecha: {formattedDate}
            </div>
          </div>
          <DataCollection />
        </div>
      </Layout>
    </DataProvider>
  );
};

export default Index;
