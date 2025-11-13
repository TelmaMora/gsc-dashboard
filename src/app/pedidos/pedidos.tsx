import axios from "axios"
import { useEffect, useState } from "react"
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

interface Pedido {
  id: number
  cliente: string
  numeroEmbarque: string
  clasificacion: string
  fecha: string
  cajas: number
  kilos: number
  tipoCaja: string
  pallets: number
}

interface Caja {
  id: number
  tipo: string
  kilosPorCaja: number
}

export default function Pedidos() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cajas, setCajas] = useState<Caja[]>([])

  const [nuevo, setNuevo] = useState<Omit<Pedido, "id">>({
    cliente: "",
    numeroEmbarque: "",
    clasificacion: "",
    fecha: "",
    cajas: 0,
    kilos: 0,
    tipoCaja: "",
    pallets: 0,
  })

  // 🔹 Cargar pedidos
  const cargarPedidos = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/pedidos")
      setPedidos(data)
    } catch (error) {
      console.error("Error cargando pedidos:", error)
    }
  }

  // 📦 Cargar cajas para el combobox
  const cargarCajas = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/cajas")
      setCajas(data)
    } catch (error) {
      console.error("Error al cargar cajas:", error)
    }
  }

  useEffect(() => {
    cargarPedidos()
    cargarCajas()
  }, [])

  // ➕ Guardar pedido
  const agregarPedido = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/pedidos", nuevo)
      setPedidos([...pedidos, response.data])
      setDialogOpen(false)
      setNuevo({
        cliente: "",
        numeroEmbarque: "",
        clasificacion: "",
        fecha: "",
        cajas: 0,
        kilos: 0,
        tipoCaja: "",
        pallets: 0,
      })
      await cargarPedidos()
    } catch (error) {
      console.error("Error al guardar el pedido:", error)
      alert("Hubo un problema al guardar el pedido")
    }
  }

  const columns = [
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "numeroEmbarque", header: "No. Embarque" },
    { accessorKey: "clasificacion", header: "Clasificación" },
    { accessorKey: "fecha", header: "Fecha" },
    { accessorKey: "cajas", header: "Cajas" },
    { accessorKey: "kilos", header: "Kilos" },
    { accessorKey: "tipoCaja", header: "Tipo Caja" },
    { accessorKey: "pallets", header: "Pallets" },
  ]

  const tabs = [{ value: "outline", label: "Listado" }]

  return (
    <DashboardLayout title="Pedidos">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pedidos</h1>
      </div>

      <DataTable
        tabs={tabs}
        columns={columns}
        data={pedidos}
        pageSizeOptions={[5, 10, 20, 50]}
        onAddSection={() => setDialogOpen(true)}
        onCustomizeColumns={() => console.log("Personalizar columnas")}
      />

      {/* 💬 Diálogo con scroll */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Nuevo pedido</DialogTitle>
          </DialogHeader>
          <ScrollArea className="p-4 max-h-[70vh]">
            <div className="grid gap-3">
              {Object.keys(nuevo).map((key) => {
                // 👇 Campo especial: tipoCaja con Combobox
                if (key === "tipoCaja") {
                  return (
                    <div key={key}>
                      <Label className="capitalize mb-1 block">Tipo de caja</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !nuevo.tipoCaja && "text-muted-foreground"
                            )}
                          >
                            {nuevo.tipoCaja
                              ? cajas.find((c) => c.tipo === nuevo.tipoCaja)?.tipo
                              : "Seleccionar tipo de caja"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar caja..." />
                            <CommandEmpty>No se encontró ninguna caja.</CommandEmpty>
                            <CommandGroup>
                              {cajas.map((caja) => (
                                <CommandItem
                                  key={caja.id}
                                  value={caja.tipo}
                                  onSelect={(value) =>
                                    setNuevo({ ...nuevo, tipoCaja: value })
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      nuevo.tipoCaja === caja.tipo
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {caja.tipo} ({caja.kilosPorCaja} kg)
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )
                }

                // 👇 Campos normales
                return (
                  <div key={key}>
                    <Label className="capitalize">{key}</Label>
                    <Input
                      type={
                        ["cajas", "kilos", "pallets"].includes(key)
                          ? "number"
                          : key === "fecha"
                            ? "date"
                            : "text"
                      }
                      value={nuevo[key as keyof typeof nuevo] as any}
                      onChange={(e) =>
                        setNuevo({
                          ...nuevo,
                          [key]: ["cajas", "kilos", "pallets"].includes(key)
                            ? Number(e.target.value)
                            : e.target.value,
                        })
                      }
                    />
                  </div>
                )
              })}
              <Button onClick={agregarPedido} className="mt-3">
                Guardar
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
