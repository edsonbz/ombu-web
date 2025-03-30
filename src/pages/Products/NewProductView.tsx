import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBasket} from "lucide-react";

export function NewProductView() {


  return (
    <Card
      className="max-w-sm w-full mx-auto text-center"
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <ShoppingBasket />
          Registrar Producto
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Descripcion</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Precio</Label>
              <Input id="name" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Stock</Label>
              <Input id="name" placeholder="" />
            </div>
      </CardContent>
    </Card>
  );
}
