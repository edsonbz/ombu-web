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
