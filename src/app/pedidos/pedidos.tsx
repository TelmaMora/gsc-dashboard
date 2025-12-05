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
import { ChevronsUpDown } from "lucide-react"

// -------- INTERFACES ----------
interface Pedido {
  id: number
  cliente: number
  numero_embarque: string
  clasificacion: number
  fecha: string
  cajas: number
  kilos: number
  tipo_caja: string
  pallets: number
}

interface Caja {
  id: number
  tipo: string
  kilosPorCaja: number
}

interface Cliente {
  id: number
  razon_social: string
}

interface Clasificacion {
  id: number
  clasificacion: string
}


// -------- COMPONENTE ----------
export default function Pedidos() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cajas, setCajas] = useState<Caja[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([])

  const apiUrl = import.meta.env.VITE_API_URL;

  const [nuevo, setNuevo] = useState({
    cliente: 0,
    numero_embarque: "",
    clasificacion: 0,
    fecha: new Date().toISOString().split("T")[0],
    cajas: 0,
    kilos: 0,
    tipo_caja: "",
    pallets: 0,
  })

  

  // -------- CARGA ----------
  const cargarPedidos = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/pedidos`)
      setPedidos(data)
    } catch (error) {
      console.error("Error al cargar pedidos:", error)
    }
  }

  const cargarClientes = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/clientes`)
      console.log("clientes", data)
      setClientes(data)
    } catch (error) {
      console.error("Error cargando clientes:", error)
    }
  }

  const cargarClasificaciones = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/clasificaciones`)
      setClasificaciones(data)
    } catch (error) {
      console.error("Error cargando clasificaciones:", error)
    }
  }

  const cargarCajas = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/cajas`)
      setCajas(data)
    } catch (error) {
      console.error("Error cargando cajas:", error)
    }
  }

  useEffect(() => {
    cargarPedidos()
    cargarClientes()
    cargarClasificaciones()
    cargarCajas()
  }, [])

  // -------- GUARDAR ----------
  const agregarPedido = async () => {
    console.log("nuevo", nuevo)
    try {
      const response = await axios.post(`${apiUrl}/api/pedidos`, nuevo)
      setDialogOpen(false)
      setNuevo({
        cliente: 0,
        numero_embarque: "",
        clasificacion: 0,
        fecha: new Date().toISOString().split("T")[0],
        cajas: 0,
        kilos: 0,
        tipo_caja: "",
        pallets: 0,
      })
      cargarPedidos()
      console.log(response)
    } catch (error) {
      console.error("Error al guardar pedido:", error)
      alert("Error al guardar pedido")
    }
  }

  // -------- COLUMNAS ----------
  const columns = [
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "numero_embarque", header: "No. Embarque" },
    { accessorKey: "clasificacion", header: "Clasificación" },
    { accessorKey: "fecha", header: "Fecha" },
    { accessorKey: "cajas", header: "Cajas" },
    { accessorKey: "kilos", header: "Kilos" },
    { accessorKey: "tipo_caja", header: "Tipo Caja" },
    { accessorKey: "pallets", header: "Pallets" },
  ]

  const tabs = [{ value: "outline", label: "Listado" }]

  // -----------------------------------------
  // -----------   RENDER   ------------------
  // -----------------------------------------
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
      />

      {/* DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Nuevo pedido</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] p-4">

            <div className="grid grid-cols-2 gap-4">

              {/* SELECT CLIENTE */}
              <div className="col-span-2">
                <Label>Cliente</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {nuevo.cliente
                        ? clientes.find(c => c.id === Number(nuevo.cliente))?.razon_social
                        : "Seleccionar cliente"}
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar cliente..." />
                      <CommandEmpty>No encontrado</CommandEmpty>
                      <CommandGroup>
                        {clientes.map(cli => (
                          <CommandItem
                            key={cli.id}
                            value={cli.razon_social}
                            onSelect={() => setNuevo({ ...nuevo, cliente: cli.id })}
                          >
                            {cli.razon_social}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* SELECT CLASIFICACION */}
              <div className="col-span-2">
                <Label>Clasificación</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {nuevo.clasificacion
                        ? clasificaciones.find(c => c.id === Number(nuevo.clasificacion))?.clasificacion
                        : "Seleccionar clasificación"}
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar..." />
                      <CommandEmpty>No encontrado</CommandEmpty>
                      <CommandGroup>
                        {clasificaciones.map(cl => (
                          <CommandItem
                            key={cl.id}
                            value={cl.clasificacion}
                            onSelect={() => setNuevo({ ...nuevo, clasificacion: cl.id })}
                          >
                            {cl.clasificacion}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* CAMPOS NORMALES */}
              <div>
                <Label>Número de embarque</Label>
                <Input
                  value={nuevo.numero_embarque}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, numero_embarque: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={nuevo.fecha}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, fecha: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Cajas</Label>
                <Input
                  type="number"
                  value={nuevo.cajas}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, cajas: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>Kilos</Label>
                <Input
                  type="number"
                  value={nuevo.kilos}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, kilos: Number(e.target.value) })
                  }
                />
              </div>

              {/* SELECT TIPO CAJA */}
              <div className="col-span-2">
                <Label>Tipo de caja</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {nuevo.tipo_caja
                        ? nuevo.tipo_caja
                        : "Seleccionar tipo de caja"}
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar caja..." />
                      <CommandEmpty>No encontrado</CommandEmpty>
                      <CommandGroup>
                        {cajas.map(caja => (
                          <CommandItem
                            key={caja.id}
                            onSelect={() => setNuevo({ ...nuevo, tipo_caja: caja.tipo })}
                          >
                            {caja.tipo} ({caja.kilosPorCaja} kg)
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="col-span-2">
                <Label>Pallets</Label>
                <Input
                  type="number"
                  value={nuevo.pallets}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, pallets: Number(e.target.value) })
                  }
                />
              </div>

              <div className="col-span-2">
                <Button onClick={agregarPedido} className="w-full">
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
