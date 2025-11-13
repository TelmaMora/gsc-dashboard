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

  const [nueva, setNueva] = useState<Omit<Visita, "id">>({
    fecha: "",
    tipoFruta: "",
    encargado: "",
    viaticos: 0,
    costoKg: 0,
    codigoProveedor: 0,
    proveedor: "",
    ubicacionHuerta: "",
    huerta: "",
    tipoCorte: "",
    volumenCalculado: 0,
    porcentajes: "",
    observaciones: "",
  })

  // 🔹 Cargar visitas
  const cargarVisitas = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/visitas")
      const data = await res.json()
      setVisitas(data)
    } catch (error) {
      console.error("Error al cargar visitas:", error)
    }
  }

  // 🔹 Cargar proveedores (para el Combobox)
  const cargarProveedores = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/proveedores")
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
      const res = await fetch("http://localhost:4000/api/visitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva),
      })

      if (!res.ok) throw new Error("Error al guardar visita")

      setDialogOpen(false)
      setNueva({
        fecha: "",
        tipoFruta: "",
        encargado: "",
        viaticos: 0,
        costoKg: 0,
        codigoProveedor: 0,
        proveedor: "",
        ubicacionHuerta: "",
        huerta: "",
        tipoCorte: "",
        volumenCalculado: 0,
        porcentajes: "",
        observaciones: "",
      })
      await cargarVisitas()
    } catch (error) {
      console.error(error)
    }
  }

  // 🧱 Columnas
  const columns = [
    { accessorKey: "fecha", header: "Fecha de visita" },
    { accessorKey: "tipoFruta", header: "Tipo de fruta" },
    { accessorKey: "encargado", header: "Encargado" },
    { accessorKey: "viaticos", header: "Viáticos" },
    { accessorKey: "costoKg", header: "Costo/kg" },
    { accessorKey: "codigoProveedor", header: "Código proveedor" },
    { accessorKey: "proveedor", header: "Proveedor" },
    { accessorKey: "ubicacionHuerta", header: "Ubicación Huerta" },
    { accessorKey: "huerta", header: "Huerta" },
    { accessorKey: "tipoCorte", header: "Tipo de corte" },
    { accessorKey: "volumenCalculado", header: "Volumen Calculado" },
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

      {/* 💬 Diálogo con Scroll y Combobox */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Nueva visita</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] p-4">
            <div className="grid gap-3">
              {/* 👇 Combobox para proveedor */}
              <div>
                <Label>Código del proveedor</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !nueva.codigoProveedor && "text-muted-foreground"
                      )}
                    >
                      {nueva.codigoProveedor
                        ? `Código ${nueva.codigoProveedor}`
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
                            onSelect={() => {
                              setNueva({
                                ...nueva,
                                codigoProveedor: prov.codigo,
                                proveedor: prov.nombre,
                              })
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                nueva.codigoProveedor === prov.codigo
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

              {/* 👇 Los demás campos */}
              {Object.keys(nueva).map((key) => {
                if (key === "codigoProveedor" || key === "proveedor") return null
                if (key === "observaciones") {
                  return (
                    <div key={key}>
                      <Label>Observaciones</Label>
                      <Textarea
                        value={nueva.observaciones}
                        onChange={(e) =>
                          setNueva({ ...nueva, observaciones: e.target.value })
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
                        ["viaticos", "costoKg", "volumenCalculado"].includes(key)
                          ? "number"
                          : key === "fecha"
                            ? "date"
                            : "text"
                      }
                      value={nueva[key as keyof typeof nueva] as any}
                      onChange={(e) =>
                        setNueva({
                          ...nueva,
                          [key]:
                            ["viaticos", "costoKg", "volumenCalculado"].includes(key)
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  </div>
                )
              })}

              <Button onClick={agregarVisita} className="mt-3">
                Guardar
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
