import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { PurchaseInvoice } from "@/types/purchaseInvoice"
// import num2words from "num2words" // opcional si querés agregar el total en letras de nuevo

// Función para formatear números con puntos como separadores de miles
function formatGuarani(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export async function generateInvoicePDF(invoice: PurchaseInvoice) {
  const doc = new jsPDF()

  // Cargar imagen del logo
  const logo = new Image()
  logo.src = "/bug.png"
  await new Promise<void>((resolve) => (logo.onload = () => resolve()))
  doc.addImage(logo, "PNG", 15, 10, 12, 10)

  // Encabezado
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("OMBU", 45, 20)
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("Factura de Compra", 45, 28)

  // Caja con datos del proveedor
  doc.setDrawColor(180)
  doc.setLineWidth(0.3)
  doc.rect(15, 40, 180, 32)
  doc.setFontSize(12)
  doc.text(`Proveedor: ${invoice.provider.name}`, 20, 48)
  doc.text(`RUC: ${invoice.provider.email}`, 20, 54) // RUC asumido como email
  doc.text(`Fecha: ${new Date(invoice.date).toLocaleDateString("es-PY")}`, 20, 60)
  doc.text(`Emitido por: ${invoice.createdByEmail || "-"}`, 20, 66)

  // Tabla con los datos de la reposición
  autoTable(doc, {
    startY: 80,
    head: [["Cantidad", "Descripción", "Precio Unitario", "Total"]],
    body: [
      [
        invoice.restock.quantity.toString(),
        invoice.restock.product.name,
        `Gs. ${formatGuarani(Math.floor(invoice.total / invoice.restock.quantity))}`,
        `Gs. ${formatGuarani(invoice.total)}`,
      ],
    ],
    styles: { halign: "center", valign: "middle", font: "helvetica", fontSize: 11 },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.3,
  })

  // Total (cuadro a la derecha)
  const finalY = (doc as any).lastAutoTable.finalY || 100
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setDrawColor(0)
  doc.rect(130, finalY + 5, 60, 10)
  doc.text(`Total: Gs. ${formatGuarani(invoice.total)}`, 135, finalY + 12)

  // Guardar PDF
  const fileName = `factura_${invoice.provider.name.replace(/\s+/g, "_")}_${invoice.id}.pdf`
  doc.save(fileName)
}
