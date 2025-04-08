import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {updateSupplier } from "@/api/suppliers"
import { EditSupplierProps, Supplier } from "@/types/suppliers"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Trash } from "lucide-react"
import { toast } from "sonner"

export function EditSupplier({
  open,
  onOpenChange,
  data,
  onSubmit,
  onDelete,
}: EditSupplierProps) {
  const [formData, setFormData] = useState<Supplier>(data)
const [loading, setLoading] = useState(false)
  useEffect(() => {
    setFormData(data)
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updated = await updateSupplier(formData)
      onSubmit(updated)
      onOpenChange(false)
      setLoading(false)
      toast.success("Proveedor actualizado correctamente")
    } catch (error) {
      setLoading(false)
      toast.error("Error al actualizar proveedor")
      console.error("Error al actualizar proveedor:", error)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Editar Proveedor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
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
        onClick={() => onDelete(data.id)}
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
