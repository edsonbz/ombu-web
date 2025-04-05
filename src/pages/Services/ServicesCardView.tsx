import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Scroll, ShoppingBasket, ShoppingCart, Users } from "lucide-react";
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
        title: "Proveedores",
        description: "Gestiona tus proveedores",
        icon: ShoppingCart,
        url: "/suppliers",
      },
      {
        title: "Clientes",
        description: "Gestiona tus clientes",
        icon: Users,
        url: "/clients",
      },
      {
        title: "Órdenes",
        description: "Gestiona tus órdenes",
        icon: ShoppingCart,
        url: "/ordenes",
      },
      {
        title: "Facturas",
        description: "Gestiona tus facturas",
        icon: Scroll,
        url: "/facturas",
      },
      {
        title: "Órdenes de venta",
        description: "Gestiona tus órdenes de venta",
        icon: ShoppingCart,
        url: "/ordenes-venta",
      }
    ];
  
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                <Link to={item.url}>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  