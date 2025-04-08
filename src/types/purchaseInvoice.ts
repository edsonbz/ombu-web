export type PurchaseInvoice = {
    createdByEmail: string
    id: string
    date: string
    total: number
    provider: {
      name: string
      address: string
      phone: string
      email: string
    }
    restock: {
      unitPrice: any
      quantity: number
      restockDate: string
      product: {
        name: string
        price: number
      }
    }
  }
  
  export type PurchaseInvoiceProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    invoice: PurchaseInvoice | null
  }