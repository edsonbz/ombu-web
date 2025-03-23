import {Home, LogOut, Settings, ShoppingBasket, ShoppingCart, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "#",
    icon: Home,
  },
  {
    title: "Productos",
    url: "#",
    icon: ShoppingBasket,
  },
  {
    title: "Proveedores",
    url: "#",
    icon: ShoppingCart
  }
  ,
  {
    title:"Clientes",
    url: "#",
    icon: Users,
  },
  {
    title: "Configuraciones",
    url: "#",
    icon: Settings,
  },
  {
    title: "Cerrar Sesión",
    url: "/",
    icon: LogOut,
  }
]

export function SideBarContentView() {
  return (
    <Sidebar className="w-58" >
    <SidebarContent className="bg-gradient-to-b from-tertiary to-secondary">
      <SidebarGroup>
        <SidebarGroupLabel className="Flex gap-2 text-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bug"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>
         <span>Bienvenido a OMBU</span>
          </SidebarGroupLabel>
        <SidebarGroupContent >
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  )
}
