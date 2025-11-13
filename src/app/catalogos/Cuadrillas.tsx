import DashboardLayout from "@/layouts/DashboardLayout"
import CatalogoCrud from "./CatalogoCrud"

export default function CatalogoCuadrillas() {
  return (
    <DashboardLayout title="Catálogo de Cuadrillas">
      <CatalogoCrud
        title="Cuadrillas"
        endpoint="cuadrillas"
        fields={["codigo", "nombre", "telefono", "costoPorKilo", "zona"]}
      />
    </DashboardLayout>
  )
}
