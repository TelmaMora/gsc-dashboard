import DashboardLayout from "@/layouts/DashboardLayout"
import CatalogoCrud from "./CatalogoCrud"

export default function CatalogoProveedores() {
  return (
    <DashboardLayout title="Catálogo de Proveedores">
      <CatalogoCrud
        title="Proveedores"
        endpoint="proveedores"
        fields={["codigo", "nombre", "telefono", "zona", "tipo", "documentacion", "extension"]}
      />
    </DashboardLayout>
  )
}
