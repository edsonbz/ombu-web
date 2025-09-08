import { useEffect, useState } from "react"
import { getClients } from "@/api/clients"
import { Client } from "@/types/clients"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import { Spinner } from "../Spinner/Spinner"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { ClientEdit } from "./ClientEdit"
import { ClientNew } from "./ClientNew"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

export function ClientsView() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const [search, setSearch] = useState("")

  const columns: ColumnDef<Client & { document?: string | null; documentType?: string | null }>[] = [
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "address", header: "Dirección" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Teléfono" },
    { accessorKey: "documentType", header: "Tipo Doc", cell: ({ row }) => (row.original as any).documentType ? String((row.original as any).documentType).toUpperCase() : "-" },
    { accessorKey: "document", header: "Documento", cell: ({ row }) => (row.original as any).document ?? "-" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Pencil className="cursor-pointer" onClick={() => handleEditClick(row.original as Client)} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary text-tertiary">
              <p>Editar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const data = clients.filter((c) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    const name = (c.name || "").toLowerCase()
    const doc = ((c as any).document || "").toLowerCase()
    return name.includes(q) || doc.includes(q)
  }) as (Client & { document?: string | null; documentType?: string | null })[]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const goBack = () => navigate("/home")

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const resp = await getClients()
        const list = Array.isArray(resp)
          ? resp
          : (resp && (resp.data || (resp as any).clients)) || []
        setClients(list as Client[])
      } catch (err: any) {
        navigate("/home")
        setLoading(false)
        toast.error("Error al obtener los clientes")
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const handleEditClick = (client: Client) => {
    setSelectedClient(client)
    setShowEditModal(true)
  }

  const handleUpdateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const handleAddClient = (created: any) => {
    const entity: Client | undefined = (created?.id && created)
      || created?.data
      || created?.client
      || created?.result

    if (!entity || !entity.id) {
      console.warn("Crear cliente - respuesta inesperada:", created)
      toast.error("No pude leer el cliente creado (respuesta inesperada del API)")
      return
    }

    setClients((prev) => [...prev, entity])
  }

  const handleDeleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id))
  }

  return loading ? (
    <Spinner />
  ) : (
    <div className="bg-tertiary p-4 rounded-lg">
      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex justify-start items-center text-secondary">
          <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
            Clientes
          </span>
          <ChevronRight className="w-6 h-6 self-center text-secondary" />
          <span className="text-xl">Gestiona tus clientes</span>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Buscar por cliente (nombre)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80"
          />
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
      </div>

      <div className="bg-tertiary border border-baseBorder rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-secondary font-bold text-base">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {error ? error : "Sin resultados"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedClient && (
        <ClientEdit
          open={showEditModal}
          onOpenChange={setShowEditModal}
          data={selectedClient}
          onSubmit={handleUpdateClient}
          onDelete={handleDeleteClient}
        />
      )}

      <ClientNew open={showAddModal} onOpenChange={setShowAddModal} onSubmit={handleAddClient}
      />
    </div>
  )
}
