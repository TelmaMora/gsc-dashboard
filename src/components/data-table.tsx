import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react"

import { flexRender } from "@tanstack/react-table"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useTable } from "./use-table"

export function DataTable({
  tabs = [],
  columns,
  data,
  pageSizeOptions = [10, 20, 30, 50],
  onAddSection,
  onCustomizeColumns,
}: {
  tabs: { value: string; label: string; badge?: number }[]
  columns: any[]
  data: any[]
  pageSizeOptions?: number[]
  onAddSection?: () => void
  onCustomizeColumns?: (cols: any) => void
}) {
  // inicializa la tabla dinámica con paginación
  const table = useTable({ data, columns })

  return (
    <Tabs defaultValue={tabs[0]?.value} className="w-full flex-col gap-6">
      {/* Header superior */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/* Selector en pantallas pequeñas */}
        <Select defaultValue={tabs[0]?.value}>
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Lista de tabs (modo escritorio) */}
        <TabsList className="hidden @4xl/main:flex">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {tab.badge && <Badge variant="secondary">{tab.badge}</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Mostrar Columnas</span>
                <span className="lg:hidden">Columnas</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table.getAllColumns().map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible?.()}
                  onCheckedChange={(v) => column.toggleVisibility?.(!!v)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={onAddSection}>
            <IconPlus />
            <span className="hidden lg:inline">Nuevo Registro</span>
          </Button>
        </div>
      </div>

      {/* Contenido dinámico de cada tab */}
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          {tab.value === "outline" ? (
            <>
              {/* Tabla */}
              <div className="overflow-hidden rounded-lg border">
                <DndContext collisionDetection={closestCenter}>
                  <SortableContext
                    items={data.map((d) => d.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table>
                      <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <TableHead key={header.id}>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </SortableContext>
                </DndContext>
              </div>

              {/* 🔹 Paginación */}
              <div className="flex items-center justify-between px-4 py-3 border-t bg-background">
                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} columna(s) seleccionada(s).
                </div>

                <div className="flex w-full items-center gap-8 lg:w-fit">
                  <div className="hidden items-center gap-2 lg:flex">
                    <label
                      htmlFor="rows-per-page"
                      className="text-sm font-medium"
                    >
                      Registros por página
                    </label>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) =>
                        table.setPageSize(Number(value))
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        className="w-20"
                        id="rows-per-page"
                      >
                        <SelectValue
                          placeholder={table.getState().pagination.pageSize}
                        />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {pageSizeOptions.map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex w-fit items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </div>

                  <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to first page</span>
                      <IconChevronsLeft />
                    </Button>
                    <Button
                      variant="outline"
                      className="size-8"
                      size="icon"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <IconChevronLeft />
                    </Button>
                    <Button
                      variant="outline"
                      className="size-8"
                      size="icon"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to next page</span>
                      <IconChevronRight />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden size-8 lg:flex"
                      size="icon"
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to last page</span>
                      <IconChevronsRight />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
