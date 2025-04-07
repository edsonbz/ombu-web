export type RestockRequest = {
  id: string
  quantity: number
  restockDate: string
  status: string
  provider: {
    id: string
    name: string
  }
  product: {
    name: string
    id: string
    price: number
  }
}

export type CreateRestockRequest = {
  providerId: string
  productId: string
  quantity: number
}

export type EditRestockViewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: RestockRequest
  onSubmit: (updated: RestockRequest) => void
  onDelete?: (id: string) => void
}

