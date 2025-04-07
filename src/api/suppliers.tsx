import { Supplier } from "@/types/suppliers"

const BASE_URL = import.meta.env.VITE_API_URL + "/providers"

// Obtener todos los proveedores
export async function getSuppliers(): Promise<Supplier[]> {
  try {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error("Error al obtener proveedores")
    return await res.json()
  } catch (error) {
    console.error("Error al obtener proveedores:", error)
    throw error
  }
}

// Crear proveedor
export async function addSupplier(supplier: Omit<Supplier, "id">): Promise<Supplier> {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplier),
    })
    if (!res.ok) throw new Error("Error al crear proveedor")
    return await res.json()
  } catch (error) {
    console.error("Error al crear proveedor:", error)
    throw error
  }
}

// Editar proveedor
export async function updateSupplier(supplier: Supplier): Promise<Supplier> {
  try {
    const res = await fetch(`${BASE_URL}/${supplier.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplier),
    })
    if (!res.ok) throw new Error("Error al actualizar proveedor")
    return await res.json()
  } catch (error) {
    console.error("Error al actualizar proveedor:", error)
    throw error
  }
}

// Eliminar proveedor
export async function deleteSupplier(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Error al eliminar proveedor")
  } catch (error) {
    console.error("Error al eliminar proveedor:", error)
    throw error
  }
}
