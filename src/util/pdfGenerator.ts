import { SaleWithDetails } from "@/types/sales";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function PdfGenerator(sale: SaleWithDetails, mode: "view" | "download" = "view") {
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(18);
  doc.text("Factura de Venta", 70, 20);

  doc.setFontSize(12);
  doc.text(`Cliente: ${sale.client.name}`, 15, 35);
  doc.text(`Fecha: ${new Date(sale.date).toLocaleDateString("es-PY")}`, 15, 42);

  const tableData = sale.products.map((item) => [
    item.product?.name || "Producto desconocido",
    item.quantity,
    `Gs. ${item.product?.price.toLocaleString() || "0"}`,
    `Gs. ${(item.product?.price * item.quantity).toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
    body: tableData,
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;

  const total = sale.invoice?.total ?? sale.products.reduce(
    (acc, item) => acc + (item.product.price * item.quantity), 0
  );
  const taxes = sale.invoice?.taxes ?? (total * 0.1);

  doc.text(`Total: Gs. ${total.toLocaleString()}`, 140, finalY + 10);
  doc.text(`IVA (10%): Gs. ${taxes.toLocaleString()}`, 140, finalY + 18);

  if (mode === "view") {
    window.open(doc.output("bloburl"), "_blank");
  } else if (mode === "download") {
    const filename = `factura_${sale.client.name.replace(/\s+/g, "_")}_${sale.id}.pdf`;
    doc.save(filename);
  }
}
