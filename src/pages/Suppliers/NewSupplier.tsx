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
import { addSupplier } from "@/api/suppliers"
import { NewSupplierViewProps, Supplier } from "@/types/suppliers"
import { toast } from "sonner"


export function NewSupplier({ open, onOpenChange }: NewSupplierViewProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Supplier, "id">>({
    name: "",
    address: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
      })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await addSupplier(formData)
      onOpenChange(false)
      toast.success("Proveedor agregado correctamente")
    } catch (error) {
      setLoading(false)
      toast.error("Error al agregar proveedor")
      console.error("Error al agregar proveedor:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Agregar Proveedor</DialogTitle>
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
          <DialogFooter>
          <Button type="submit" disabled={loading}>{loading ? "EN PROCESO..." : "CONFIRMAR"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
