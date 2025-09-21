import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, CircleArrowLeft, CircleCheck, CircleX, Eye, FilePlus, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
import { Spinner } from "@/pages/Spinner/Spinner";
import { SalesNew } from "./SalesNew";
import { SalesDetails } from "./SalesDetails";
import { getSales } from "@/api/sales";
import { PdfGenerator } from "@/util/pdfGenerator";
import type { SaleWithDetails } from "@/types/sales";

export function SalesView() {
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleWithDetails | null>(null);

  const navigate = useNavigate();

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      toast.error("Error al obtener ventas");
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleNewSale = () => {
    fetchSales();
    setShowAddModal(false);
  };

  const goBack = () => navigate("/home");

  if (loading) return <Spinner />;

  return (
    <div className="bg-tertiary p-4 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold cursor-pointer text-primary" onClick={goBack}>
            Ventas
          </span>
          <ChevronRight className="w-6 h-6 text-secondary" />
          <span className="text-xl text-primary">Gestiona tus ventas</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <FilePlus className="cursor-pointer" onClick={() => setShowAddModal(true)} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary text-tertiary">
              <p>Nueva Venta</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Table className="bg-tertiary border border-primary rounded-lg">
        <TableCaption>Lista de ventas realizadas a clientes.</TableCaption>
        <TableHeader className="font-bold text-base bg-primary rounded-lg">
          <TableRow>
            <TableHead className="text-tertiary">Cliente</TableHead>
            <TableHead className="text-tertiary">Fecha</TableHead>
            <TableHead className="text-tertiary">Total</TableHead>
            <TableHead className="text-tertiary">Estado</TableHead>
            <TableHead className="text-tertiary"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.client.name}</TableCell>
              <TableCell>{new Date(sale.date).toLocaleDateString("es-PY")}</TableCell>

              {/* TOTAL */}
              <TableCell>
                {sale.invoice
                  ? `Gs. ${sale.invoice.total.toLocaleString()}`
                  : `Gs. ${sale.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toLocaleString()}`}
              </TableCell>

              {/* ESTADO */}
              <TableCell>
                <div className="flex text-center items-center gap-1">
                  {sale.invoice ? (
                    <>
                      {sale.invoice.paymentStatus === "pendiente" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Eye className="text-yellow-500 opacity-0" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-secondary text-tertiary">
                              <p>Pendiente</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {sale.invoice.paymentStatus === "pagado" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CircleCheck className="text-green-600" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-secondary text-tertiary">
                              <p>Pagado</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {sale.invoice.paymentStatus === "rechazado" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CircleX className="text-red-600" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-secondary text-tertiary">
                              <p>Rechazado</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {sale.invoice.paymentStatus === "devuelto" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CircleArrowLeft className="text-blue-600" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-secondary text-tertiary">
                              <p>Devuelto</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Eye className="text-yellow-500 opacity-0" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary text-tertiary">
                          <p>Pendiente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>

              {/* ACCIONES */}
              <TableCell className="text-center flex justify-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Eye
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedSale(sale);
                          setShowDetailsModal(true);
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary text-tertiary">
                      <p>Ver detalles</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {sale.invoice?.paymentStatus === "pagado" && (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FileText
                            className="cursor-pointer"
                            onClick={() => PdfGenerator(sale, "view")}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary text-tertiary">
                          <p>Ver PDF</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Printer
                            className="cursor-pointer"
                            onClick={() => PdfGenerator(sale, "download")}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary text-tertiary">
                          <p>Descargar PDF</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SalesNew open={showAddModal} onOpenChange={setShowAddModal} onSubmit={handleNewSale} />
      <SalesDetails
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        data={selectedSale}
        onActionDone={fetchSales}
      />
    </div>
  );
}