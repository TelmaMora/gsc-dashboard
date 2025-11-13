// types.ts
export type AcopioRow = {
  id: string
  fechaCompra: string
  proveedor: string
  tipoCompra: string
  precioNegociado: number
  costoUnidad: number
  tipoTransporte: string
  gastosTransporte: number
  gastosOperativos: number
  viaticos: number
  totalCompra: number
  observaciones: string
}
