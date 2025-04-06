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
import { ChevronRight, Pencil } from "lucide-react"
import { deleteRestock, getRestocks } from "@/api/restock"
import { RestockRequest } from "@/types/restocks"
import { EditRestock } from "./EditRestock"
import { useNavigate } from "react-router-dom"

export function RestockView() {
    const [requests, setRequests] = useState<RestockRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<RestockRequest | null>(null)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getRestocks()
                setRequests(data)
            } catch (err: any) {
                console.error("Error al obtener solicitudes:", err)
                setError(err.message || "Error desconocido")
            } finally {
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("¿Seguro que deseas eliminar esta solicitud?")
        if (!confirmed) return
        try {
            await deleteRestock(id)
            setRequests((prev) => prev.filter((r) => r.id !== id))
        } catch (err) {
            console.error("Error al eliminar solicitud:", err)
        }
    }

    const handleEditClick = (request: RestockRequest) => {
        setSelectedRequest(request)
        setShowEditModal(true)
    }

    const handleUpdate = (updated: RestockRequest) => {
        setRequests((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
        )
    }
    const goBack = () => navigate('/home')

    if (loading) return <p>Cargando solicitudes...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className="bg-tertiary p-4 rounded-lg">
            <div className="flex items-center text-secondary mb-6">
                    <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
                        Solicitudes
                    </span>
                    <ChevronRight className="w-6 h-6 mx-2 text-secondary" />
                    <span className="text-xl">Gestiona tus solicitudes</span>
                </div>
            <Table className="bg-tertiary border border-baseBorder rounded-lg">
                <TableCaption>Lista de solicitudes de reposición realizadas.</TableCaption>
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
                            <TableCell>{req.status}</TableCell>
                            <TableCell className="flex items-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Pencil className="cursor-pointer" onClick={() => handleEditClick(req)} />
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
        </div>
    )
}
