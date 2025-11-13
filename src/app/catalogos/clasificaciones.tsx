import DashboardLayout from "@/layouts/DashboardLayout"
import CatalogoCrud from "./CatalogoCrud"

export default function CatalogoClasificaciones() {
  return (
    <DashboardLayout title="Catálogo de Clasificaciones">
      <CatalogoCrud
        title="Clasificaciones"
        endpoint="clasificaciones"
        fields={["codigo", "clasificacion", "gramaje"]}
      />
    </DashboardLayout>
  )
}
