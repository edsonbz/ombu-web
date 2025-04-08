import { useState, useEffect } from "react"
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
import { RestockRequest } from "@/types/restocks"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  restock: RestockRequest | null
}

export function PurchaseInvoicePreView({ open, onOpenChange, restock }: Props) {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (restock) {
      const calculated = restock.quantity * restock.product.price
      setTotal(calculated)
    }
  }, [restock])

  if (!restock) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center">Generar Factura de Compra</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Proveedor</Label>
            <Input value={restock.provider.name} disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Producto</Label>
            <Input value={restock.product.name} disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Cantidad</Label>
            <Input value={restock.quantity} disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total</Label>
            <Input value={`₲ ${total.toLocaleString("es-PY")}`} disabled className="col-span-3" />
          </div>
        </div>

        <DialogFooter>
          <Button>CONFIRMAR</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
