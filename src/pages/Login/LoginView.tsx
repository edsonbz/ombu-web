import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../context/auth";
import { toast } from "sonner";
import { Spinner } from "../Spinner/Spinner";

export default function LoginView() {
    const formData = useRef({ email: '', password: '' });
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = { email: '', password: '' };
        if (!formData.current.email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.current.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        if (!formData.current.password) {
            newErrors.password = 'La contraseña es requerida';
        }
        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const onSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            if (!validate()) return;

            setLoading(true);
            const { email, password } = formData.current;
            try {
                const result = await signIn(email.trim(), password.trim());

                if (!result) {
                    toast.error("Error inesperado. Intenta de nuevo.");
                    setLoading(false);
                    return;
                }
                navigate("/home");
            } catch (error: any) {
                toast.error(error.message || "Error al iniciar sesión.");
                setLoading(false);
            }
            setLoading(false);
        },
        [signIn]
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            {/* luces animadas */}
            <div className="light x1" />
            <div className="light x2" />
            <div className="light x3" />
            <div className="light x4" />
            <div className="light x5" />
            <div className="light x6" />
            <div className="light x7" />
            <div className="light x8" />
            <div className="light x9" />
            <div className="z-10 w-full max-w-md flex flex-col gap-6 rounded-xl p-6">
                <Card className="text-secondary border-secondary">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bug">
                                <path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" />
                                <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
                                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
                                <path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
                                <path d="M6 13H2" /><path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
                                <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" /><path d="M22 13h-4" />
                                <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
                            </svg>
                            Bienvenido a Ombu
                        </CardTitle>
                        <CardDescription>Inicia sesión</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-6">
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Correo electrónico</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            onChange={(e) => (formData.current.email = e.target.value)}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Contraseña</Label>
                                            <a
                                                href="#"
                                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            onChange={(e) => (formData.current.password = e.target.value)}
                                        />
                                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-secondary hover:bg-tertiary hover:text-secondary flex items-center justify-center"
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner inline /> : "Iniciar sesión"}
                                    </Button>

                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
