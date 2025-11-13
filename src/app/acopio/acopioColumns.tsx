import { Button } from "@/components/ui/button"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import type { ColumnDef } from "@tanstack/react-table"

export interface Acopio {
  id: number
  fechaCompra: string
  proveedor: string
  tipoCompra: string
  precioNegociado: number
  costoUnidad: number
  tipoTransporte: string
  gastosTransporte: number
  gastosOperativos: number
  viaticos: number
  totalCompra: number
  observaciones: string
}

export const acopioColumns: ColumnDef<Acopio>[] = [
  {
    accessorKey: "fechaCompra",
    header: "Fecha",
    cell: ({ getValue }) => {
      const fecha = new Date(getValue() as string)
      return fecha.toLocaleDateString()
    },
  },
  {
    accessorKey: "proveedor",
    header: "Proveedor",
  },
  {
    accessorKey: "tipoCompra",
    header: "Tipo Compra",
  },
  {
    accessorKey: "precioNegociado",
    header: "Precio Negociado",
    cell: ({ getValue }) => {
      const val = Number(getValue())
      return `$${val.toFixed(2)}`
    },
  },
  {
    accessorKey: "costoUnidad",
    header: "Costo Unidad",
    cell: ({ getValue }) => {
      const val = Number(getValue())
      return `$${val.toFixed(2)}`
    },
  },
  {
    accessorKey: "tipoTransporte",
    header: "Transporte",
  },
  {
    accessorKey: "gastosTransporte",
    header: "Gasto Transporte",
    cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
  },
  {
    accessorKey: "gastosOperativos",
    header: "Gasto Operativo",
    cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
  },
  {
    accessorKey: "viaticos",
    header: "Viáticos",
    cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
  },
  {
    accessorKey: "totalCompra",
    header: "Total",
    cell: ({ getValue }) => (
      <span className="font-medium">
        ${Number(getValue()).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "observaciones",
    header: "Observaciones",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: () => (
      <div className="flex justify-end gap-2">
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
