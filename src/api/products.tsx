const BASE_URL = "http://localhost:3000/api/products"

export type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

// Obtener todos los productos
export async function getProducts(): Promise<Product[]> {
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
    console.error("Error al obtener los productos:", error)
    throw error
  }
}

// Agregar un producto nuevo
export async function addProduct(product: Omit<Product, "id">): Promise<Product> {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al agregar el producto:", error)
    throw error
  }
}

// 🆕 Editar un producto existente
export async function updateProduct(product: Product): Promise<Product> {
  try {
    const response = await fetch(`${BASE_URL}/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar el producto")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al actualizar el producto:", error)
    throw error
  }
}

// 🆕 Eliminar un producto por ID
export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Error al eliminar el producto")
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error)
    throw error
  }
}
