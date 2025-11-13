import DashboardLayout from "@/layouts/DashboardLayout"
import CatalogoCrud from "./CatalogoCrud"

export default function CatalogoProgramas() {
  return (
    <DashboardLayout title="Catálogo de Programas">
      <CatalogoCrud
        title="Programas"
        endpoint="programas"
        fields={["nombre", "tipoEmpaque", "kilosPorCaja", "gramajeMin", "gramajeMax"]}
      />
    </DashboardLayout>
  )
}
