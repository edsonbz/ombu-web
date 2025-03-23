import { cn } from "../../lib/utils";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '@/pages/login/LoginView.css';
import { Button } from "../../components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../context/auth";

export default function LoginView() {
    const formData = useRef({ email: '', password: '' });
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({ email: '', password: '' });

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
            if (!validate()) {
                return;
            }
            const { email, password } = formData.current;
            console.log('email', email);
            console.log('password', password);
            const result = await signIn(email.trim(), password.trim());
            console.log('result', result);
            if (!result) {
                console.log('Error al iniciar sesión:', result);
            } else {
                navigate('/');
                console.log('Inicio de sesión exitoso:', result);
            }
        },
        [signIn]
    );

    return (
        <>
            <div className="light x1"></div>
            <div className="light x2"></div>
            <div className="light x3"></div>
            <div className="light x4"></div>
            <div className="light x5"></div>
            <div className="light x6"></div>
            <div className="light x7"></div>
            <div className="light x8"></div>
            <div className="light x9"></div>
            <div className={cn("flex flex-col gap-6 bg-tertiary")}>
                <Card className="text-secondary border-secondary">
                    <CardHeader className="text-center">
                        <CardTitle className="flex align-center justify-center gap-2 text-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bug"><path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" /><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" /><path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" /><path d="M6 13H2" /><path d="M3 21c0-2.1 1.7-3.9 3.8-4" /><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" /><path d="M22 13h-4" /><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" /></svg>
                            Bienvenido a Ombu
                        </CardTitle>
                        <CardDescription>
                            Inicia sesión con tu cuenta de Google
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button variant="outline" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Iniciar sesión con Google
                                    </Button>
                                </div>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                        O continúa con
                                    </span>
                                </div>
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
                                    <Button type="submit" className="w-full bg-secondary hover:bg-tertiary cursor-pointer">
                                        Iniciar sesión
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                    Al hacer clic en continuar, aceptas nuestros <a href="#">Términos de Servicio</a>{" "}
                    y <a href="#">Política de Privacidad</a>.
                </div>
            </div>
        </>

    );
}