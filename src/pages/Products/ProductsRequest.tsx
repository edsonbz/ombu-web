import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getSuppliers } from "@/api/suppliers"
import { addRestock } from "@/api/restock"
import { ProductsRequestProps } from "@/types/products"
import { Supplier } from "@/types/suppliers"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"



export function ProductsRequest({
  open,
  onOpenChange,
  productId,
  productName,
}: ProductsRequestProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [formData, setFormData] = useState({
    providerId: "",
    productId,
    quantity: 0,
  })

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({
        ...prev,
        productId,
        quantity: 0,
        providerId: "",
      }))
      fetchSuppliers()
    }
  }, [open, productId])
  const navigate = useNavigate()
  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error("Error al cargar proveedores", error)
      toast.error("Error al cargar proveedores")
      navigate("/home")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === "quantity" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addRestock(formData)
      onOpenChange(false)
      toast.success("Solicitud de reposición enviada correctamente")
    } catch (error) {
      console.error("Error al solicitar reposición:", error)
      toast.error("Error al solicitar reposición")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Reponer Producto</DialogTitle>
            <DialogDescription className="text-center">Seleccioná el proveedor e indicá la cantidad a reponer.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Producto</Label>
              <Input
                value={productName}
                disabled
                className="col-span-3 bg-muted"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="providerId" className="text-right">
                Proveedor
              </Label>
              <select
                id="providerId"
                value={formData.providerId}
                onChange={handleChange}
                className="col-span-3 border border-input rounded-md px-2 py-2"
                required
              >
                <option value="">Selecciona un proveedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                className="col-span-3"
                required
                min={1}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">CONFIRMAR</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
