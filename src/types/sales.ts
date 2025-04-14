export type SaleRequest = {
    clientId: string
    paymentMethod: string
    products: {
      id: string
      quantity: number
    }[]
  }
  
  export type SaleWithDetails = {
    id: string
    client: {
      id: string
      name: string
    }
    paymentMethod: string
    date: string
    products: {
      productId: string
      quantity: number
      product: {
        name: string
        price: number
      }
    }[]
    invoice: {
      total: number
      taxes: number
      paymentStatus: string
    } | null
  }
  
  export type Sale = {
    id: string
    clientId: string
    paymentMethod: string
    date: string
    client: {
      name: string
      email: string
    }
    products: {
      productId: string
      quantity: number
      product: {
        name: string
        price: number
      }
    }[]
  }
  