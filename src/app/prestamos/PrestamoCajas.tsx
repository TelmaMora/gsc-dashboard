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

/* =======================
   🔹 TIPOS
======================= */
interface PrestamoCaja {
    id: number
    fecha_prestamo: string
    responsable: string
    proveedor: string
    numero_cajas: number
    tipo_caja: string
}

interface Usuario {
    id: number
    nombre: string
}

interface Proveedor {
    id: number
    nombre: string
}

interface Caja {
    id: number
    codigo: string
    tipo: string
}

/* =======================
   🔹 COMPONENTE
======================= */
export default function PrestamoCajas() {
    const apiUrl = import.meta.env.VITE_API_URL

    const [dialogOpen, setDialogOpen] = useState(false)

    const [prestamos, setPrestamos] = useState<PrestamoCaja[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [proveedores, setProveedores] = useState<Proveedor[]>([])
    const [cajas, setCajas] = useState<Caja[]>([])

    const [nuevo, setNuevo] = useState({
        responsable_id: 0,
        proveedor_id: 0,
        caja_id: 0,
        numero_cajas: 0,
    })

    /* =======================
       🔹 CARGA DE DATOS
    ======================= */
    const cargarPrestamos = async () => {
        const res = await fetch(`${apiUrl}/api/prestamos-cajas`)
        const data = await res.json()

        console.log("PRESTAMOS RAW:", data)

        setPrestamos(data)
    }



    const cargarUsuarios = async () => {
        const res = await fetch(`${apiUrl}/api/usuarios`)
        const data = await res.json()
        console.log("USUARIOS:", data) // 👈 OBLIGATORIO PARA DEBUG
        setUsuarios(data)
    }

    const cargarProveedores = async () => {
        const res = await fetch(`${apiUrl}/api/proveedores`)
        setProveedores(await res.json())
    }

    const cargarCajas = async () => {
        const res = await fetch(`${apiUrl}/api/cajas`)
        setCajas(await res.json())
    }

    useEffect(() => {
        cargarPrestamos()
        cargarUsuarios()
        cargarProveedores()
        cargarCajas()
    }, [])

    /* =======================
       ➕ GUARDAR PRÉSTAMO
    ======================= */
    const guardar = async () => {
        await fetch(`${apiUrl}/api/prestamos-cajas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevo),
        })

        setNuevo({
            responsable_id: 0,
            proveedor_id: 0,
            caja_id: 0,
            numero_cajas: 0,
        })

        setDialogOpen(false)
        cargarPrestamos()
    }

    /* =======================
       🖨️ IMPRIMIR PDF
    ======================= */
    const imprimir = (row: PrestamoCaja) => {
        window.open(`${apiUrl}/api/prestamos-cajas/${row.id}/pdf`, "_blank")
    }

    /* =======================
       📊 COLUMNAS
    ======================= */
    const columns = [
        { accessorKey: "fecha_prestamo", header: "Fecha de préstamo" },
        { accessorKey: "responsable", header: "Quién entrega" },
        { accessorKey: "proveedor", header: "Nombre proveedor" },
        { accessorKey: "numero_cajas", header: "Número de cajas" },
        { accessorKey: "tipo_caja", header: "Tipo de caja" },
        {
            header: "Acciones",
            cell: ({ row }: any) => (
                <Button size="sm" onClick={() => imprimir(row.original)}>
                    Imprimir
                </Button>
            ),
        },
    ]

    const tabs = [{ value: "outline", label: "Listado" }]


    /* =======================
       🧱 UI
    ======================= */
    return (
        <DashboardLayout title="Préstamo de Cajas">
            <DataTable
                tabs={tabs}
                columns={columns}
                data={prestamos}
                onAddSection={() => setDialogOpen(true)}
            />

            {/* =======================
          💬 DIALOG
      ======================= */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg h-[80vh] p-0 flex flex-col">
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle>Nuevo préstamo</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="flex-1 p-4">
                        <div className="grid gap-4">

                            {/* RESPONSABLE */}
                            <div>
                                <Label>Responsable</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-between",
                                                !nuevo.responsable_id && "text-muted-foreground"
                                            )}
                                        >
                                            {usuarios.find(u => u.id === nuevo.responsable_id)?.nombre
                                                || "Seleccionar responsable"}
                                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar usuario..." />
                                            <CommandEmpty>No encontrado</CommandEmpty>
                                            <CommandGroup>
                                                {usuarios.map(u => (
                                                    <CommandItem
                                                        key={u.id}
                                                        onSelect={() =>
                                                            setNuevo({ ...nuevo, responsable_id: u.id })
                                                        }
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                nuevo.responsable_id === u.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {u.nombre}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* PROVEEDOR */}
                            <div>
                                <Label>Proveedor</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-between",
                                                !nuevo.proveedor_id && "text-muted-foreground"
                                            )}
                                        >
                                            {proveedores.find(p => p.id === nuevo.proveedor_id)?.nombre
                                                || "Seleccionar proveedor"}
                                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar proveedor..." />
                                            <CommandEmpty>No encontrado</CommandEmpty>
                                            <CommandGroup>
                                                {proveedores.map(p => (
                                                    <CommandItem
                                                        key={p.id}
                                                        onSelect={() =>
                                                            setNuevo({ ...nuevo, proveedor_id: p.id })
                                                        }
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                nuevo.proveedor_id === p.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {p.nombre}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* CAJA */}
                            <div>
                                <Label>Tipo de caja</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-between",
                                                !nuevo.caja_id && "text-muted-foreground"
                                            )}
                                        >
                                            {cajas.find(c => c.id === nuevo.caja_id)
                                                ? `${cajas.find(c => c.id === nuevo.caja_id)!.codigo} - ${cajas.find(c => c.id === nuevo.caja_id)!.tipo}`
                                                : "Seleccionar caja"}
                                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar caja..." />
                                            <CommandEmpty>No encontrado</CommandEmpty>
                                            <CommandGroup>
                                                {cajas.map(c => (
                                                    <CommandItem
                                                        key={c.id}
                                                        onSelect={() =>
                                                            setNuevo({ ...nuevo, caja_id: c.id })
                                                        }
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                nuevo.caja_id === c.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {c.codigo} — {c.tipo}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* NÚMERO DE CAJAS */}
                            <div>
                                <Label>Número de cajas</Label>
                                <Input
                                    type="number"
                                    value={nuevo.numero_cajas}
                                    onChange={(e) =>
                                        setNuevo({
                                            ...nuevo,
                                            numero_cajas: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <Button onClick={guardar} className="mt-2">
                                Guardar préstamo
                            </Button>

                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
