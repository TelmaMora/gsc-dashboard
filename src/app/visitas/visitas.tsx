import { useState, useEffect } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// 💾 Tipos
interface Visita {
  id: number
  tipo_fruta: string
  encargado: string
  viaticos: number
  costo_kg: number
  codigo_proveedor: number
  proveedor_relacionado?: {
    codigo: number
    nombre: string
  }
  ubicacion_huerta: string
  huerta: string
  tipo_corte: string
  volumen_calculado: number
  porcentajes: string
  observaciones: string
}

interface Proveedor {
  id: number
  codigo: number
  nombre: string
  telefono: string
  zona: string
  tipo: string
  documentacion: string
  extension: string
}

export default function Visitas() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const apiUrl = import.meta.env.VITE_API_URL

  // ⭐ Objeto de nueva visita
  const [nueva, setNueva] = useState({
    tipo_fruta: "",
    encargado: "",
    viaticos: 0,
    costo_kg: 0,
    codigo_proveedor: 0,
    ubicacion_huerta: "",
    huerta: "",
    tipo_corte: "",
    volumen_calculado: 0,
    porcentajes: "",
    observaciones: "",
  })

  // 🔹 Cargar visitas
  const cargarVisitas = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/visitas`)
      const data = await res.json()
      setVisitas(data)
    } catch (error) {
      console.error("Error al cargar visitas:", error)
    }
  }

  // 🔹 Cargar proveedores
  const cargarProveedores = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/proveedores`)
      const data = await res.json()
      setProveedores(data)
    } catch (error) {
      console.error("Error al cargar proveedores:", error)
    }
  }

  useEffect(() => {
    cargarVisitas()
    cargarProveedores()
  }, [])

  // ➕ Guardar nueva visita
  const agregarVisita = async () => {
    try {
      const payload = { ...nueva }
      console.log("payload", payload)
      const res = await fetch(`${apiUrl}/api/visitas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Error al guardar visita")

      setDialogOpen(false)

      // Reset
      setNueva({
        tipo_fruta: "",
        encargado: "",
        viaticos: 0,
        costo_kg: 0,
        codigo_proveedor: 0,
        ubicacion_huerta: "",
        huerta: "",
        tipo_corte: "",
        volumen_calculado: 0,
        porcentajes: "",
        observaciones: "",
      })

      cargarVisitas()
    } catch (error) {
      console.error(error)
    }
  }

  // 🧱 Columnas tabla
  const columns = [
    { accessorKey: "fecha", header: "Fecha" },
    { accessorKey: "tipo_fruta", header: "Tipo de fruta" },
    { accessorKey: "encargado", header: "Encargado" },
    { accessorKey: "viaticos", header: "Viáticos" },
    { accessorKey: "costo_kg", header: "Costo/kg" },
    {
      accessorKey: "proveedor_relacionado.nombre",
      header: "Proveedor",
      cell: ({ row }: any) => row.original.proveedor_relacionado?.nombre ?? "",
    },
    { accessorKey: "ubicacion_huerta", header: "Ubicación" },
    { accessorKey: "huerta", header: "Huerta" },
    { accessorKey: "tipo_corte", header: "Tipo de corte" },
    { accessorKey: "volumen_calculado", header: "Volumen" },
    { accessorKey: "porcentajes", header: "Porcentajes" },
    { accessorKey: "observaciones", header: "Observaciones" },
  ]

  const tabs = [{ value: "outline", label: "Listado" }]

  return (
    <DashboardLayout title="Visitas">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Visitas a Huertas</h1>
      </div>

      <DataTable
        tabs={tabs}
        columns={columns}
        data={visitas}
        pageSizeOptions={[5, 10, 20, 50]}
        onAddSection={() => setDialogOpen(true)}
      />

      {/* ----------------------------- */}
      {/*         MODAL / DIALOG       */}
      {/* ----------------------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Nueva visita</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* ⭐ Combobox proveedor */}
              <div className="col-span-2">
                <Label>Proveedor</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {nueva.codigo_proveedor
                        ? proveedores.find((p) => p.codigo === nueva.codigo_proveedor)?.nombre
                        : "Seleccionar proveedor"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar proveedor..." />
                      <CommandEmpty>No se encontró ningún proveedor.</CommandEmpty>
                      <CommandGroup>
                        {proveedores.map((prov) => (
                          <CommandItem
                            key={prov.id}
                            value={prov.codigo.toString()}
                            onSelect={() =>
                              setNueva({
                                ...nueva,
                                codigo_proveedor: prov.codigo,
                              })
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                nueva.codigo_proveedor === prov.codigo
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {prov.codigo} — {prov.nombre}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* CAMPOS */}
              {[
                ["tipo_fruta", "Tipo de fruta", "text"],
                ["encargado", "Encargado", "text"],
                ["viaticos", "Viáticos", "number"],
                ["costo_kg", "Costo por kg", "number"],
                ["ubicacion_huerta", "Ubicación de huerta", "text"],
                ["huerta", "Huerta", "text"],
                ["tipo_corte", "Tipo de corte", "text"],
                ["volumen_calculado", "Volumen calculado", "number"],
                ["porcentajes", "Porcentajes", "text"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Input
                    type={type}
                    value={(nueva as any)[key]}
                    onChange={(e) =>
                      setNueva({
                        ...nueva,
                        [key]:
                          type === "number"
                            ? Number(e.target.value)
                            : e.target.value,
                      })
                    }
                  />
                </div>
              ))}

              {/* Observaciones - full width */}
              <div className="col-span-2">
                <Label>Observaciones</Label>
                <Textarea
                  value={nueva.observaciones}
                  onChange={(e) =>
                    setNueva({ ...nueva, observaciones: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2">
                <Button onClick={agregarVisita} className="w-full">
                  Guardar
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
