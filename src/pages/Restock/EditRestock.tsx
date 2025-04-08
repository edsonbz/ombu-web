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
import { updateRestock, approveRestock, rejectRestock } from "@/api/restock"
import { EditRestockViewProps } from "@/types/restocks"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Trash } from "lucide-react"
import { Description } from "@radix-ui/react-dialog"
import { useAuth } from "@/context/auth"
import { toast } from "sonner"
import { set } from "zod"

export function EditRestock({
  open,
  onOpenChange,
  data,
  onSubmit,
  onDelete,
}: EditRestockViewProps) {
  const [quantity, setQuantity] = useState(data.quantity)
  const [status, setStatus] = useState(data.status)
  const [originalQuantity, setOriginalQuantity] = useState(data.quantity)
  const [originalStatus, setOriginalStatus] = useState(data.status)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const isEditable = data.status === "pendiente"
  const canDelete = data.status === "rechazado"

  useEffect(() => {
    setQuantity(data.quantity)
    setStatus(data.status)
    setOriginalQuantity(data.quantity)
    setOriginalStatus(data.status)
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    try {
      let updated

      if (status === "aprobado") {
        updated = await approveRestock(data.id, token)
      } else if (status === "rechazado") {
        updated = await rejectRestock(data.id, token)
      } else {
        updated = await updateRestock(data.id, { quantity, status })
      }
      setLoading(false)
      onSubmit(updated)
      onOpenChange(false)
    } catch (error) {
      toast.error("Ocurrió un error. Se restauraron los valores")
      setQuantity(originalQuantity)
      setStatus(originalStatus)
      console.error("Error al actualizar solicitud:", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      setQuantity(originalQuantity)
      setStatus(originalStatus)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Editar Solicitud</DialogTitle>
            <Description />
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Producto (solo lectura) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Producto</Label>
              <Input
                value={data.product.name}
                disabled
                className="col-span-3 bg-muted text-muted-foreground"
              />
            </div>

            {/* Proveedor (solo lectura) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Proveedor</Label>
              <Input
                value={data.provider.name}
                disabled
                className="col-span-3 bg-muted text-muted-foreground"
              />
            </div>

            {/* Fecha de solicitud (solo lectura) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fecha</Label>
              <Input
                value={new Date(data.restockDate).toLocaleDateString("es-PY")}
                disabled
                className="col-span-3 bg-muted text-muted-foreground"
              />
            </div>

            {/* Cantidad (editable solo si pendiente) */}
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right">Cantidad</Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                disabled={!isEditable}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="col-span-1"
              />
            </div>

            {/* Estado (editable solo si pendiente) */}
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right">Estado</Label>
              <Select value={status} onValueChange={setStatus} disabled={!isEditable}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            {isEditable && (
              <Button type="submit" disabled={loading}>
                {loading ? "EN PROCESO..." : "CONFIRMAR"}
              </Button>
            )}
            {canDelete && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash
                      className="cursor-pointer"
                      onClick={() => onDelete?.(data.id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-secondary text-tertiary">
                    <p>Borrar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}