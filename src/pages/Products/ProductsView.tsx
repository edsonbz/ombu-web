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
import { ChevronRight, CircleAlert, CirclePlus, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EditProductView } from "./EditProduct";
import { NewProductView } from "./NewProductView";
import { ProductsRequest } from "./ProductsRequest";
import { Product } from "@/types/products";
import { Spinner } from "../Spinner/Spinner";
import { toast } from "sonner";

// Formateador de guaraníes
const formatGs = (value: number) => {
  return `₲ ${value.toLocaleString("es-PY")}`;
};

export function ProductsView() {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = (updated: Product) => {
    setPerfumes((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    setPerfumes((prev) => prev.filter((p) => p.id !== id));
  };

  return loading ? (
    <Spinner/>
  ) : (
    <div className="bg-tertiary p-4 rounded-lg">
      <div className="flex justify-between items-center gap-1 mb-6">
        <div className="flex justify-start items-center text-secondary">
          <span className="text-xl font-bold cursor-pointer" onClick={goBack}>
            Productos
          </span>
          <ChevronRight className="w-6 h-6 self-center text-secondary" />
          <span className="text-xl">Gestiona tus productos</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CirclePlus className="cursor-pointer" onClick={() => setShowAddModal(true)} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary text-tertiary">
              <p>Agregar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Table className="bg-tertiary border border-baseBorder rounded-lg">
      <TableCaption>
  Inventario actual de perfumes disponibles. Para ver más detalles click en <Link className="text-secondary font-bold" to={'/restocks'}>
    Solicitudes
  </Link>.
</TableCaption>
        <TableHeader>
          <TableRow className="text-secondary font-bold text-base">
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-center">Precio</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perfumes.map((perfume) => (
            <TableRow key={perfume.id}>
              <TableCell className="font-medium">{perfume.name}</TableCell>
              <TableCell>{perfume.description}</TableCell>
              <TableCell className="text-center">{formatGs(perfume.price)}</TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  {perfume.stock}
                  {perfume.stock < 10 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CircleAlert
                            className="cursor-pointer text-red-600"
                            onClick={() => {
                              setSelectedProduct(perfume);
                              setShowRequestModal(true);
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary text-tertiary">
                          <p>Reponer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
              <TableCell className="flex justify-center items-center">
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
              </TableCell>
            </TableRow>
          ))}
          {error && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter />
      </Table>

      {selectedProduct && (
        <EditProductView
          open={showEditModal}
          onOpenChange={setShowEditModal}
          data={selectedProduct}
          onSubmit={handleUpdateProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      <NewProductView
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />

      <ProductsRequest
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        productId={selectedProduct?.id || ""}
        productName={selectedProduct?.name || ""}
      />
    </div>
  );
}
