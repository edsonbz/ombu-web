export type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

export type ProductsRequestProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  productName: string
}

export type EditProductViewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: Product
  onSubmit: (updatedProduct: Product) => void
  onDelete: (id: string) => void
}


export type NewProductViewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}