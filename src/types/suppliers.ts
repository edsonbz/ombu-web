export type Supplier = {
    id: string
    name: string
    address: string
    phone: string
    email: string
  }
  
 export type NewSupplierViewProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
  
 export type EditSupplierProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Supplier
    onSubmit: (updatedSupplier: Supplier) => void
    onDelete: (id: string) => void
  }