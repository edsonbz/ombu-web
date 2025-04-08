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
import { updateProduct } from "@/api/products"
import { EditProductViewProps, Product } from "@/types/products"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Trash } from "lucide-react"
import { deleteProduct } from "@/api/products"
import { toast } from "sonner"
export function EditProductView({
  open,
  onOpenChange,
  data,
  onSubmit,
  onDelete,
}: EditProductViewProps) {
  const [formData, setFormData] = useState<Product>(data)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setFormData(data)
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === "price" || id === "stock" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await updateProduct(formData)
      onSubmit(updated)
      onOpenChange(false)
      setLoading(false)
      toast.success("Producto actualizado correctamente")
    } catch (error) {
      setLoading(false)
      console.error("Error al actualizar el producto:", error)
      toast.error("Error al actualizar el producto")
    }
  }
  const handleDeleteClick = async () => {

    try {
      await deleteProduct(data.id)
      onDelete(data.id)
      onOpenChange(false)
      toast.success("Producto eliminado correctamente")
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
      alert("No se pudo eliminar el producto.")
      toast.error("Error al eliminar el producto")
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Editar Producto</DialogTitle>
            <DialogDescription></DialogDescription>
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
          <DialogFooter className="flex items-center justify-between">

            <Button type="submit" disabled={loading}>{loading ? "EN PROCESO..." : "CONFIRMAR"}</Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Trash
                    className="cursor-pointer"
                    onClick={handleDeleteClick}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary text-tertiary">
                  <p>Borrar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
