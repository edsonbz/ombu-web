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
import { updateRestock } from "@/api/restock"
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

export function EditRestock({
  open,
  onOpenChange,
  data,
  onSubmit,
  onDelete,
}: EditRestockViewProps) {
  const [quantity, setQuantity] = useState(data.quantity)
  const [status, setStatus] = useState(data.status)

  useEffect(() => {
    setQuantity(data.quantity)
    setStatus(data.status)
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updated = await updateRestock(data.id, { ...data, quantity, status })
      onSubmit(updated)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al actualizar solicitud:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Editar Solicitud</DialogTitle>
             <Description/>
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
            <div className="grid grid-cols-2 gap-4">
                {/* Cantidad editable */}
            <div className="grid grid-cols-1 items-center gap-4">
              <Label className="text-right">Cantidad</Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
               {/* Estado editable */}
            <div className="grid grid-cols-1 items-center gap-4">
              <Label className="text-right">Estado</Label>
              <Select value={status} onValueChange={setStatus}>
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
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button type="submit">CONFIRMAR</Button>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
