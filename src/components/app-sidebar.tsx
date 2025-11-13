import * as React from "react"
import {
  IconDashboard,
  IconListDetails,
  IconMapPin,
  IconCut,
  IconShoppingCart,
  IconReport,
  IconDatabase,
  IconBox,
  IconBoxMultiple,
  IconUsers,
  IconClipboardList,
  IconTruck,
  IconSettings,
  IconHelp,
  IconSearch
} from "@tabler/icons-react"

import { NavCatalogos } from "@/components/nav-catalogos"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

// 🔧 Menú de navegación principal
const data = {
  user: {
    name: "Green Sun Admin",
    email: "admin@greensun.com",
    avatar: "/avatars/shadcn.jpg",
  },

  // 🌱 Sección principal del dashboard
  navMain: [
    {
      title: "Requerimiento Semanal",
      url: "/requerimiento",
      icon: IconDashboard,
    },
    {
      title: "Pedidos",
      url: "/pedidos",
      icon: IconListDetails,
    },
    {
      title: "Visitas",
      url: "/visitas",
      icon: IconMapPin,
    },
    {
      title: "Programar Corte",
      url: "/cortes",
      icon: IconCut,
    },
    {
      title: "Acopio Directo",
      url: "/acopio",
      icon: IconShoppingCart,
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: IconReport,
    },
  ],

  // 📦 Catálogos del sistema
  catalogos: [
    { name: "Proveedores", url: "/catalogos/proveedores", icon: IconDatabase },
    { name: "Clientes", url: "/catalogos/clientes", icon: IconUsers },
    { name: "Cajas", url: "/catalogos/cajas", icon: IconBox },
    { name: "Pallets", url: "/catalogos/pallets", icon: IconBoxMultiple },
    { name: "Programas", url: "/catalogos/programas", icon: IconClipboardList },
    { name: "Cuadrillas", url: "/catalogos/cuadrillas", icon: IconUsers },
    { name: "Transportes", url: "/catalogos/transportes", icon: IconTruck },
    { name: "Clasificaciones", url: "/catalogos/clasificaciones", icon: IconTruck },
  ],

  // ⚙️ Sección secundaria
  navSecondary: [
    { title: "Usuarios", url: "/usuarios", icon: IconUsers },
    { title: "Configuración", url: "/ajustes", icon: IconSettings },
    { title: "Ayuda", url: "/ayuda", icon: IconHelp },
    { title: "Buscar", url: "/buscar", icon: IconSearch },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Encabezado */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-1.5 flex justify-center" style={{
    background: 'url("pattern-bg.png") center / cover no-repeat rgb(68, 21, 128)',
  }}>
              <Link to="/">
              <img
            src="Recurso-4@4x-8.png"
            alt="Green Sun Co. Logo"
            className="h-18 w-18 object-contain"
          />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Contenido */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCatalogos items={data.catalogos} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* Pie con info del usuario */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
