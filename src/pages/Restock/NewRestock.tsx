import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { addRestock } from "@/api/restock"
import { getProducts } from "@/api/products"
import { Product } from "@/types/products"
import { getSuppliers } from "@/api/suppliers"
import { Supplier } from "@/types/suppliers"

export function NewRestock({ open, onOpenChange, onSubmit }: any) {
  const [products, setProducts] = useState<Product[]>([])
  const [providers, setProviders] = useState<Supplier[]>([])
  const [productId, setProductId] = useState("")
  const [providerId, setProviderId] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setProductId("")
      setProviderId("")
      setQuantity(1)
      fetchData()
    }
  }, [open])

  const fetchData = async () => {
    try {
      const [prods, provs] = await Promise.all([getProducts(), getSuppliers()])
      setProducts(prods)
      setProviders(provs)
    } catch (error) {
      toast.error("Error al cargar productos o proveedores")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const nueva = await addRestock({
        productId,
        providerId,
        quantity,
      });
  
      onSubmit(nueva);
      toast.success("Solicitud creada correctamente");
      onOpenChange(false);
    } catch (error: any) {
      // 🧠 Manejo de error duplicado
      if (error?.response?.status === 400 && error?.response?.data?.error?.includes("pendiente")) {
        toast.error("Ya existe una solicitud pendiente para este producto y proveedor.");
      } else {
        toast.error("Error al crear la solicitud.");
      }
  
      console.error("Error al crear solicitud:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Nueva Solicitud</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Producto */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Producto</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Proveedor */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Proveedor</Label>
              <Select value={providerId} onValueChange={setProviderId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Cantidad</Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="col-span-1"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? "EN PROCESO..." : "CONFIRMAR"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
