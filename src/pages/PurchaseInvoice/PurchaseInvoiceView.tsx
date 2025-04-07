import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Printer } from "lucide-react"
import { getPurchaseInvoices } from "@/api/purchaseInvoice"
import { Button } from "@/components/ui/button"
import { Spinner } from "../Spinner/Spinner"
import { toast } from "sonner"
import { PurchaseInvoice } from "@/types/purchaseInvoice"

export function PurchaseInvoiceView() {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getPurchaseInvoices()
        setInvoices(data)
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Error al cargar las facturas de compra")
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])


  return loading ? (<Spinner/>) :(
    <div className="bg-tertiary p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-secondary">Facturas de Compra</h2>
      <Table className="bg-tertiary border border-baseBorder rounded-lg">
        <TableCaption>Lista de facturas generadas por reposición.</TableCaption>
        <TableHeader>
          <TableRow className="text-secondary font-bold text-base">
            <TableHead>Proveedor</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.provider.name}</TableCell>
              <TableCell>{inv.restock.product.name}</TableCell>
              <TableCell>{`₲ ${inv.total.toLocaleString("es-PY")}`}</TableCell>
              <TableCell>{new Date(inv.date).toLocaleDateString("es-PY")}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Printer className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}