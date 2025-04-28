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

export function ClientsView() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const goBack = () => navigate("/home")

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const clients = await getClients()
        setClients(clients)
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

  const handleAddClient = (created: Client) => {
    if (!created.id) {
      toast.error("El cliente creado no tiene ID. No se agregará a la tabla.")
      return
    }
    setClients((prev) => [...prev, created])
  }

  const handleDeleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id))
  }

  return loading ? (
    <Spinner />
  ) : (
    <div className="bg-tertiary p-4 rounded-lg">
      <div className="flex justify-between items-center gap-1 mb-6">
        <div className="flex justify-start items-center text-secondary">
          <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
            Clientes
          </span>
          <ChevronRight className="w-6 h-6 self-center text-secondary" />
          <span className="text-xl">Gestiona tus clientes</span>
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

      <Table className="bg-tertiary border border-baseBorder rounded-lg">
        <TableCaption>Lista de clientes registrados en el sistema.</TableCaption>
        <TableHeader>
          <TableRow className="text-secondary font-bold text-base">
            <TableHead>Nombre</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>RUC</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.ruc}</TableCell>
              <TableCell className="flex justify-center items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Pencil
                        className="cursor-pointer"
                        onClick={() => handleEditClick(client)}
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
          {error && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter />
      </Table>

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
