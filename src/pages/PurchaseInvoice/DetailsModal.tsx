import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Label } from "@/components/ui/label"
  import { Input } from "@/components/ui/input"
import { PurchaseInvoice } from "@/types/purchaseInvoice"
  
  type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    invoice: PurchaseInvoice | null
  }
  
  export function PurchaseInvoiceDetailsModal({ open, onOpenChange, invoice }: Props) {
    if (!invoice) return null
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-center">Factura de Compra</DialogTitle>
          </DialogHeader>
  
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Proveedor</Label>
              <Input
                value={invoice.provider.name}
                disabled
                className="col-span-3"
              />
            </div>
  
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Producto</Label>
              <Input
                value={invoice.restock.product.name}
                disabled
                className="col-span-3"
              />
            </div>
  
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Cantidad</Label>
              <Input
                value={invoice.restock.quantity}
                disabled
                className="col-span-3"
              />
            </div>
  
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fecha</Label>
              <Input
                value={new Date(invoice.date).toLocaleDateString("es-PY")}
                disabled
                className="col-span-3"
              />
            </div>
  
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total</Label>
              <Input
                value={`₲ ${invoice.total.toLocaleString("es-PY")}`}
                disabled
                className="col-span-3"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  