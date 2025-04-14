// src/pages/Sales/SaleDetails.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SaleWithDetails } from "@/types/sales"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: SaleWithDetails | null
}

export function SalesDetails({ open, onOpenChange, data }: Props) {
  if (!data) return null

  const total = data.invoice?.total ?? 0
  const taxes = data.invoice?.taxes ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">
            Detalles de Venta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div>
            <strong>Cliente:</strong> {data.client.name}
          </div>
          <div>
            <strong>Fecha:</strong>{" "}
            {new Date(data.date).toLocaleDateString("es-PY")}
          </div>
          <div>
            <strong>Método de Pago:</strong> {data.paymentMethod}
          </div>

          <div className="mt-4">
            <strong>Productos:</strong>
            <ul className="list-disc ml-6 mt-1 space-y-1">
              {data.products.map((item) => (
                <li key={item.productId}>
                  {item.product.name} - {item.quantity} unidad(es) × Gs.{" "}
                  {item.product.price.toLocaleString()} ={" "}
                  <strong>
                    Gs.{" "}
                    {(item.product.price * item.quantity).toLocaleString()}
                  </strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-300 mt-4 pt-2 text-right space-y-1">
            <div>
              <strong>Total:</strong> Gs. {total.toLocaleString()}
            </div>
            <div>
              <strong>IVA (10%):</strong> Gs. {taxes.toLocaleString()}
            </div>
            <div>
              <strong>Estado:</strong>{" "}
              {data.invoice?.paymentStatus ?? "pendiente"}
            </div>
          </div>
        </div>
        {data.invoice?.paymentStatus === "pendiente" && (
          <DialogFooter className="flex justify-center">
            <Button>
              CONFIRMAR PAGO
            </Button>
          </DialogFooter>)}

      </DialogContent>
    </Dialog>
  )
}
