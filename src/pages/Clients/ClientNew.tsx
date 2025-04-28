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
import { addClient } from "@/api/clients"
import { NewClientViewProps, Client } from "@/types/clients"
import { toast } from "sonner"

const fieldLabels: Record<keyof Omit<Client, "id" | "createdAt">, string> = {
  name: "Nombre",
  address: "Dirección",
  email: "Correo electrónico",
  phone: "Teléfono",
  ruc: "RUC",
}

export function ClientNew({ open, onOpenChange, onSubmit }: NewClientViewProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Client, "id" | "createdAt">>({
    name: "",
    address: "",
    email: "",
    phone: "",
    ruc: "",
  })

  useEffect(() => {
    if (open) {
      setFormData({ name: "", address: "", email: "", phone: "", ruc: "" })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const created = await addClient(formData)
      onSubmit(created)
      onOpenChange(false)
      toast.success("Cliente agregado correctamente")
    } catch (error) {
      toast.error("Error al agregar el cliente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Agregar Cliente</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(fieldLabels).map(([field, label]) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right">
                  {label}
                </Label>
                <Input
                  id={field}
                  type={field === "email" ? "email" : "text"}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "EN PROCESO..." : "CONFIRMAR"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
