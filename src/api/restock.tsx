import { CreateRestockRequest, RestockRequest } from "@/types/restocks"

const BASE_URL = import.meta.env.VITE_API_URL + "/restock"

// Crear solicitud de reposición
export async function addRestock(restock: CreateRestockRequest): Promise<RestockRequest> {
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

//Traer solicitudes de reposición
export async function getRestocks(): Promise<RestockRequest[]> {
    try {
      const res = await fetch(BASE_URL)
      if (!res.ok) throw new Error("Error al obtener las solicitudes")
      return await res.json()
    } catch (error) {
      console.error("Error en getRestocks:", error)
      throw error
    }
  }

//Eliminar solicitud de reposición
export async function deleteRestock(id: string): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })
  
      if (!res.ok) throw new Error("Error al eliminar la solicitud")
    } catch (error) {
      console.error("Error en deleteRestock:", error)
      throw error
    }
  }

// Editar solicitud (solo cantidad y estado)
export async function updateRestock(
  id: string,
  data: { quantity: number; status: string }
): Promise<RestockRequest> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al actualizar la solicitud");

    return await res.json();
  } catch (error) {
    console.error("Error en updateRestock:", error);
    throw error;
  }
}

    