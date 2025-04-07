import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { PurchaseInvoice } from "@/types/purchaseInvoice"

export async function generateInvoicePDF(invoice: PurchaseInvoice) {
  const doc = new jsPDF()

  // Cargar imagen del logo
  const logo = new Image()
  logo.src = "/bug.png"

  await new Promise<void>((resolve) => {
    logo.onload = () => resolve()
  })

  // Dibujar logo más pequeño
  doc.addImage(logo, "PNG", 15, 10, 12, 10)  
  // Encabezado de texto
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("OMBU", 45, 20)
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("Factura de Compra", 45, 28)

  // Caja con datos
  doc.setDrawColor(180)
  doc.setLineWidth(0.3)
  doc.rect(15, 40, 180, 25)

  doc.setFontSize(12)
  doc.text(`Proveedor: ${invoice.provider.name}`, 20, 50)
  doc.text(`Fecha: ${new Date(invoice.date).toLocaleDateString("es-PY")}`, 20, 58)

  // Tabla
  autoTable(doc, {
    startY: 75,
    head: [["QTY", "Descripción", "Precio Unitario", "Total"]],
    body: [
      [
        invoice.restock.quantity.toString(),
        invoice.restock.product.name,
        `₲ ${Math.floor(invoice.total / invoice.restock.quantity).toLocaleString("es-PY")}`,
        `₲ ${invoice.total.toLocaleString("es-PY")}`,
      ],
    ],
    styles: {
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.3,
  })

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 90
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setDrawColor(0)
  doc.rect(130, finalY + 5, 60, 10)
  doc.text(`Total: ₲ ${invoice.total.toLocaleString("es-PY")}`, 135, finalY + 12)

  const fileName = `factura_${invoice.provider.name.replace(/\s+/g, "_")}_${invoice.id}.pdf`
  doc.save(fileName)
}
