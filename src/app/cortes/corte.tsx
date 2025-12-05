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

// 🧾 Tipo para cada registro de corte
interface Corte {
  id: number
  visitaId: number
  tipoCorte: string
  toneladasReales: number
  pesadaCampo: number
  fechaEntrega: string
  tiempoSeleccion: number
  corrida: string
  pagoProveedor: number
  viaticos: number
  transporte: number
  totalCorte: number
  precioKgBodega: number
  observaciones: string
  penalizaciones: string
}

export default function Cortes() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [cortes, setCortes] = useState<Corte[]>([])

  const [nuevo, setNuevo] = useState<Omit<Corte, "id">>({
    visitaId: 0,
    tipoCorte: "",
    toneladasReales: 0,
    pesadaCampo: 0,
    fechaEntrega: "",
    tiempoSeleccion: 0,
    corrida: "",
    pagoProveedor: 0,
    viaticos: 0,
    transporte: 0,
    totalCorte: 0,
    precioKgBodega: 0,
    observaciones: "",
    penalizaciones: "",
  })

  const agregarCorte = () => {
    const total = nuevo.pagoProveedor + nuevo.viaticos + nuevo.transporte
    const precioKg = nuevo.pesadaCampo > 0 ? total / nuevo.pesadaCampo : 0

    setCortes([
      ...cortes,
      {
        ...nuevo,
        id: Date.now(),
        totalCorte: total,
        precioKgBodega: parseFloat(precioKg.toFixed(2)),
      },
    ])

    setNuevo({
      visitaId: 0,
      tipoCorte: "",
      toneladasReales: 0,
      pesadaCampo: 0,
      fechaEntrega: "",
      tiempoSeleccion: 0,
      corrida: "",
      pagoProveedor: 0,
      viaticos: 0,
      transporte: 0,
      totalCorte: 0,
      precioKgBodega: 0,
      observaciones: "",
      penalizaciones: "",
    })

    setDialogOpen(false)
  }

  const columns = [
    { accessorKey: "visitaId", header: "Visita" },
    { accessorKey: "tipoCorte", header: "Tipo Corte" },
    { accessorKey: "toneladasReales", header: "Toneladas" },
    { accessorKey: "pesadaCampo", header: "Pesada Campo" },
    { accessorKey: "fechaEntrega", header: "Entrega" },
    { accessorKey: "tiempoSeleccion", header: "Tiempo Sel." },
    { accessorKey: "corrida", header: "Corrida" },
    {
      accessorKey: "pagoProveedor",
      header: "Pago Proveedor",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "viaticos",
      header: "Viáticos",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "transporte",
      header: "Transporte",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "totalCorte",
      header: "Total Corte",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: "precioKgBodega",
      header: "$/Kg Bodega",
      cell: (info: any) => `$${info.getValue().toFixed(2)}`,
    },
    { accessorKey: "observaciones", header: "Observaciones" },
    { accessorKey: "penalizaciones", header: "Penalizaciones" },
  ]

  const tabs = [{ value: "outline", label: "Listado" }]

  return (
    <DashboardLayout title="Cortes">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cortes Realizados</h1>
      </div>

      <DataTable
        tabs={tabs}
        columns={columns}
        data={cortes}
        pageSizeOptions={[5, 10, 20, 50]}
        onAddSection={() => setDialogOpen(true)}
        onCustomizeColumns={() => console.log("Personalizar columnas")}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo corte</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto px-4 pb-4">
            <div className="grid gap-3">
              {Object.keys(nuevo).map((key) => {
                if (["observaciones", "penalizaciones"].includes(key)) {
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
                        key === "fechaEntrega"
                          ? "date"
                          : [
                            "visitaId",
                            "toneladasReales",
                            "pesadaCampo",
                            "tiempoSeleccion",
                            "pagoProveedor",
                            "viaticos",
                            "transporte",
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
                              "visitaId",
                              "toneladasReales",
                              "pesadaCampo",
                              "tiempoSeleccion",
                              "pagoProveedor",
                              "viaticos",
                              "transporte",
                            ].includes(key)
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  </div>
                )
              })}
              <Button onClick={agregarCorte}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
