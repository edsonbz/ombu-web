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
import { ChevronRight, CirclePlus, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EditProductView } from "./EditProduct";
import { NewProductView } from "./NewProductView";

// Formateador de guaraníes
const formatGs = (value: number) => {
  return `₲ ${value.toLocaleString("es-PY")}`;
};

// Tipo de producto
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

export function ProductsView() {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false)  
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const goBack = () => navigate(-1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setPerfumes(products);
      } catch (err: any) {
        console.error("Error al obtener los productos:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalStock = perfumes.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = perfumes.reduce((sum, p) => sum + p.price * p.stock, 0);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = (updated: Product) => {
    setPerfumes((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-tertiary p-4 rounded-lg">
      <div className="flex justify-between items-center gap-1 mb-6">
        <div className="flex justify-start items-center text-secondary">
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
            <CirclePlus onClick={() => setShowAddModal(true)} />
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
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perfumes.map((perfume) => (
            <TableRow key={perfume.id}>
              <TableCell className="font-medium">{perfume.name}</TableCell>
              <TableCell>{perfume.description}</TableCell>
              <TableCell>{formatGs(perfume.price)}</TableCell>
              <TableCell>{perfume.stock}</TableCell>
              <TableCell className="flex justify-end gap-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Pencil
                        className="cursor-pointer"
                        onClick={() => handleEditClick(perfume)}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary text-tertiary">
                      <p>Editar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Trash
                        className="cursor-pointer"
                        onClick={() => handleEditClick(perfume)}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary text-tertiary">
                      <p>Borrar</p>
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
            <TableCell>{totalStock}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {selectedProduct && (
        <EditProductView
          open={showEditModal}
          onOpenChange={setShowEditModal}
          data={selectedProduct}
          onSubmit={handleUpdateProduct}
        />
      )}
       <NewProductView
  open={showAddModal}
  onOpenChange={setShowAddModal}
/>

    </div>
  );
}
