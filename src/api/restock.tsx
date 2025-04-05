const BASE_URL = "http://localhost:3000/api/restock"

export type RestockRequest = {
  providerId: string
  productId: string
  quantity: number
}

// Crear solicitud de reposición
export async function addRestock(restock: RestockRequest): Promise<RestockRequest> {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restock),
    })

    if (!res.ok) throw new Error("Error al crear solicitud de reposición")

    return await res.json()
  } catch (error) {
    console.error("Error en addRestock:", error)
    throw error
  }
}
