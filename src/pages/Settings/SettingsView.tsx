import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Spinner } from "../Spinner/Spinner";
import { ChevronRight, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { createUser, deleteUser, getUsers, updateUserRole } from "@/api/auth";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

type User = {
    id: string;
    name: string;
    email: string;
    role: "admin" | "cashier";
};

export function SettingsView() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "cashier" as "admin" | "cashier",
    });

    const fieldLabels = {
        name: "Nombre",
        email: "Correo",
        password: "Contraseña",
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            toast.error("Error al obtener usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            await createUser(formData);
            toast.success("Usuario creado exitosamente");
            setFormData({ name: "", email: "", password: "", role: "cashier" });
            fetchUsers();
        } catch (error) {
            console.error("Error al crear usuario:", error);
            toast.error("Error al crear usuario");
        } finally {
            setCreating(false);
        }
    };

    const handleChangeRole = async (id: string, newRole: "admin" | "cashier") => {
        try {
            await updateUserRole(id, newRole);
            toast.success("Rol actualizado");
            fetchUsers();
        } catch (error) {
            console.error("Error al actualizar rol:", error);
            toast.error("Error al actualizar rol");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

        try {
            await deleteUser(id);
            toast.success("Usuario eliminado");
            fetchUsers();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            toast.error("Error al eliminar usuario");
        }
    };

    const goBack = () => {
        navigate("/home");
    };

    return (
        <div className="bg-tertiary p-6 rounded-lg">
            <div className="flex items-center mb-6">
                <span className="text-xl font-bold cursor-pointer text-secondary" onClick={goBack}>
                    Configuraciones
                </span>
                <ChevronRight className="w-6 h-6 text-secondary" />
                <span className="text-xl text-secondary">Gestiona tus configuraciones</span>
            </div>

            {/* 🧑‍💻 Crear nuevo usuario */}
            <div className="mb-10">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <h2 className="text-md font-semibold my-4">Crear nuevo usuario</h2>
                    <div className="grid gap-4 w-[60%]">
                        {Object.entries(fieldLabels).map(([field, label]) => (
                            <div key={field} className="grid grid-cols-2 items-center gap-4">
                                <Label htmlFor={field} className="text-right">{label}</Label>

                                {field === "password" ? (
                                    <div className="relative w-full col-span-3">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pr-10"
                                            required
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5 text-muted-foreground" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Input
                                        id={field}
                                        type={field === "email" ? "email" : "text"}
                                        value={(formData as any)[field]}
                                        onChange={handleChange}
                                        className="col-span-3"
                                        required
                                    />
                                )}
                            </div>
                        ))}

                        {/* Rol separado */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Rol</Label>
                            <Select value={formData.role} onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as "admin" | "cashier" }))}>
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="cashier">Cajero</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 w-[60%]">
                        <Button type="submit" disabled={creating}>
                            {creating ? "Creando..." : "Crear Usuario"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* 🗂️ Listado de usuarios */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Usuarios registrados</h2>

                {loading ? (
                    <Spinner />
                ) : (
                    <Table className="bg-tertiary border border-primary rounded-lg">
                        <TableCaption>Usuarios del sistema.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id.slice(0, 6)}...</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select value={user.role} onValueChange={(newRole) => handleChangeRole(user.id, newRole as "admin" | "cashier")}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                                <SelectItem value="cashier">Cajero</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Trash2
                                                        className="cursor-pointer text-red-500"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-secondary text-tertiary">
                                                    <p>Borrar Usuario</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
