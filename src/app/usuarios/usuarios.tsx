import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import DashboardLayout from "@/layouts/DashboardLayout"
import { Badge } from "@/components/ui/badge"

interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: string
  activo: boolean
  createdAt?: string
}

export default function CatalogoUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [nuevo, setNuevo] = useState({
    nombre: "",
    correo: "",
    rol: "operador",
  })
  const [open, setOpen] = useState(false)
  const [passwordGenerado, setPasswordGenerado] = useState<string | null>(null)

  const endpoint = "usuarios"
  const API_URL = `http://localhost:4000/api/${endpoint}`

  // 📡 Cargar usuarios
  const cargarDatos = async () => {
    const res = await fetch(API_URL)
    const json = await res.json()
    setUsuarios(json)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // ➕ Crear usuario
  const agregar = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    })
    const data = await res.json()
    setPasswordGenerado(data.password_generado)
    setNuevo({ nombre: "", correo: "", rol: "operador" })
    cargarDatos()
  }

  // 🗑️ Eliminar usuario
  const eliminar = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" })
    cargarDatos()
  }

  return (
    <DashboardLayout title="Gestión de Usuarios">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nuevo usuario</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar usuario</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={nuevo.nombre}
                  onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                />
              </div>

              <div>
                <Label>Correo electrónico</Label>
                <Input
                  type="email"
                  value={nuevo.correo}
                  onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })}
                />
              </div>

              <div>
                <Label>Rol</Label>
                <Select
                  value={nuevo.rol}
                  onValueChange={(value) => setNuevo({ ...nuevo, rol: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="operador">Operador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={agregar}>Guardar</Button>

              {passwordGenerado && (
                <div className="bg-green-100 text-green-800 p-2 rounded mt-2 text-sm">
                  <strong>Contraseña generada:</strong> {passwordGenerado}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {usuarios.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>{u.correo}</TableCell>
              <TableCell className="capitalize">{u.rol}</TableCell>
              <TableCell>
                {u.activo ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    Inactivo
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminar(u.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardLayout>
  )
}
