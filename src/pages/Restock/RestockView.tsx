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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronRight, FilePlus, Pencil } from "lucide-react"
import { deleteRestock, getRestocks } from "@/api/restock"
import { RestockRequest } from "@/types/restocks"
import { EditRestock } from "./EditRestock"
import { Link, useNavigate } from "react-router-dom"
import { Spinner } from "../Spinner/Spinner"
import { toast } from "sonner"
import { PurchaseInvoicePreView } from "../PurchaseInvoice/PurchaseInvoicePreView"

export function RestockView() {
    const [requests, setRequests] = useState<RestockRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<RestockRequest | null>(null)
    const [showInvoiceModal, setShowInvoiceModal] = useState(false)
    const [selectedForInvoice, setSelectedForInvoice] = useState<RestockRequest | null>(null)

    const navigate = useNavigate()

    // 🔄 Función reutilizable para cargar las solicitudes
    const fetchRequests = async () => {
        setLoading(true)
        try {
            const data = await getRestocks()
            setRequests(data)
        } catch (err: any) {
            console.error("Error al obtener solicitudes:", err)
            toast.error("Error al obtener solicitudes")
            navigate("/home")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("¿Seguro que deseas eliminar esta solicitud?")
        if (!confirmed) return
        try {
            await deleteRestock(id)
            await fetchRequests()
            toast.success("Solicitud eliminada correctamente")
        } catch (err) {
            console.error("Error al eliminar solicitud:", err)
            toast.error("Error al eliminar solicitud")
        }
    }

    const handleEditClick = (request: RestockRequest) => {
        setSelectedRequest(request)
        setShowEditModal(true)
    }

    const handleUpdate = async () => {
        await fetchRequests()
        setShowEditModal(false)
    }

    const goBack = () => navigate("/home")

    return loading ? (<Spinner />) : (
        <div className="bg-tertiary p-4 rounded-lg">
            <div className="flex items-center text-secondary mb-6">
                <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
                    Solicitudes
                </span>
                <ChevronRight className="w-6 h-6 mx-2 text-secondary" />
                <span className="text-xl">Gestiona tus solicitudes</span>
            </div>

            <Table className="bg-tertiary border border-baseBorder rounded-lg">
            <TableCaption>Lista de solicitudes, las ya facturadas puedes ver con más detalles en <Link className="text-secondary font-bold" to={'/purchaseInvoice'}>Facturas</Link></TableCaption>
            <TableHeader>
                    <TableRow className="text-secondary font-bold text-base">
                        <TableHead>Producto</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell>{req.product.name}</TableCell>
                            <TableCell>{req.provider.name}</TableCell>
                            <TableCell className="text-center">{req.quantity}</TableCell>
                            <TableCell>{new Date(req.restockDate).toLocaleDateString("es-PY")}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    {req.status}
                                    {req.status === "aprobado" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <FilePlus
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedForInvoice(req)
                                                            setShowInvoiceModal(true)
                                                        }}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-secondary text-tertiary">
                                                    <p>Facturar</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="flex items-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Pencil
                                                className="cursor-pointer"
                                                onClick={() => handleEditClick(req)}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-secondary text-tertiary">
                                            <p>Editar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedRequest && (
                <EditRestock
                    open={showEditModal}
                    onOpenChange={setShowEditModal}
                    data={selectedRequest}
                    onSubmit={handleUpdate}
                    onDelete={handleDelete}
                />
            )}

            <PurchaseInvoicePreView
                open={showInvoiceModal}
                onOpenChange={setShowInvoiceModal}
                restock={selectedForInvoice}
            />
        </div>
    )
}
