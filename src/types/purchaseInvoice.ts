export type PurchaseInvoice = {
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
      quantity: number
      restockDate: string
      product: {
        name: string
        price: number
      }
    }
  }
  