import DashboardLayout from "@/layouts/DashboardLayout"
import CatalogoCrud from "./CatalogoCrud"

export default function CatalogoCajas() {
  return (
    <DashboardLayout title="Catálogo de Cajas">
      <CatalogoCrud
        title="Cajas"
        endpoint="cajas"
        fields={["codigo", "tipo", "kilos_por_caja"]}
      />
    </DashboardLayout>
  )
}
