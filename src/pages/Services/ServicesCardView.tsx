import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import { ChartColumnDecreasing, FileClock, FileUser, Scroll, Settings, ShoppingBasket, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function ServicesCardView() {
  const { user } = useAuth();
  const items = [
    {
      title: "Productos",
      description: "Gestiona tus productos",
      icon: ShoppingBasket,
      url: "/products",
      disabled: false,
    },
    {
      title: "Órdenes de Reposición",
      description: "Gestiona tus órdenes de reposición",
      icon: FileClock,
      url: "/restocks",
      disabled: false,
    },
    {
      title: "Clientes",
      description: "Gestiona tus clientes",
      icon: Users,
      url: "/clients",
      disabled: false,
    },
    {
      title: "Proveedores",
      description: "Gestiona tus proveedores",
      icon: ShoppingCart,
      url: "/suppliers",
      disabled: false,
    },
    // {
    //   title: "Facturas de Reposiciones",
    //   description: "Gestiona tus facturas de reposiciones",
    //   icon: Scroll,
    //   url: "/purchases-invoice",
    // },
    // {
    //   title: "Facturas de Clientes",
    //   description: "Gestiona tus facturas de clientes",
    //   icon: FileUser,
    //   url: "/purchases-invoice-clients",
    // },
    {
      title: "Ventas",
      description: "Gestiona tus ventas",
      icon: FileUser,
      url: "/sales",
      disabled: false,
    },
    // {
    //   title: "Informes",
    //   description: "Visualiza tus informes",
    //   icon: ChartColumnDecreasing,
    //   url: "/reports",
    //   disabled: false,
    // },
    {
      title: "Configuraciones",
      description: "Gestiona tus configuraciones",
      icon: Settings,
      url: "/settings",
      disabled: user?.role !== "admin",
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Card
            key={index}
            className={`max-w-sm w-full mx-auto text-center transition-all duration-300 
       ${!item.disabled ? "hover:shadow-xl hover:scale-105" : "opacity-50 pointer-events-none"}`}
          >
            <CardHeader>
              <CardTitle>
                {!item.disabled ? (
                  <Link
                    to={item.url}
                    className="flex justify-center items-center gap-2 text-secondary hover:text-secondary transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </Link>
                ) : (
                  <div className="flex justify-center items-center gap-2 text-secondary/60">
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </div>
                )}
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
