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
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3gap-4">
          {reports.map((item, index) => (
            <Card
              key={index}
              className="rounded-xl border border-primary/10 bg-tertiary/90 backdrop-blur shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
            >
              <CardHeader className="pb-2">
                <CardTitle>
                  <div className="flex items-center gap-3 text-secondary">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-base font-semibold">{item.title}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <CardDescription className="text-2xl font-extrabold text-primary tracking-tight">
                  {item.value}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  