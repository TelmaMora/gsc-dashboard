import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CatalogoCrudProps {
  title: string
  fields: string[]
  endpoint: string // 👈 nuevo prop
}

export default function CatalogoCrud({ title, fields, endpoint }: CatalogoCrudProps) {
  const [data, setData] = useState<Record<string, any>[]>([])
  const [nuevo, setNuevo] = useState<Record<string, any>>(
    fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  )
  const [open, setOpen] = useState(false)

  // 📡 Cargar datos
  const cargarDatos = async () => {
    const res = await fetch(`http://localhost:4000/api/${endpoint}`)
    const json = await res.json()
    setData(json)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // ➕ Agregar
  const agregar = async () => {
    await fetch(`http://localhost:4000/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    })
    setNuevo(fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}))
    setOpen(false)
    cargarDatos()
  }

  // 🗑️ Eliminar
  const eliminar = async (id: number) => {
    await fetch(`http://localhost:4000/api/${endpoint}/${id}`, { method: "DELETE" })
    cargarDatos()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nuevo registro</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar {title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              {fields.map((field) => (
                <div key={field}>
                  <Label className="capitalize">{field}</Label>
                  <Input
                    value={nuevo[field]}
                    onChange={(e) => setNuevo({ ...nuevo, [field]: e.target.value })}
                  />
                </div>
              ))}
              <Button onClick={agregar}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {fields.map((field) => (
              <TableHead key={field} className="capitalize">
                {field}
              </TableHead>
            ))}
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {fields.map((field) => (
                <TableCell key={field}>{item[field]}</TableCell>
              ))}
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminar(item.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
