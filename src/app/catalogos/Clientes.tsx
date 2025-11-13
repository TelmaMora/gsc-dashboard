import DashboardLayout from "@/layouts/DashboardLayout"
import CatalogoCrud from "./CatalogoCrud"

export default function CatalogoClientes() {
  return (
    <DashboardLayout title="Clientes">
      <CatalogoCrud
        title="Clientes"
        endpoint="clientes"
        fields={[
          "razon_social",
          "rfc",
          "documentacion",
          "programas",
          "correo",
          "telefono",
        ]}
      />
    </DashboardLayout>
  )
}
