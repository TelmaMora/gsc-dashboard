import DashboardLayout from "@/layouts/DashboardLayout"
import CatalogoCrud from "./CatalogoCrud"

export default function CatalogoPallets() {
  return (
    <DashboardLayout title="Catálogo de Pallets">
      <CatalogoCrud
        title="Pallets"
        endpoint="pallets"
        fields={["codigo", "caja", "cantidadCajas"]}
      />
    </DashboardLayout>
  )
}
