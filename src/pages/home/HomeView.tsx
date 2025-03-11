import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function HomeView() {
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        navigate("/login");
    };
    return (
        <div>
            hola
            <Button onClick={handleSubmit}>Cerrar Sesion</Button>
        </div>
    )
}


