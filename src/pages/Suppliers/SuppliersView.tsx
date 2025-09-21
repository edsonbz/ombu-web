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
import { ChevronRight, CirclePlus, Pencil } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getSuppliers, deleteSupplier } from "@/api/suppliers"
import { EditSupplier } from "./EditSupplier"
import { NewSupplier } from "./NewSupplier"
import { Supplier } from "@/types/suppliers"
import { Spinner } from "../Spinner/Spinner"
import { toast } from "sonner"

export function SuppliersView() {
    const navigate = useNavigate()
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const goBack = () => navigate('/home')

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getSuppliers()
                const mappedData = data.map((supplier: any) => ({
                    id: supplier.id,
                    name: supplier.name,
                    phone: supplier.phone,
                    email: supplier.email,
                    address: supplier.address,
                }))
                setSuppliers(mappedData)
            } catch (err: any) {
                console.error("Error al obtener los proveedores:", err)
                toast.error("Error al obtener los proveedores")
                navigate("/home")
            } finally {
                setLoading(false)
            }
        }

        fetchSuppliers()
    }, [])

    const handleDeleteSupplier = async (id: string) => {
        const confirmDelete = window.confirm("¿Seguro que deseas eliminar este proveedor?");
        if (!confirmDelete) return;

        try {
            await deleteSupplier(id);
            setSuppliers((prev) => prev.filter((s) => s.id !== id));
            setShowEditModal(false);
            toast.success("Proveedor eliminado correctamente");
        } catch (err) {
            toast.error("Error al eliminar proveedor");
            console.error("Error al eliminar proveedor:", err);
        }
    };

    const handleUpdateSupplier = (updated: Supplier) => {
        setSuppliers((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
        )
    }
    const handleEditClick = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setShowEditModal(true);
    };


    return loading ? (<Spinner />) :
        (
            <div className="bg-tertiary p-4 rounded-lg">
                <div className="flex justify-between items-center gap-1 mb-6">
                    <div className="flex items-center text-secondary">
                        <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
                            Proveedores
                        </span>
                        <ChevronRight className="w-6 h-6 mx-2 text-secondary" />
                        <span className="text-xl">Gestiona tus proveedores</span>
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
                    <TableCaption>Lista de proveedores registrados.</TableCaption>
                    <TableHeader className="font-bold text-base bg-primary rounded-lg">
                        <TableRow >
                            <TableHead className="text-secondary font-bold text-base">Nombre</TableHead>
                            <TableHead className="text-secondary font-bold text-base">Dirección</TableHead>
                            <TableHead className="text-secondary font-bold text-base">Teléfono</TableHead>
                            <TableHead className="text-secondary font-bold text-base">Email</TableHead>
                            <TableHead className="text-secondary font-bold text-base"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suppliers.map((supplier) => (
                            <TableRow key={supplier.id}>
                                <TableCell className="font-medium">{supplier.name}</TableCell>
                                <TableCell>{supplier.address}</TableCell>
                                <TableCell>{supplier.phone}</TableCell>
                                <TableCell>{supplier.email}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Pencil className="cursor-pointer"
                                                    onClick={() => handleEditClick(supplier)}
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
                {selectedSupplier && (
                    <EditSupplier
                        open={showEditModal}
                        onOpenChange={setShowEditModal}
                        data={selectedSupplier}
                        onSubmit={handleUpdateSupplier}
                        onDelete={handleDeleteSupplier}
                    />
                )}

                <NewSupplier
                    open={showAddModal}
                    onOpenChange={setShowAddModal}
                />

            </div>
        )
}
