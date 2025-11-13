import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import type { ColumnDef } from "@tanstack/react-table"


export type OutlineRow = {
  id: string
  name: string
  status: "Active" | "Inactive" | "Draft"
  owner: string
  updatedAt: string
}


export const columns: ColumnDef<OutlineRow>[] = [
  {
    accessorKey: "name",
    header: "Section Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OutlineRow["status"]
      const color =
        status === "Active"
          ? "bg-green-100 text-green-700"
          : status === "Inactive"
          ? "bg-gray-100 text-gray-700"
          : "bg-yellow-100 text-yellow-700"
      return <Badge className={`${color} capitalize`}>{status}</Badge>
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ }) => (
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="icon">
          <IconPencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-red-500">
          <IconTrash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
]


export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable
                tabs={[
                  { value: "outline", label: "Outline" },
                  { value: "past-performance", label: "Past Performance", badge: 3 },
                  { value: "key-personnel", label: "Key Personnel", badge: 2 },
                  { value: "focus-documents", label: "Focus Documents" },
                ]}
                columns={columns}
                data={data}
                onAddSection={() => console.log("New section")}
                onCustomizeColumns={(cols) => console.log("Updated columns", cols)}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
