const BASE_URL = import.meta.env.VITE_API_URL + "/auth/login"


export async function login(email: string, password: string) {
    try {
        const response = await fetch( BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        console.log(data);  // El token si es un login exitoso
        return data;
    } catch (error) {
        console.error('Error al hacer el login:', error);
        throw error;
    }
}