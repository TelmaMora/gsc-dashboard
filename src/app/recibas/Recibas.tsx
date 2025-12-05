import { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import { DataTable } from "@/components/data-table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

/* =======================
   TIPOS
======================= */
interface Usuario {
    id: number
    nombre: string
}

interface Proveedor {
    id: number
    nombre: string
}

interface Pesaje {
    kilos_brutos: number
    numero_cajas: number
    peso_tarima: number
    tipo_caja: "LISA" | "COSTILLA" | ""
}

interface Reciba {
    id: number
    fecha_ingreso: string
    tipo_fruta: string
    folio_ingreso: string
    acopio: string
    verificacion_candado: string
    tipo_caja_general: string
    proveedor: Proveedor
    recepcionista: Usuario
    pesajes: Pesaje[]
}

/* =======================
   COMPONENTE
======================= */
export default function Recibas() {
    const apiUrl = import.meta.env.VITE_API_URL

    const [recibas, setRecibas] = useState<Reciba[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [proveedores, setProveedores] = useState<Proveedor[]>([])

    const [dialogOpen, setDialogOpen] = useState(false)
    const [pesajeOpen, setPesajeOpen] = useState(false)
    const [verPesajeOpen, setVerPesajeOpen] = useState(false)

    const [recibaSeleccionada, setRecibaSeleccionada] =
        useState<Reciba | null>(null)

    /* =======================
       FORM RECIBA
    ======================= */
    const [nuevo, setNuevo] = useState({
        tipo_fruta: "",
        folio_ingreso: "",
        acopio: "",
        proveedor_id: "",
        recepcionista_id: "",
        tipo_caja_general: "",
        verificacion_candado: "",
        observaciones: "",
    })

    /* =======================
       PESAJE
    ======================= */
    const [pesajes, setPesajes] = useState<Pesaje[]>([
        { kilos_brutos: 0, numero_cajas: 0, peso_tarima: 0, tipo_caja: "" },
    ])

    /* =======================
       LOAD DATA
    ======================= */
    const cargarRecibas = async () => {
        const res = await fetch(`${apiUrl}/api/recibas`)
        const data = await res.json()
        setRecibas(data)
    }

    useEffect(() => {
        cargarRecibas()
        fetch(`${apiUrl}/api/usuarios`).then(r => r.json()).then(setUsuarios)
        fetch(`${apiUrl}/api/proveedores`).then(r => r.json()).then(setProveedores)
    }, [])

    /* =======================
       GUARDAR RECIBA
    ======================= */
    const guardarReciba = async () => {
        const res = await fetch(`${apiUrl}/api/recibas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...nuevo,
                proveedor_id: Number(nuevo.proveedor_id),
                recepcionista_id: Number(nuevo.recepcionista_id),
                pesajes,
            }),
        })

        if (!res.ok) {
            alert("Error al guardar")
            return
        }

        setDialogOpen(false)
        setPesajeOpen(false)
        setPesajes([
            { kilos_brutos: 0, numero_cajas: 0, peso_tarima: 0, tipo_caja: "" },
        ])
        setNuevo({
            tipo_fruta: "",
            folio_ingreso: "",
            acopio: "",
            proveedor_id: "",
            recepcionista_id: "",
            tipo_caja_general: "",
            verificacion_candado: "",
            observaciones: "",
        })
        cargarRecibas()
    }

    /* =======================
       PDF
    ======================= */
    const imprimirPDF = (r: Reciba) => {
        const doc = new jsPDF()

        doc.text("RECIBA DE FRUTA", 14, 15)

        autoTable(doc, {
            startY: 20,
            body: [
                ["Fecha", r.fecha_ingreso],
                ["Tipo fruta", r.tipo_fruta],
                ["Proveedor", r.proveedor.nombre],
                ["Recepcionista", r.recepcionista.nombre],
                ["Folio", r.folio_ingreso],
                ["Acopio", r.acopio],
                ["Candado", r.verificacion_candado],
                ["Tipo caja", r.tipo_caja_general],
            ],
        })

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [["Kilos", "Cajas", "Tarima", "Tipo caja"]],
            body: r.pesajes.map(p => [
                p.kilos_brutos,
                p.numero_cajas,
                p.peso_tarima,
                p.tipo_caja,
            ]),
        })

        doc.save(`reciba_${r.id}.pdf`)
    }

    /* =======================
       TABLA
    ======================= */
    const columns = [
        { header: "Fecha", accessorKey: "fecha_ingreso" },
        { header: "Fruta", accessorKey: "tipo_fruta" },
        {
            header: "Proveedor",
            accessorFn: (row: Reciba) => row.proveedor?.nombre,
        },
        {
            header: "Recepcionista",
            accessorFn: (row: Reciba) => row.recepcionista?.nombre,
        },
        {
            header: "Pesaje",
            cell: ({ row }: any) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        setRecibaSeleccionada(row.original)
                        setVerPesajeOpen(true)
                    }}
                >
                    Ver
                </Button>
            ),
        },
        {
            header: "PDF",
            cell: ({ row }: any) => (
                <Button size="sm" onClick={() => imprimirPDF(row.original)}>
                    PDF
                </Button>
            ),
        },
    ]
    const tabs = [{ value: "outline", label: "Listado" }]

    /* =======================
       UI
    ======================= */
    return (
        <DashboardLayout title="Recibas">
            <DataTable
                tabs={tabs}
                columns={columns}
                data={recibas}
                onAddSection={() => setDialogOpen(true)}
            />

            {/* ========== NUEVA RECIBA ========== */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Nueva reciba</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <Label>Tipo fruta</Label>
                        <Select onValueChange={(v) => setNuevo({ ...nuevo, tipo_fruta: v })}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Loca">Loca</SelectItem>
                                <SelectItem value="Aventajado">Aventajado</SelectItem>
                                <SelectItem value="Negro">Negro</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label>Folio ingreso</Label>
                        <Input
                            value={nuevo.folio_ingreso}
                            onChange={e => setNuevo({ ...nuevo, folio_ingreso: e.target.value })}
                        />

                        <Label>Proveedor</Label>
                        <Select
                            onValueChange={(v) => setNuevo({ ...nuevo, proveedor_id: v })}
                        >
                            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                                {proveedores.map(p => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label>Recepcionista</Label>
                        <Select
                            onValueChange={(v) =>
                                setNuevo({ ...nuevo, recepcionista_id: v })
                            }
                        >
                            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                                {usuarios.map(u => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label>Acopio</Label>
                        <Input
                            value={nuevo.acopio}
                            onChange={e => setNuevo({ ...nuevo, acopio: e.target.value })}
                        />

                        <Label>Tipo de caja</Label>
                        <Select
                            onValueChange={(v) =>
                                setNuevo({ ...nuevo, tipo_caja_general: v })
                            }
                        >
                            <SelectTrigger><SelectValue placeholder="Empaque / Proveedor" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EMPAQUE">Del Empaque</SelectItem>
                                <SelectItem value="PROVEEDOR">Del Proveedor</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label>Verificación candado</Label>
                        <Input
                            value={nuevo.verificacion_candado}
                            onChange={e =>
                                setNuevo({ ...nuevo, verificacion_candado: e.target.value })
                            }
                        />

                        <Button onClick={() => setPesajeOpen(true)}>
                            Registrar pesaje
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ========== PESAJE ========== */}
            {/* ========== PESAJE ========== */}
            <Dialog open={pesajeOpen} onOpenChange={setPesajeOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Pesaje</DialogTitle>
                    </DialogHeader>

                    {/* ✅ TITULOS */}
                    <div className="grid grid-cols-4 gap-2 font-semibold text-sm border-b pb-2">
                        <span>Kilos brutos</span>
                        <span>No. Cajas</span>
                        <span>Peso de tarima</span>
                        <span>Tipo de caja</span>
                    </div>

                    {/* ✅ FILAS */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-4 pt-2">
                        {pesajes.map((p, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 items-center">
                                <Input
                                    type="number"
                                    value={p.kilos_brutos}
                                    onChange={(e) => {
                                        const c = [...pesajes]
                                        c[i].kilos_brutos = Number(e.target.value)
                                        setPesajes(c)
                                    }}
                                />

                                <Input
                                    type="number"
                                    value={p.numero_cajas}
                                    onChange={(e) => {
                                        const c = [...pesajes]
                                        c[i].numero_cajas = Number(e.target.value)
                                        setPesajes(c)
                                    }}
                                />

                                <Input
                                    type="number"
                                    value={p.peso_tarima}
                                    onChange={(e) => {
                                        const c = [...pesajes]
                                        c[i].peso_tarima = Number(e.target.value)
                                        setPesajes(c)
                                    }}
                                />

                                <Select
                                    value={p.tipo_caja}
                                    onValueChange={(v) => {
                                        const c = [...pesajes]
                                        c[i].tipo_caja = v as any
                                        setPesajes(c)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Lisa / Costilla" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LISA">Lisa</SelectItem>
                                        <SelectItem value="COSTILLA">Costilla</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>

                    {/* ✅ ACCIONES */}
                    <div className="flex justify-between pt-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setPesajes([
                                    ...pesajes,
                                    { kilos_brutos: 0, numero_cajas: 0, peso_tarima: 0, tipo_caja: "" },
                                ])
                            }
                        >
                            + Agregar fila
                        </Button>

                        <Button onClick={guardarReciba}>
                            Guardar reciba
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>


            {/* ========== VER PESAJE ========== */}
            {/* ======= VER PESAJE (con encabezados) ======= */}
            <Dialog open={verPesajeOpen} onOpenChange={setVerPesajeOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Detalle de pesaje</DialogTitle>
                    </DialogHeader>

                    {/* Si no hay reciba seleccionada mostramos un mensaje */}
                    {!recibaSeleccionada ? (
                        <div className="p-4 text-sm text-muted-foreground">Selecciona una reciba para ver el detalle del pesaje.</div>
                    ) : (
                        <>
                            {/* Encabezados */}
                            <div className="grid grid-cols-4 gap-2 font-semibold text-sm border-b pb-2 px-2">
                                <span>Kilos brutos</span>
                                <span>No. Cajas</span>
                                <span>Peso de tarima</span>
                                <span>Tipo de caja</span>
                            </div>

                            {/* Filas (solo lectura) */}
                            <div className="flex-1 overflow-y-auto space-y-3 pr-4 pt-2 px-2">
                                {recibaSeleccionada.pesajes && recibaSeleccionada.pesajes.length > 0 ? (
                                    console.log(recibaSeleccionada.pesajes),
                                    recibaSeleccionada.pesajes.map((p: any, i: number) => (
                                        <div key={i} className="grid grid-cols-4 gap-2 items-center">
                                            <Input value={String(p.kilos_brutos ?? "")} disabled />
                                            <Input value={String(p.numero_cajas ?? "")} disabled />
                                            <Input value={String(p.peso_tarima ?? "")} disabled />
                                            <Input value={String(p.tipo_caja ?? "")} disabled />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground">No hay registros de pesaje para esta reciba.</div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Pie con botón cerrar */}
                    <div className="flex justify-end gap-2 p-3">
                        <Button variant="outline" onClick={() => setVerPesajeOpen(false)}>Cerrar</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </DashboardLayout>
    )
}
