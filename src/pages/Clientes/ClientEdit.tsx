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
import { updateClient, deleteClient } from "@/api/clients"
import { EditClientViewProps, Client } from "@/types/clients"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Trash } from "lucide-react"
import { toast } from "sonner"

export function ClientEdit({
  open,
  onOpenChange,
  data,
  onSubmit,
  onDelete,
}: EditClientViewProps) {
  const [formData, setFormData] = useState<Client>(data)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData(data)
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await updateClient(formData)
      onSubmit(updated)
      onOpenChange(false)
      toast.success("Cliente actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el cliente")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = async () => {
    try {
      await deleteClient(data.id)
      onDelete(data.id)
      onOpenChange(false)
      toast.success("Cliente eliminado correctamente")
    } catch (error) {
      toast.error("Error al eliminar el cliente")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Editar Cliente</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {["name", "address", "phone", "ruc"].map((field) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right capitalize">
                  {field}
                </Label>
                <Input
                  id={field}
                  value={formData[field as keyof Client]}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
            ))}
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? "EN PROCESO..." : "CONFIRMAR"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Trash className="cursor-pointer" onClick={handleDeleteClick} />
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
