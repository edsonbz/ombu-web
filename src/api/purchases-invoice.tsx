import { PurchaseInvoice } from "@/types/purchaseInvoice"
// purchaseInvoice.ts o cualquier archivo de API
const BASE_URL = import.meta.env.VITE_API_URL + "/purchase-invoices"
 

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
  