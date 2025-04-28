const BASE_URL = import.meta.env.VITE_API_URL + "/reports";

export async function getReportsData() {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || "Error desconocido al obtener reportes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    throw error;
  }
}
