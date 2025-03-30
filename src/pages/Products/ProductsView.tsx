import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronRight, CirclePlus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const perfumes = [
    {
        name: "Dior Sauvage",
        description: "Aroma fresco y amaderado con toques de bergamota.",
        price: 720000,
        stock: 15,
    },
    {
        name: "Chanel N°5",
        description: "Elegante fragancia floral y aldehídica clásica.",
        price: 950000,
        stock: 8,
    },
    {
        name: "Armani Acqua di Gio",
        description: "Perfume acuático con notas cítricas y marinas.",
        price: 680000,
        stock: 20,
    },
    {
        name: "YSL Libre",
        description: "Mezcla de lavanda francesa con flor de azahar.",
        price: 810000,
        stock: 12,
    },
];

const formatGs = (value: number) => {
    return `₲ ${value.toLocaleString("es-PY")}`;
};

export function ProductsView() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const totalStock = perfumes.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = perfumes.reduce((sum, p) => sum + p.price * p.stock, 0);

    return (
        <div className="bg-[#c8d1d0] p-4 rounded-lg">
            <div className="flex justify-between items-center gap-1 mb-6">
                <div className="flex justify-start items-center text-secondary ">
                    <span
                        className="text-xl font-bold cursor-pointer"
                        onClick={goBack}
                    >
                        Productos
                    </span>
                    <ChevronRight className="w-6 h-6 self-center text-secondary" />
                    <span className="text-xl">Gestiona tus productos</span>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CirclePlus />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary text-tertiary">
                            <p>Agregar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Table className="bg-tertiary border border-baseBorder rounded-lg">
                <TableCaption>Lista de perfumes disponibles.</TableCaption>
                <TableHeader>
                    <TableRow className="text-secondary font-bold text-base">
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="">Precio</TableHead>
                        <TableHead className="">Stock</TableHead>
                        <TableHead></TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {perfumes.map((perfume, idx) => (
                        <TableRow key={idx}>
                            <TableCell className="font-medium">{perfume.name}</TableCell>
                            <TableCell>{perfume.description}</TableCell>
                            <TableCell className="">{formatGs(perfume.price)}</TableCell>
                            <TableCell className="">{perfume.stock}</TableCell>
                            <TableCell className=" text-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Pencil />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-secondary text-tertiary">
                                            <p>Editar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="font-semibold">{formatGs(totalValue)}</TableCell>
                        <TableCell className="">{totalStock}</TableCell>
                        <TableCell className=""></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
