import DashboardLayout from "@/layouts/DashboardLayout"
import CatalogoCrud from "./CatalogoCrud"

export default function CatalogoTransporte() {
  return (
    <DashboardLayout title="Catálogo de Transporte">
      <CatalogoCrud
        title="Transportes"
        endpoint="transportes"
        fields={["codigo", "nombre", "transportesDisponibles", "numero", "constancia"]}
      />
    </DashboardLayout>
  )
}
