import { SaleRequest, SaleWithDetails } from "@/types/sales"

const BASE_URL = import.meta.env.VITE_API_URL + "/sales"

// Obtener todas las ventas
export async function getSales(): Promise<SaleWithDetails[]> {
  try {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error("Error al obtener ventas")
    return await res.json()
  } catch (error) {
    console.error("Error en getSales:", error)
    throw error
  }
}

// Agregar una nueva venta (con factura automática)
export async function createSale(sale: SaleRequest): Promise<SaleWithDetails> {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sale),
    })

    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error || "Error al registrar venta")
    }

    return await res.json()
  } catch (error) {
    console.error("Error en createSale:", error)
    throw error
  }
}

// Confirmar pago de venta
export async function confirmSalePayment(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/pagar`, {
      method: "PATCH",
    })

    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error || "Error al confirmar pago")
    }
  } catch (error) {
    console.error("Error en confirmSalePayment:", error)
    throw error
  }
}

// Rechazar venta (antes de pagar)
export async function rejectSale(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/rechazar`, {
      method: "PATCH",
    })

    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error || "Error al rechazar venta")
    }
  } catch (error) {
    console.error("Error en rejectSale:", error)
    throw error
  }
}

// Devolver venta (después de pagar)
export async function returnSale(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/devolver`, {
      method: "PATCH",
    })

    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error || "Error al devolver venta")
    }
  } catch (error) {
    console.error("Error en returnSale:", error)
    throw error
  }
}
