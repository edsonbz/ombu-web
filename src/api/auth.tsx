
const BASE_URL = import.meta.env.VITE_API_URL + "/auth";

// 🔑 Login
export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || 'Error desconocido');
    }

    const data = await response.json();
    console.log("Login exitoso:", data);
    return data;
  } catch (error) {
    console.error('Error al hacer el login:', error);
    throw error;
  }
}

// 👥 Obtener todos los usuarios
export async function getUsers() {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// ➕ Crear nuevo usuario
export async function createUser(userData: { name: string; email: string; password: string; role: "admin" | "cashier" }) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    return await response.json();
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

// 🔄 Cambiar rol de un usuario
export async function updateUserRole(id: string, newRole: "admin" | "cashier") {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newRole }),
    });
    if (!response.ok) throw new Error('Error al actualizar rol');
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    throw error;
  }
}

// 🗑️ Eliminar un usuario
export async function deleteUser(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}
