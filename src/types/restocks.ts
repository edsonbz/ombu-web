export type RestockRequest = {
  id: string
  quantity: number
  restockDate: string
  status: string
  provider: { name: string }
  product: { name: string }
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

