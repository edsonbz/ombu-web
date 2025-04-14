import { useEffect, useState } from "react";
import { Spinner } from "../Spinner/Spinner";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FilePlus, FileText, Eye, Printer, Info, CircleCheck, CircleX } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SalesNew } from "./SalesNew";
import { getSales } from "@/api/sales";
import { Sale, SaleWithDetails } from "@/types/sales";
import { SalesDetails } from "./SalesDetails";

export function SalesView() {
    const [sales, setSales] = useState<SaleWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedSale, setSelectedSale] = useState<SaleWithDetails | null>(null)

    const navigate = useNavigate();

    const fetchSales = async () => {
        setLoading(true);
        try {
            const data = await getSales();
            setSales(data);
        } catch (error) {
            console.error("Error al obtener ventas:", error);
            toast.error("Error al obtener ventas");
            navigate("/home");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleNewSale = () => {
        fetchSales();
        setShowAddModal(false);
    };

    return loading ? (
        <Spinner />
    ) : (
        <div className="bg-tertiary p-4 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary">Ventas Registradas</h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <FilePlus className="cursor-pointer" onClick={() => setShowAddModal(true)} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary text-tertiary">
                            <p>Nueva Venta</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Table className="bg-tertiary border border-baseBorder rounded-lg">
                <TableCaption>Lista de ventas realizadas a clientes.</TableCaption>
                <TableHeader>
                    <TableRow className="text-secondary font-bold text-base">
                        <TableHead>Cliente</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell>{sale.client.name}</TableCell>
                            <TableCell>{new Date(sale.date).toLocaleDateString("es-PY")}</TableCell>
                            <TableCell>Gs. {sale.invoice?.total.toLocaleString()}</TableCell>
                            <TableCell>
                                <div className="flex text-center items-center gap-1">
                                    {sale.invoice?.paymentStatus === "pendiente" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="text-yellow-500" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-secondary text-tertiary">
                                                    <p>Pendiente</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}

                                    {sale.invoice?.paymentStatus === "pagado" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <CircleCheck className="text-green-600" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-secondary text-tertiary">
                                                    <p>Pagado</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-center flex justify-center gap-4">
                                {sale.invoice && (
                                    <>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Eye
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedSale(sale)
                                                            setShowDetailsModal(true)
                                                        }}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-secondary text-tertiary">
                                                    <p>Ver detalles</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        {sale.invoice?.paymentStatus === "pagado" && (

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <a
                                                            href={`/api/invoices/${sale.id}/view`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <FileText className="cursor-pointer" />
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-secondary text-tertiary">
                                                        <p>Ver PDF</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {sale.invoice?.paymentStatus === "pagado" && (

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <a
                                                            href={`/api/invoices/${sale.id}/download`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Printer className="cursor-pointer" />
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-secondary text-tertiary">
                                                        <p>Descargar PDF</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </>
                                )}
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <SalesNew open={showAddModal} onOpenChange={setShowAddModal} onSubmit={handleNewSale} />
            <SalesDetails
                open={showDetailsModal}
                onOpenChange={setShowDetailsModal}
                data={selectedSale}
            />

        </div>
    );
}