import { toast } from "sonner";

// Ver factura (abre en nueva pestaña)
export async function viewInvoice(saleId: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/invoices/${saleId}/view`;

    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || "Error al abrir la factura");
    }

    const blob = await res.blob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank");

  } catch (error: any) {
    console.error("Error en viewInvoice:", error);
    toast.error(error.message || "Error al abrir factura");
  }
}

// Descargar factura (fuerza descarga)
export async function downloadInvoice(saleId: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/invoices/${saleId}/download`;

    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || "Error al descargar la factura");
    }

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `factura_${saleId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error: any) {
    console.error("Error en downloadInvoice:", error);
    toast.error(error.message || "Error al descargar factura");
  }
}
