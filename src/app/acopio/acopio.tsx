import { useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/data-table"

interface Acopio {
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

export default function Acopio() {
  const [dialogOpen, setDialogOpen] = useState(false) // 👈 controla el diálogo
  const [acopios, setAcopios] = useState<Acopio[]>([
    {
      id: 1,
      fechaCompra: "2025-11-03",
      proveedor: "Frutas del Valle",
      tipoCompra: "Selección",
      precioNegociado: 14.8,
      costoUnidad: 15.2,
      tipoTransporte: "Camión refrigerado",
      gastosTransporte: 3000,
      gastosOperativos: 1500,
      viaticos: 500,
      totalCompra: 50000,
      observaciones: "Compra directa para cliente de temporada",
    },
  ])

  const [nuevo, setNuevo] = useState<Omit<Acopio, "id">>({
    fechaCompra: "",
    proveedor: "",
    tipoCompra: "",
    precioNegociado: 0,
    costoUnidad: 0,
    tipoTransporte: "",
    gastosTransporte: 0,
    gastosOperativos: 0,
    viaticos: 0,
    totalCompra: 0,
    observaciones: "",
  })

  const agregarCompra = () => {
    const total =
      nuevo.gastosTransporte +
      nuevo.gastosOperativos +
      nuevo.viaticos +
      nuevo.costoUnidad * 100

    setAcopios([
      ...acopios,
      {
        ...nuevo,
        id: Date.now(),
        totalCompra: parseFloat(total.toFixed(2)),
      },
    ])

    setNuevo({
      fechaCompra: "",
      proveedor: "",
      tipoCompra: "",
      precioNegociado: 0,
      costoUnidad: 0,
      tipoTransporte: "",
      gastosTransporte: 0,
      gastosOperativos: 0,
      viaticos: 0,
      totalCompra: 0,
      observaciones: "",
    })

    setDialogOpen(false) // 🔒 cierra el diálogo al guardar
  }

  const columns = [
    { accessorKey: "fechaCompra", header: "Fecha" },
    { accessorKey: "proveedor", header: "Proveedor" },
    { accessorKey: "tipoCompra", header: "Tipo Compra" },
    {
      accessorKey: "precioNegociado",
      header: "Precio Negociado",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "costoUnidad",
      header: "Costo Unidad",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    { accessorKey: "tipoTransporte", header: "Transporte" },
    {
      accessorKey: "gastosTransporte",
      header: "Gasto Transporte",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "gastosOperativos",
      header: "Gasto Operativo",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "viaticos",
      header: "Viáticos",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "totalCompra",
      header: "Total",
      cell: (info: any) => (
        <span className="font-medium">${info.getValue().toFixed(2)}</span>
      ),
    },
    { accessorKey: "observaciones", header: "Observaciones" },
  ]

  const tabs = [{ value: "outline", label: "Listado" }]

  return (
    <DashboardLayout title="Acopio Directo">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Compras de Acopio Directo</h1>
      </div>

      {/* 👇 DataTable con callback que abre el diálogo */}
      <DataTable
        tabs={tabs}
        columns={columns}
        data={acopios}
        pageSizeOptions={[5, 10, 20, 50]}
        onAddSection={() => setDialogOpen(true)} // 👈 aquí abrimos el mismo diálogo
        onCustomizeColumns={() => console.log("Personalizar columnas")}
      />

      {/* 💬 Diálogo controlado por estado */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva compra</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {Object.keys(nuevo).map((key) => {
              if (key === "observaciones") {
                return (
                  <div key={key}>
                    <Label className="capitalize">{key}</Label>
                    <Textarea
                      value={nuevo[key as keyof typeof nuevo]}
                      onChange={(e) =>
                        setNuevo({ ...nuevo, [key]: e.target.value })
                      }
                    />
                  </div>
                )
              }
              return (
                <div key={key}>
                  <Label className="capitalize">{key}</Label>
                  <Input
                    type={
                      key === "fechaCompra"
                        ? "date"
                        : [
                            "precioNegociado",
                            "costoUnidad",
                            "gastosTransporte",
                            "gastosOperativos",
                            "viaticos",
                          ].includes(key)
                        ? "number"
                        : "text"
                    }
                    value={nuevo[key as keyof typeof nuevo] as any}
                    onChange={(e) =>
                      setNuevo({
                        ...nuevo,
                        [key]:
                          [
                            "precioNegociado",
                            "costoUnidad",
                            "gastosTransporte",
                            "gastosOperativos",
                            "viaticos",
                          ].includes(key)
                            ? Number(e.target.value)
                            : e.target.value,
                      })
                    }
                  />
                </div>
              )
            })}
            <Button onClick={agregarCompra}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
