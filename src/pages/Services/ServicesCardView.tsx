import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartColumnDecreasing, FileClock, FileUser, Scroll, Settings, ShoppingBasket, ShoppingCart, Users } from "lucide-react";
import { title } from "process";
import { Link } from "react-router-dom";

export function ServicesCardView() {
  const items = [
    {
      title: "Productos",
      description: "Gestiona tus productos",
      icon: ShoppingBasket,
      url: "/products",
    },
    {
      title: "Órdenes de Reposición",
      description: "Gestiona tus órdenes de reposición",
      icon: FileClock,
      url: "/restocks",
    },
    {
      title: "Clientes",
      description: "Gestiona tus clientes",
      icon: Users,
      url: "/clients",
    },
    {
      title: "Proveedores",
      description: "Gestiona tus proveedores",
      icon: ShoppingCart,
      url: "/suppliers",
    },
    {
      title: "Facturas de Reposiciones",
      description: "Gestiona tus facturas de reposiciones",
      icon: Scroll,
      url: "/purchases-invoice",
    },
    {
      title: "Facturas de Clientes",
      description: "Gestiona tus facturas de clientes",
      icon: FileUser,
      url: "/purchases-invoice-clients",
    },
    {
      title: "Ventas",
      description: "Gestiona tus ventas",
      icon: FileUser,
      url: "/sales",
    },
    {
      title: "Informes",
      description: "Gestiona tus informes",
      icon: ChartColumnDecreasing,
      url: "/reports",
    },
    {
      title: "Configuraciones",
      description: "Gestiona tus configuraciones",
      icon: Settings,
      url: "/configurations",
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Card
            key={index}
            className="max-w-sm w-full mx-auto text-center hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            <CardHeader>
              <CardTitle>
                <Link
                  to={item.url}
                  className="flex justify-center items-center gap-2 text-secondary hover:text-secondary transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
  
}
