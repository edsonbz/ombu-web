import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getClients } from "@/api/clients"
import { getProducts } from "@/api/products"
import { Client } from "@/types/clients"
import { Product } from "@/types/products"
import { toast } from "sonner"
import { createSale } from "@/api/sales"
import { Trash2 } from "lucide-react"



type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function SalesNew({ open, onOpenChange, onSubmit }: Props) {
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedClient, setSelectedClient] = useState("")
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  useEffect(() => {
    if (open) {
      fetchData()
      setSelectedClient("")
      setItems([{ productId: "", quantity: 1 }])
    }
  }, [open])

  const fetchData = async () => {
    try {
      const [cl, pr] = await Promise.all([getClients(), getProducts()])
      setClients(cl)
      setProducts(pr)
    } catch {
      toast.error("Error al cargar clientes o productos")
    }
  }

  const addItem = () => {
    if (items.length >= 5) return toast.warning("Máximo 5 productos por venta")
    setItems([...items, { productId: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
  }

  const handleChangeProduct = (index: number, value: string) => {
    const isDuplicated = items.some((item, idx) => idx !== index && item.productId === value)
    if (isDuplicated) {
      toast.error("Este producto ya está en la lista")
      return
    }

    const updated = [...items]
    updated[index].productId = value
    setItems(updated)
  }

  const handleChangeQuantity = (index: number, value: number) => {
    const updated = [...items]
    const selectedProduct = products.find(p => p.id === updated[index].productId)

    if (selectedProduct && value > selectedProduct.stock) {
      toast.error(`Solo hay ${selectedProduct.stock} unidades disponibles`)
      return
    }

    updated[index].quantity = value
    setItems(updated)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔁 Validar productos duplicados
    const ids = items.map(i => i.productId);
    const hasDuplicates = new Set(ids).size !== ids.length;
    if (hasDuplicates) {
      toast.error("Hay productos repetidos en la lista.");
      setLoading(false);
      return;
    }

    // ✅ Validar stock disponible
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        toast.error("Producto inválido seleccionado.");
        setLoading(false);
        return;
      }
      if (item.quantity > product.stock) {
        toast.error(`Stock insuficiente para ${product.name} (disponibles: ${product.stock})`);
        setLoading(false);
        return;
      }
    }

    try {
      await createSale({
        clientId: selectedClient,
        paymentMethod,
        products: items.map(item => ({
          id: item.productId,
          quantity: item.quantity,
        })),
      });

      toast.success("Venta registrada y facturada correctamente");
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error al registrar venta:", error);
      toast.error("Error al registrar la venta");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center">Registrar Venta</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col justify-between">
            {/* Cliente */}
            <div className="mb-2 mt-2 flex justify-content-center items-center gap-2">
            <Label>Cliente</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-[60%]">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Método de Pago */}
            <div className="flex gap-2 mb-2 mt-2">
              <Label className="">Método de Pago</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-[60%]">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Productos */}
          <div className="space-y-3 max-h-[300px] overflow-auto">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-8 gap-2 items-center">
                <Label className="col-span-2">Producto</Label>
                <Select
                  value={item.productId}
                  onValueChange={(value) => handleChangeProduct(idx, value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleChangeQuantity(idx, Number(e.target.value))}
                  className="col-span-2"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(idx)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-6 flex flex-col gap-4 items-center">
            <Button type="button" variant="outline" onClick={addItem}>
              + Agregar producto
            </Button>
            <Button type="submit" disabled={loading} className="">
              {loading ? "Procesando..." : "Registrar y Facturar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}