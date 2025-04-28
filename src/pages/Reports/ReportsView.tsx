import { useEffect, useState } from "react";
import { getProducts } from "@/api/products";
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
} from "@/components/ui/tooltip";
import { ChevronRight} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/products";
import { Spinner } from "../Spinner/Spinner";
import { toast } from "sonner";
import { ReportsCards } from "./ReportsCards";

// Formateador de guaraníes
const formatGs = (value: number) => {
  return `₲ ${value.toLocaleString("es-PY")}`;
};

export function ReportsView() {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const goBack = () => navigate("/home");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        setPerfumes(products);
      } catch (err: any) {
        navigate("/home");
        setLoading(false);
        toast.error("Error al obtener los productos");
        console.error("Error al obtener los productos:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return loading ? (
    <Spinner/>
  ) : (
    <div className="bg-tertiary p-4 rounded-lg">
      <div className="flex justify-between items-center gap-1 mb-6">
        <div className="flex justify-start items-center text-secondary">
          <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
            Informes
          </span>
          <ChevronRight className="w-6 h-6 self-center text-secondary" />
          <span className="text-xl">Visualiza tus informes</span>
        </div>
      </div>
      <ReportsCards/>
    </div>
  );
}
