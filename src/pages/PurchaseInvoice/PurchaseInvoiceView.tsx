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
import { ChevronRight, Eye, Printer } from "lucide-react"
import { getPurchaseInvoices } from "@/api/purchases-invoice"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "../Spinner/Spinner"
import { toast } from "sonner"
import { PurchaseInvoice } from "@/types/purchaseInvoice"
import { PurchaseInvoiceDetailsModal } from "./PurchaseInvoiceDetails";
import { generateInvoicePDF } from "@/util/pdfGenerator";
import { useNavigate } from "react-router-dom";

export function PurchaseInvoiceView() {
    const [invoices, setInvoices] = useState<PurchaseInvoice[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null)
    const [showDetails, setShowDetails] = useState(false)
    const navigate = useNavigate()
    const goBack = () => navigate("/home");

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getPurchaseInvoices()
                setInvoices(data)
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || "Error al cargar las facturas de compra")
                    goBack()
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
    }, [])


    return loading ? (<Spinner />) : (
        <>
            <div className="bg-tertiary p-4 rounded-lg">
                <div className="flex justify-start items-center text-secondary mb-6">
                    <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
                        Facturas
                    </span>
                    <ChevronRight className="w-6 h-6 self-center text-secondary" />
                    <span className="text-xl">Gestiona tus Facturas</span>
                </div>
                <Table className="bg-tertiary border border-baseBorder rounded-lg">
                    <TableCaption>Lista de facturas generadas por reposición.</TableCaption>
                    <TableHeader>
                        <TableRow className="text-secondary font-bold text-base">
                            <TableHead>Proveedor</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead></TableHead>
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
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Eye className="cursor-pointer" onClick={() => {
                                                    setSelectedInvoice(inv)
                                                    setShowDetails(true)
                                                }} />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-secondary text-tertiary">
                                                <p>Ver más...</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Printer className="cursor-pointer"
                                                    onClick={() => generateInvoicePDF(inv)}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-secondary text-tertiary">
                                                <p>Exportar a PDF</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {selectedInvoice && showDetails && (
                <PurchaseInvoiceDetailsModal
                    open={showDetails}
                    onOpenChange={setShowDetails}
                    invoice={selectedInvoice}
                />
            )}
        </>)
}