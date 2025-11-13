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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 🧾 Tipos
interface Visita {
  id: number
  fecha: string
  tipoFruta: string
  encargado: string
  viaticos: number
  costoKg: number
  codigoProveedor: number
  proveedor: string
  ubicacionHuerta: string
  huerta: string
  tipoCorte: string
  volumenCalculado: number
  porcentajes: string
  observaciones: string
}

interface CorteProgramado {
  id: number
  visitaId?: number | null
  fechaCorte: string
  cuadrilla: number | null
  costoCorte: number
  transporte: number | null
  costoTransporte: number
  tipoFruta: string
  costoKg: number
  codigoProveedor: number
  proveedor: string
  ubicacionHuerta: string
  huerta: string
  tipoCorte: string
  encargado: string
  observaciones: string
}

export default function Cortes() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [conVisita, setConVisita] = useState<boolean | null>(null)

  // Simulación de visitas
  const [visitas] = useState<Visita[]>([
    {
      id: 1,
      fecha: "2025-10-10",
      tipoFruta: "Aguacate Hass",
      encargado: "Luis Martínez",
      viaticos: 1000,
      costoKg: 5.5,
      codigoProveedor: 123,
      proveedor: "San Pedro",
      ubicacionHuerta: "Toluca",
      huerta: "Huerta San Pedro",
      tipoCorte: "Manual",
      volumenCalculado: 25,
      porcentajes: "100-120",
      observaciones: "Sin incidencias",
    },
  ])

  // Simulación de cuadrillas y transportes
  const [cuadrillas] = useState([
    { id: 1, nombre: "Cuadrilla A" },
    { id: 2, nombre: "Cuadrilla B" },
  ])

  const [transportes] = useState([
    { id: 1, nombre: "Camión 12" },
    { id: 2, nombre: "Camioneta Norte" },
  ])

  const [cortes, setCortes] = useState<CorteProgramado[]>([])
  const [nuevo, setNuevo] = useState<Omit<CorteProgramado, "id">>({
    visitaId: null,
    fechaCorte: "",
    cuadrilla: null,
    costoCorte: 0,
    transporte: null,
    costoTransporte: 0,
    tipoFruta: "",
    costoKg: 0,
    codigoProveedor: 0,
    proveedor: "",
    ubicacionHuerta: "",
    huerta: "",
    tipoCorte: "",
    encargado: "",
    observaciones: "",
  })

  // Cuando seleccionas una visita, autollenar los campos
  const handleSelectVisita = (id: number) => {
    const v = visitas.find((x) => x.id === id)
    if (v) {
      setNuevo((prev) => ({
        ...prev,
        visitaId: v.id,
        tipoFruta: v.tipoFruta,
        encargado: v.encargado,
        costoKg: v.costoKg,
        codigoProveedor: v.codigoProveedor,
        proveedor: v.proveedor,
        ubicacionHuerta: v.ubicacionHuerta,
        huerta: v.huerta,
        tipoCorte: v.tipoCorte,
        observaciones: v.observaciones,
      }))
    }
  }

  const agregarCorte = () => {
    setCortes([...cortes, { ...nuevo, id: Date.now() }])
    setNuevo({
      visitaId: null,
      fechaCorte: "",
      cuadrilla: null,
      costoCorte: 0,
      transporte: null,
      costoTransporte: 0,
      tipoFruta: "",
      costoKg: 0,
      codigoProveedor: 0,
      proveedor: "",
      ubicacionHuerta: "",
      huerta: "",
      tipoCorte: "",
      encargado: "",
      observaciones: "",
    })
    setConVisita(null)
    setDialogOpen(false)
  }

  // 📊 Columnas para la tabla
  const columns = [
    { accessorKey: "proveedor", header: "Proveedor" },
    { accessorKey: "fechaCorte", header: "Fecha de corte" },
    { accessorKey: "cuadrilla", header: "Cuadrilla" },
    { accessorKey: "tipoFruta", header: "Tipo de fruta" },
    { accessorKey: "costoCorte", header: "Costo de corte" },
    { accessorKey: "transporte", header: "Transporte" },
    { accessorKey: "costoTransporte", header: "Costo transporte" },
    { accessorKey: "codigoProveedor", header: "Código proveedor" },
    { accessorKey: "ubicacionHuerta", header: "Ubicación / Huerta" },
    { accessorKey: "huerta", header: "Rancho / Huerta" },
    { accessorKey: "tipoCorte", header: "Tipo de corte" },
    { accessorKey: "encargado", header: "Encargado" },
    { accessorKey: "observaciones", header: "Observaciones" },
  ]

  const tabs = [{ value: "outline", label: "Listado" }]

  return (
    <DashboardLayout title="Cortes">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cortes Programados</h1>
      </div>

      <DataTable
        tabs={tabs}
        columns={columns}
        data={cortes}
        pageSizeOptions={[5, 10, 20, 50]}
        onAddSection={() => setDialogOpen(true)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nuevo Corte Programado</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto p-2">
            {/* Columna izquierda: información de visita */}
            <div className="space-y-3 border-r pr-4">
              <Label>¿Hay visita previa?</Label>
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="hayVisita"
                    onChange={() => {
                      setConVisita(true)
                      setNuevo((n) => ({ ...n, visitaId: null }))
                    }}
                    checked={conVisita === true}
                  />
                  Sí
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="hayVisita"
                    onChange={() => {
                      setConVisita(false)
                      setNuevo((n) => ({ ...n, visitaId: null }))
                    }}
                    checked={conVisita === false}
                  />
                  No
                </label>
              </div>

              {conVisita === true && (
                <div>
                  <Label>Selecciona la visita</Label>
                  <select
                    onChange={(e) => handleSelectVisita(Number(e.target.value))}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">-- Selecciona una visita --</option>
                    {visitas.map((v) => (
                      <option key={v.id} value={v.id}>
                        #{v.id} - {v.encargado} / {v.huerta} / {v.fecha}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {conVisita === false && (
                <div className="space-y-2">
                  {[
                    "tipoFruta",
                    "encargado",
                    "costoKg",
                    "codigoProveedor",
                    "proveedor",
                    "ubicacionHuerta",
                    "huerta",
                    "tipoCorte",
                    "observaciones",
                  ].map((key) => (
                    <div key={key}>
                      <Label className="capitalize">{key}</Label>
                      {key === "observaciones" ? (
                        <Textarea
                          value={nuevo[key as keyof typeof nuevo] as any}
                          onChange={(e) =>
                            setNuevo({ ...nuevo, [key]: e.target.value })
                          }
                        />
                      ) : (
                        <Input
                          type={
                            key === "codigoProveedor" || key === "costoKg"
                              ? "number"
                              : "text"
                          }
                          value={nuevo[key as keyof typeof nuevo] as any}
                          onChange={(e) =>
                            setNuevo({
                              ...nuevo,
                              [key]:
                                key === "codigoProveedor" || key === "costoKg"
                                  ? Number(e.target.value)
                                  : e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Columna derecha: programación del corte */}
            <div className="space-y-3">
              <Label>Fecha de corte</Label>
              <Input
                type="date"
                value={nuevo.fechaCorte}
                onChange={(e) =>
                  setNuevo({ ...nuevo, fechaCorte: e.target.value })
                }
              />

              <Label>Cuadrilla</Label>
              <Select
                onValueChange={(value) =>
                  setNuevo({ ...nuevo, cuadrilla: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una cuadrilla" />
                </SelectTrigger>
                <SelectContent>
                  {cuadrillas.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Transporte</Label>
              <Select
                onValueChange={(value) =>
                  setNuevo({ ...nuevo, transporte: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un transporte" />
                </SelectTrigger>
                <SelectContent>
                  {transportes.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Costo de corte</Label>
              <Input
                type="number"
                value={nuevo.costoCorte}
                onChange={(e) =>
                  setNuevo({ ...nuevo, costoCorte: Number(e.target.value) })
                }
              />

              <Label>Costo transporte</Label>
              <Input
                type="number"
                value={nuevo.costoTransporte}
                onChange={(e) =>
                  setNuevo({
                    ...nuevo,
                    costoTransporte: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={agregarCorte}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
