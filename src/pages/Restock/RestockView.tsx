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
import {
    ChevronRight,
    CircleCheck,
    CircleX,
    Info,
    Pencil,
    Trash,
    CirclePlus
} from "lucide-react"
import { deleteRestock, getRestocks } from "@/api/restock"
import { getProducts } from "@/api/products"
import { RestockRequest } from "@/types/restocks"
import { EditRestock } from "./EditRestock"
import { Link, useNavigate } from "react-router-dom"
import { Spinner } from "../Spinner/Spinner"
import { toast } from "sonner"
import { getSuppliers } from "@/api/suppliers"
import { NewRestock } from "./NewRestock"

export function RestockView() {
    const [requests, setRequests] = useState<RestockRequest[]>([])
    const [products, setProducts] = useState<{ id: string; name: string; price: number }[]>([])
    const [providers, setProviders] = useState<{ id: string; name: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<RestockRequest | null>(null)

    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            setLoading(true)
            const [res, prods, provs] = await Promise.all([
                getRestocks(),
                getProducts(),
                getSuppliers()
            ])
            setRequests(res)
            setProducts(prods.map(({ id, name, price }) => ({ id, name, price })))
            setProviders(provs.map(({ id, name }) => ({ id, name })))
        } catch (err: any) {
            console.error("Error al cargar solicitudes:", err)
            toast.error("Error al obtener solicitudes")
            navigate("/home")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("¿Seguro que deseas eliminar esta solicitud?")
        if (!confirmed) return
        try {
            await deleteRestock(id)
            await fetchData()
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
        await fetchData()
        setShowEditModal(false)
    }

    const handleAdd = (created: RestockRequest) => {
        setRequests((prev) => [...prev, created])
        setShowAddModal(false)
    }

    const goBack = () => navigate("/home")

    return loading ? (
        <Spinner />
    ) : (
        <div className="bg-tertiary p-4 rounded-lg">
            <div className="flex justify-between items-center text-secondary mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
                        Solicitudes
                    </span>
                    <ChevronRight className="w-6 h-6 text-secondary" />
                    <span className="text-xl">Gestiona tus solicitudes</span>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CirclePlus className="cursor-pointer" onClick={() => setShowAddModal(true)} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary text-tertiary">
                            <p>Agregar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Table className="bg-tertiary border border-primary rounded-lg">
                {/* <TableCaption>
                    Lista de solicitudes. Las ya facturadas puedes ver con más detalles en{" "}
                    <Link className="text-secondary font-bold" to={"/purchases-invoice"}>
                        Facturas
                    </Link>
                </TableCaption> */}
                <TableHeader className="font-bold text-base bg-primary rounded-lg">
                    <TableRow>
                        <TableHead className="text-tertiary">Producto</TableHead>
                        <TableHead className="text-tertiary">Proveedor</TableHead>
                        <TableHead className="text-center text-tertiary">Cantidad</TableHead>
                        <TableHead className="text-tertiary">Fecha</TableHead>
                        <TableHead className="text-tertiary">Estado</TableHead>
                        <TableHead className="text-tertiary"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell>{req.product.name}</TableCell>
                            <TableCell>{req.provider.name}</TableCell>
                            <TableCell className="text-center">{req.quantity}</TableCell>
                            <TableCell>
                                {new Date(req.restockDate).toLocaleDateString("es-PY")}
                            </TableCell>
                            <TableCell>
                                <div className="flex text-center items-center gap-1">
                                    {req.status === "pendiente" && (
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

                                    {req.status === "aprobado" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <CircleCheck className="text-green-600" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-secondary text-tertiary">
                                                    <p>Aprobado</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}

                                    {req.status === "rechazado" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <CircleX className="text-red-600" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-secondary text-tertiary">
                                                    <p>Rechazado</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell className="flex items-center gap-2">
                                {req.status === "rechazado" && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Trash
                                                    className="cursor-pointer text-destructive"
                                                    onClick={() => handleDelete(req.id)}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-secondary text-tertiary">
                                                <p>Eliminar</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                {req.status === "pendiente" && (
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
                                )}
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

            <NewRestock
                open={showAddModal}
                onOpenChange={setShowAddModal}
                products={products}
                providers={providers}
                onSubmit={handleAdd}
            />
        </div>
    )
}
