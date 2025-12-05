import { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { DataTable } from "@/components/data-table"
import { ScrollArea } from "@/components/ui/scroll-area"

/* =======================
   🔹 TIPOS
======================= */
interface Seleccion {
  id: number
  folio: string
  hora_inicio: string
  hora_fin: string | null
}

interface Reciba {
  id: number
  folio_ingreso: string
}

interface Clasificacion {
  id: number
  clasificacion: string
}

interface Cliente {
  id: number
  razon_social: string
}

interface DetalleSeleccion {
  clasificacion_id: number | ""
  cliente_id: number | ""
  cajas_por_pallet: number
  cajas_sueltas: number
  kilos_por_caja: number
  total_kilos: number
}

/* =======================
   🔹 COMPONENTE
======================= */
export default function Selecciones() {
  const apiUrl = import.meta.env.VITE_API_URL

  const [selecciones, setSelecciones] = useState<Seleccion[]>([])
  const [recibas, setRecibas] = useState<Reciba[]>([])
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)

  const [nuevo, setNuevo] = useState<{
    reciba_id: number | ""
    folio: string
    detalles: DetalleSeleccion[]
  }>({
    reciba_id: "",
    folio: "",
    detalles: [],
  })

  /* =======================
     DATA LOAD
  ======================= */
  const cargarTodo = async () => {
    const rSel = await fetch(`${apiUrl}/api/selecciones`)
    setSelecciones(await rSel.json())

    const rRec = await fetch(`${apiUrl}/api/recibas`)
    const data = await rRec.json();
    console.log(data)
    setRecibas(data)

    const rCla = await fetch(`${apiUrl}/api/clasificaciones`)
    setClasificaciones(await rCla.json())

    const rCli = await fetch(`${apiUrl}/api/clientes`)
    setClientes(await rCli.json())
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  /* =======================
     FORM ACTIONS
  ======================= */
  const agregarFila = () => {
    setNuevo({
      ...nuevo,
      detalles: [
        ...nuevo.detalles,
        {
          clasificacion_id: "",
          cliente_id: "",
          cajas_por_pallet: 0,
          cajas_sueltas: 0,
          kilos_por_caja: 0,
          total_kilos: 0,
        },
      ],
    })
  }

  const actualizarFila = (
    index: number,
    key: keyof DetalleSeleccion,
    value: any
  ) => {
    const copia = [...nuevo.detalles]
    copia[index] = {
      ...copia[index],
      [key]: value,
    }

    copia[index].total_kilos =
      copia[index].cajas_por_pallet * copia[index].kilos_por_caja

    setNuevo({ ...nuevo, detalles: copia })
  }

  /* =======================
     GUARDAR
  ======================= */
  const guardarSeleccion = async () => {
    await fetch(`${apiUrl}/api/selecciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reciba_id: nuevo.reciba_id,
        folio: nuevo.folio,
        detalles: nuevo.detalles,
      }),
    })

    setDialogOpen(false)
    setNuevo({ reciba_id: "", folio: "", detalles: [] })
    cargarTodo()
  }

  /* =======================
     COLUMNAS
  ======================= */
  const columns = [
    { accessorKey: "folio", header: "Folio" },
    { accessorKey: "hora_inicio", header: "Hora inicio" },
    { accessorKey: "hora_fin", header: "Hora fin" },
  ]

  const tabs = [{ value: "listado", label: "Listado" }]

  /* =======================
     UI
  ======================= */
  return (
    <DashboardLayout title="Selección">
      <DataTable
        tabs={tabs}
        columns={columns}
        data={selecciones}
        onAddSection={() => setDialogOpen(true)}
      />

      {/* =======================
         ➕ NUEVA SELECCIÓN
      ======================= */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Nueva Selección</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 px-2">

              {/* Folio / Reciba */}
              <Select
                onValueChange={(value) => {
                  setNuevo({ ...nuevo, reciba_id: Number(value), folio: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona Reciba / Folio" />
                </SelectTrigger>
                <SelectContent>
                  {recibas.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.folio_ingreso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Detalle de conteo */}
              <div className="space-y-3">
                {nuevo.detalles.map((d, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 items-center"
                  >
                    <Select
                      onValueChange={(v) =>
                        actualizarFila(i, "clasificacion_id", Number(v))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Clasificación" />
                      </SelectTrigger>
                      <SelectContent>
                        {clasificaciones.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.clasificacion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      onValueChange={(v) =>
                        actualizarFila(i, "cliente_id", Number(v))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.razon_social}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      placeholder="Cajas pallet"
                      onChange={(e) =>
                        actualizarFila(
                          i,
                          "cajas_por_pallet",
                          Number(e.target.value)
                        )
                      }
                    />

                    <Input
                      type="number"
                      placeholder="Cajas sueltas"
                      onChange={(e) =>
                        actualizarFila(
                          i,
                          "cajas_sueltas",
                          Number(e.target.value)
                        )
                      }
                    />

                    <Input
                      type="number"
                      placeholder="Kg/caja"
                      onChange={(e) =>
                        actualizarFila(
                          i,
                          "kilos_por_caja",
                          Number(e.target.value)
                        )
                      }
                    />

                    <Input
                      value={d.total_kilos}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                ))}
              </div>

              <Button variant="outline" onClick={agregarFila}>
                + Agregar registro
              </Button>

            </div>
          </ScrollArea>

          <div className="flex justify-end pt-4 gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarSeleccion}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
