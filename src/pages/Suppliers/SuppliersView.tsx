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
import { ChevronRight, CirclePlus, Pencil, Trash } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getSuppliers, deleteSupplier } from "@/api/suppliers"

type Supplier = {
  id: string
  name: string
  ruc: string
  phone: string
  email: string
  address: string
}

export function SuppliersView() {
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const goBack = () => navigate(-1)

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers()
        const mappedData = data.map((supplier: any) => ({
          id: supplier.id,
          name: supplier.name,
          ruc: supplier.ruc || "",
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address,
        }))
        setSuppliers(mappedData)
      } catch (err: any) {
        console.error("Error al obtener los proveedores:", err)
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [])

  const handleDeleteClick = async (supplier: Supplier) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar al proveedor "${supplier.name}"?`
    )
    if (!confirmDelete) return

    try {
      await deleteSupplier(supplier.id)
      setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id))
    } catch (error) {
      console.error("Error al eliminar proveedor:", error)
      alert("No se pudo eliminar el proveedor.")
    }
  }

  if (loading) return <p>Cargando proveedores...</p>
  if (error) return <p>Error: {error}</p>

  return (
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
              <CirclePlus className="cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary text-tertiary">
              <p>Agregar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Table className="bg-tertiary border border-baseBorder rounded-lg">
        <TableCaption>Lista de proveedores registrados.</TableCaption>
        <TableHeader>
          <TableRow className="text-secondary font-bold text-base">
            <TableHead>Nombre</TableHead>
            <TableHead>RUC</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.ruc}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Pencil className="cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary text-tertiary">
                      <p>Editar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Trash
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDeleteClick(supplier)}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary text-tertiary">
                      <p>Borrar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
