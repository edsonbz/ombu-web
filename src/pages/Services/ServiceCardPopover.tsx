import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { ShoppingBasket, ShoppingCart, Users, Scroll } from "lucide-react";
  import { useState } from "react";
  
  const dataByService: Record<string, any[]> = {
    Productos: [
      { name: "Producto A", stock: 50, price: "$25.00" },
      { name: "Producto B", stock: 30, price: "$40.00" },
    ],
    Proveedores: [
      { name: "Proveedor X", contact: "correo@example.com", phone: "123456" },
      { name: "Proveedor Y", contact: "y@example.com", phone: "789012" },
    ],
    Clientes: [
      { name: "Cliente 1", email: "cliente1@example.com", status: "Activo" },
      { name: "Cliente 2", email: "cliente2@example.com", status: "Inactivo" },
    ],
    Facturas: [
      { invoice: "INV001", status: "Pagado", amount: "$100.00" },
      { invoice: "INV002", status: "Pendiente", amount: "$150.00" },
    ],
  };
  
  const items = [
    {
      title: "Productos",
      description: "Gestiona tus productos",
      icon: ShoppingBasket,
    },
    {
      title: "Proveedores",
      description: "Gestiona tus proveedores",
      icon: ShoppingCart,
    },
    {
      title: "Clientes",
      description: "Gestiona tus clientes",
      icon: Users,
    },
    {
      title: "Facturas",
      description: "Gestiona tus facturas",
      icon: Scroll,
    },
  ];
  
  export function ServicesCardPopoverView() {
    const [openPopover, setOpenPopover] = useState<string | null>(null);
  
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Popover
            key={item.title}
            open={openPopover === item.title}
            onOpenChange={(isOpen) =>
              setOpenPopover(isOpen ? item.title : null)
            }
          >
            <PopoverTrigger asChild>
              <Card className="max-w-sm w-full mx-auto text-center cursor-pointer hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex justify-center items-center gap-2 text-tertiary">
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    {dataByService[item.title]?.length > 0 &&
                      Object.keys(dataByService[item.title][0]).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataByService[item.title]?.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{value as React.ReactNode}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={
                      Object.keys(dataByService[item.title]?.[0] || {}).length
                    }>
                      Total de registros: {dataByService[item.title]?.length || 0}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    );
  }