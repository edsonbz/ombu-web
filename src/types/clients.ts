export interface Client {
    id: string
    name: string
    address: string
    phone: string
    ruc: string
    createdAt: string
  }
  
  export interface EditClientViewProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Client
    onSubmit: (updated: Client) => void
    onDelete: (id: string) => void
  }
  
  export interface NewClientViewProps {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
  