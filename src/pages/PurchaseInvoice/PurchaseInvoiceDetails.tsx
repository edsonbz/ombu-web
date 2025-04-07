import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PurchaseInvoiceProps } from "@/types/purchaseInvoice"



export function PurchaseInvoiceDetailsModal({ open, onOpenChange, invoice }: PurchaseInvoiceProps) {
  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalle de Factura</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-4 text-sm">
          <p><strong>Proveedor:</strong> {invoice.provider.name}</p>
          <p><strong>Producto:</strong> {invoice.restock.product.name}</p>
          <p><strong>Cantidad:</strong> {invoice.restock.quantity}</p>
          <p><strong>Precio Unitario:</strong> ₲ {(invoice.total / invoice.restock.quantity).toLocaleString("es-PY")}</p>
          <p><strong>Total:</strong> ₲ {invoice.total.toLocaleString("es-PY")}</p>
          <p><strong>Fecha:</strong> {new Date(invoice.date).toLocaleDateString("es-PY")}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

