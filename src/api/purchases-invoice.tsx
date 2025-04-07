import { PurchaseInvoice } from "@/types/purchaseInvoice"
// purchaseInvoice.ts o cualquier archivo de API
const BASE_URL = import.meta.env.VITE_API_URL + "/purchase-invoices"
 
//Funcion para crear una factura de compra
export async function createPurchaseInvoice(
    restockId: string,
    providerId: string,
    total: number
  ) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restockId, providerId, total }),
    })
  
    if (!res.ok) throw new Error("Error al generar factura de compra")
    return await res.json()
  }
  
//Funcion para obtener todas las facturas de compra
  export async function getPurchaseInvoices(): Promise<PurchaseInvoice[]> {
    try {
      const res = await fetch(BASE_URL)
      if (!res.ok) throw new Error("Error al obtener las facturas de compra")
      return await res.json()
    } catch (error) {
      console.error("Error en getPurchaseInvoices:", error)
      throw error
    }
  }
  