import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addProduct } from "@/api/products"

type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

type NewProductViewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsRequest({
  open,
  onOpenChange,
}: NewProductViewProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
      })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === "price" || id === "stock" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newProduct: Product = {
      ...formData,
      id: "", // si el backend asigna el ID
    }

    try {
      await addProduct(newProduct)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al agregar el producto:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader >
            <DialogTitle className="text-center">Reponer Producto</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio Unitario
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="col-span-3"
                required
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock disponible
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="col-span-3"
                required
                min={0}
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
