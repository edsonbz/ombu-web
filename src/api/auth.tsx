export async function login(email: string, password: string) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
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