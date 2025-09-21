import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { FileText, BarChart3, LineChart, ShoppingBag, User2 } from "lucide-react";
  import { useEffect, useState } from "react";
import { Spinner } from "../Spinner/Spinner";
import { getReportsData } from "@/api/reports";
  
  export function ReportsCards() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
      totalSales: number;
      topProducts: number;
      topClients: number;
      monthlyRevenue: number;
      totalRestocks: number;
    }>({
      totalSales: 0,
      topProducts: 0,
      topClients: 0,
      monthlyRevenue: 0,
      totalRestocks: 0,
    });
  
    useEffect(() => {
      async function fetchReports() {
        try {
          const response = await getReportsData();
          setData(response);
        } catch (error) {
          console.error("Error al cargar informes:", error);
        } finally {
          setLoading(false);
        }
      }
  
      fetchReports();
    }, []);
  
    const reports = [
      {
        title: "Ventas Totales",
        value: `${data.totalSales} ventas`,
        icon: BarChart3,
      },
      {
        title: "Productos Más Vendidos",
        value: `${data.topProducts} productos`,
        icon: ShoppingBag,
      },
      {
        title: "Clientes Frecuentes",
        value: `${data.topClients} clientes`,
        icon: User2,
      },
      {
        title: "Ingresos Mensuales",
        value: `Gs. ${data.monthlyRevenue.toLocaleString()}`,
        icon: LineChart,
      },
      {
        title: "Órdenes de Reposición",
        value: `${data.totalRestocks} órdenes`,
        icon: FileText,
      },
    ];
  
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Spinner />
        </div>
      );
    }
  
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
          {reports.map((item, index) => (
            <Card
              key={index}
              className="max-w-sm w-full mx-auto text-center hover:shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-center items-center gap-2 text-secondary">
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-bold text-primary">
                  {item.value}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }
  