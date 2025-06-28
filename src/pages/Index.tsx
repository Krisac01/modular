import { Layout } from "@/components/Layout";
import { DataCollection } from "@/components/DataCollection";
import { DataProvider } from "@/context/DataContext";
import { LayoutGrid } from "lucide-react";
import { format } from "date-fns";

const Index = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yyyy");

  return (
    <DataProvider>
      <Layout>
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
                    Registro de Incidencia de Plagas
                  </h1>
                  <p className="text-green-100 text-sm mt-1">
                    Control y seguimiento de plagas en invernadero
                  </p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2 border border-white/30">
                <div className="text-white font-medium text-sm">
                  Fecha: {formattedDate}
                </div>
              </div>
            </div>
          </div>

          <DataCollection />
        </div>
      </Layout>
    </DataProvider>
  );
};

export default Index;