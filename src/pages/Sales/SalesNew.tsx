import { useEffect, useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getClients } from "@/api/clients"
import { getProducts } from "@/api/products"
import { Client } from "@/types/clients"
import { Product } from "@/types/products"
import { toast } from "sonner"
import { createSale } from "@/api/sales"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"


type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function SalesNew({ open, onOpenChange, onSubmit }: Props) {
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedClient, setSelectedClient] = useState("")
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [clientQuery, setClientQuery] = useState("")
  const [clientComboOpen, setClientComboOpen] = useState(false)
  const selectedClientName = clients.find(c => c.id === selectedClient)?.name || ""


  useEffect(() => {
    if (open) {
      fetchData()
      setSelectedClient("")
      setItems([{ productId: "", quantity: 1 }])
    }
  }, [open])


  const fetchData = async () => {
    try {
      const [cl, pr] = await Promise.all([getClients(), getProducts()])
      setClients(cl)
      setProducts(pr)
      console.log("Clientes y productos cargados")
      console.log(cl)
      console.log(pr)
    } catch {
      toast.error("Error al cargar clientes o productos")
    }
  }

  const filteredClients = clients.filter((c) => c.name.toLowerCase().includes(clientQuery.toLowerCase()))

  const addItem = () => {
    if (items.length >= 5) return toast.warning("Máximo 5 productos por venta")
    setItems([...items, { productId: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
  }

  const handleChangeProduct = (index: number, value: string) => {
    const isDuplicated = items.some((item, idx) => idx !== index && item.productId === value)
    if (isDuplicated) {
      toast.error("Este producto ya está en la lista")
      return
    }

    const updated = [...items]
    updated[index].productId = value
    setItems(updated)
  }

  const handleChangeQuantity = (index: number, value: number) => {
    const updated = [...items]
    const selectedProduct = products.find(p => p.id === updated[index].productId)

    if (selectedProduct && value > selectedProduct.stock) {
      toast.error(`Solo hay ${selectedProduct.stock} unidades disponibles`)
      return
    }

    updated[index].quantity = value
    setItems(updated)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 🔐 Validación extra: cliente y productos seleccionados
    if (!selectedClient) {
      toast.error("Selecciona un cliente válido.")
      setLoading(false)
      return
    }

    if (items.some(i => i.productId === "")) {
      toast.error("Selecciona todos los productos antes de continuar.")
      setLoading(false)
      return
    }

    // 🔁 Validar productos duplicados
    const ids = items.map(i => i.productId)
    const hasDuplicates = new Set(ids).size !== ids.length
    if (hasDuplicates) {
      toast.error("Hay productos repetidos en la lista.")
      setLoading(false)
      return
    }

    // ✅ Validar stock disponible
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        toast.error("Producto inválido seleccionado.")
        setLoading(false)
        return
      }
      if (item.quantity > product.stock) {
        toast.error(`Stock insuficiente para ${product.name} (disponibles: ${product.stock})`)
        setLoading(false)
        return
      }
    }

    try {
      await createSale({
        clientId: selectedClient,
        paymentMethod,
        products: items.map(item => ({
          id: item.productId,
          quantity: item.quantity,
        })),
      })

      toast.success("Venta registrada y facturada correctamente")
      onSubmit()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al registrar venta:", error)
      toast.error("Error al registrar la venta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog modal={false} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center">Registrar Venta</DialogTitle>
            <DialogDescription className="sr-only">
              Completa los datos para registrar una venta
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col justify-between">
            {/* Cliente */}
            {/* We use a ref to ensure the PopoverContent width matches the trigger exactly and to avoid Radix CSS var issues inside Dialog */}
            <div className="mb-2 mt-2 flex flex-col gap-2">
              <Label>Cliente</Label>
              <Popover modal={false} open={clientComboOpen} onOpenChange={setClientComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clientComboOpen}
                    className="w-full justify-between"
                  >
                    {selectedClient
                      ? selectedClientName
                      : "Seleccionar cliente"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 w-[420px] max-w-[90vw] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar por nombre..."
                      className="h-9"
                      value={clientQuery}
                      onValueChange={setClientQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                      <CommandGroup>
                        {filteredClients.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={c.name}
                            keywords={[c.name]}
                            onSelect={() => {
                              setSelectedClient(c.id)
                              setClientQuery("")
                              setClientComboOpen(false)
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span>{c.name}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto",
                                selectedClient === c.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

            </div>
            {/* Método de Pago */}
            <div className="flex flex-col gap-2 mb-2 mt-2">
              <Label className="">Método de Pago</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Productos */}
          <div className="space-y-3 max-h-[300px] overflow-auto">
            <Label>Producto</Label>
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Select de producto más ancho */}
                <div className="flex-[3]">
                  <Select
                    value={item.productId}
                    onValueChange={(value) => handleChangeProduct(idx, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Input de cantidad más angosto */}
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleChangeQuantity(idx, Number(e.target.value))}
                  className="flex-[1]"
                />

                {/* Botón de borrar */}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(idx)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

            ))}
          </div>

          <DialogFooter className="mt-6 flex flex-col gap-4 items-center">
            <Button type="button" variant="outline" onClick={addItem} disabled={items.length >= 5}
            >
              + Agregar producto
            </Button>
            <Button type="submit" disabled={loading} className="">
              {loading ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}