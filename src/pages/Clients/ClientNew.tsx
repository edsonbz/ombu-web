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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const baseFieldLabels = {
  name: "Nombre",
  address: "Dirección",
  email: "Correo electrónico",
  phone: "Teléfono",
} as const

export function ClientNew({ open, onOpenChange, onSubmit }: NewClientViewProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Client, "id" | "createdAt">>({
    name: "",
    address: "",
    email: "",
    phone: "",
    document: "",
    documentType: undefined as unknown as "ci" | "ruc" | undefined,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        address: "",
        email: "",
        phone: "",
        document: "",
        documentType: undefined as unknown as "ci" | "ruc" | undefined,
      })
    }
  }, [open])

  const validateDocument = (doc?: string, type?: "ci" | "ruc") => {
    if (!type) return true
    if (!doc || doc.trim() === "") return false
    if (type === "ci") {
      // CI: solo dígitos, 5 a 12 aprox.
      return /^\d{5,12}$/.test(doc)
    }
    // RUC PY frecuente: dígitos + guion + dígito verificador (ej: 80012345-6). Permitimos también sin guion.
    return /^(\d{6,10}-?\d)$/.test(doc)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!validateDocument((formData as any).document, (formData as any).documentType as any)) {
      toast.error("Documento inválido según el tipo seleccionado")
      setLoading(false)
      return
    }
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
            {/* Campos base */}
            {Object.entries(baseFieldLabels).map(([field, label]) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right">
                  {label}
                </Label>
                <Input
                  id={field}
                  type={field === "email" ? "email" : "text"}
                  value={(formData as any)[field] ?? ""}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
            ))}

            {/* Tipo de documento */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentType" className="text-right">
                Tipo de documento
              </Label>
              <div className="col-span-3">
                <Select
                  value={(formData as any).documentType ?? ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...(prev as any), documentType: v as "ci" | "ruc" }))
                  }
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ci">CI</SelectItem>
                    <SelectItem value="ruc">RUC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Número de documento */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document" className="text-right">
                Número de documento
              </Label>
              <Input
                id="document"
                type="text"
                value={(formData as any).document ?? ""}
                onChange={handleChange}
                className="col-span-3"
                placeholder={(formData as any).documentType === "ruc" ? "80012345-6" : "1234567"}
              />
            </div>
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
