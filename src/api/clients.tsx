import { Client } from "@/types/clients"

const BASE_URL = import.meta.env.VITE_API_URL + "/clients"

// Obtener todos los clientes
export async function getClients(): Promise<Client[]> {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener los clientes:", error)
    throw error
  }
}

// Agregar un cliente nuevo
export async function addClient(client: Omit<Client, "id" | "createdAt">): Promise<Client> {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client),
    })

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al agregar el cliente:", error)
    throw error
  }
}

// Editar un cliente existente
export async function updateClient(client: Client): Promise<Client> {
  try {
    const response = await fetch(`${BASE_URL}/${client.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar el cliente")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al actualizar el cliente:", error)
    throw error
  }
}

// Eliminar un cliente por ID
export async function deleteClient(id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Error al eliminar el cliente")
    }
  } catch (error) {
    console.error("Error al eliminar el cliente:", error)
    throw error
  }
}
