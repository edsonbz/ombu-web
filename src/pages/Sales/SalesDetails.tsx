import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SaleWithDetails } from "@/types/sales"
import { confirmSalePayment, rejectSale, returnSale } from "@/api/sales"
import { toast } from "sonner"
import { useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: SaleWithDetails | null
  onActionDone: () => void
}

export function SalesDetails({ open, onOpenChange, data, onActionDone }: Props) {
  const [loading, setLoading] = useState(false)

  if (!data) return null

  const total = data.invoice?.total ?? data.products.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )
  const taxes = total * 0.1

  const handleConfirmPayment = async () => {
    if (!data) return
    setLoading(true)
    try {
      await confirmSalePayment(data.id)
      toast.success("Pago confirmado y factura generada")
      onActionDone()
      onOpenChange(false)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectSale = async () => {
    if (!data) return
    setLoading(true)
    try {
      await rejectSale(data.id)
      toast.success("Venta rechazada correctamente")
      onActionDone()
      onOpenChange(false)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleReturnSale = async () => {
    if (!data) return
    setLoading(true)
    try {
      await returnSale(data.id)
      toast.success("Venta devuelta correctamente")
      onActionDone()
      onOpenChange(false)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const paymentStatus = data.invoice?.paymentStatus ?? "pendiente"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Detalles de Venta</DialogTitle>
        </DialogHeader>

        {/* Info del cliente */}
        <div className="space-y-2 border-b pb-3">
          <p><strong>Cliente:</strong> {data.client.name}</p>
          <p><strong>Correo Electrónico:</strong> {data.client.email}</p>
          <p><strong>Fecha:</strong> {new Date(data.date).toLocaleDateString("es-PY")}</p>
          <p><strong>Método de Pago:</strong> {data.paymentMethod}</p>
        </div>

        {/* Productos */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Productos:</h3>
          <ul className="space-y-1 text-sm pl-4 list-disc">
            {data.products.map((item) => (
              <li key={item.productId}>
                {item.product.name} – {item.quantity} unidad(es) × Gs.{" "}
                {item.product.price.toLocaleString()} ={" "}
                <strong>Gs. {(item.product.price * item.quantity).toLocaleString()}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Totales */}
        <div className="mt-6 border-t pt-4 space-y-1 text-right text-sm">
          <div>
            <span className="font-medium">Total:</span>{" "}
            <span className="font-semibold text-base">Gs. {total.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium">IVA (10%):</span> Gs. {taxes.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Estado:</span>{" "}
            <span className={
              paymentStatus === "pendiente"
                ? "text-yellow-600 font-semibold"
                : paymentStatus === "pagado"
                ? "text-green-600 font-semibold"
                : paymentStatus === "rechazado"
                ? "text-red-600 font-semibold"
                : "text-blue-600 font-semibold"
            }>
              {paymentStatus}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        {paymentStatus === "pendiente" && (
          <DialogFooter className="flex justify-center mt-6 gap-4">
            <Button onClick={handleConfirmPayment} disabled={loading}>
              {loading ? "Procesando..." : "Confirmar Pago"}
            </Button>
            <Button variant="destructive" onClick={handleRejectSale} disabled={loading}>
              {loading ? "Procesando..." : "Rechazar Venta"}
            </Button>
          </DialogFooter>
        )}

        {paymentStatus === "pagado" && (
          <DialogFooter className="flex justify-center mt-6">
            <Button variant="outline" onClick={handleReturnSale} disabled={loading}>
              {loading ? "Procesando..." : "Solicitar Devolución"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
