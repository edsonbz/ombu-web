export async function login(email: string, password: string) {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token); // Guarda el token en localStorage
        return data;
    } catch (error) {
        console.error('Error al hacer el login:', error);
        throw error;
    }
}