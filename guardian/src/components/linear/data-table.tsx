'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  Row,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight, ChevronUp, Filter, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  onRowClick?: (row: Row<TData>) => void
  showPagination?: boolean
  pageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onRowClick,
  showPagination = true,
  pageSize = 25,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const rows = table.getRowModel().rows
      const selectedRowIds = Object.keys(rowSelection)
      
      if (selectedRowIds.length === 1) {
        const currentIndex = rows.findIndex(row => row.id === selectedRowIds[0])
        
        if (e.key === 'ArrowDown' && currentIndex < rows.length - 1) {
          e.preventDefault()
          setRowSelection({ [rows[currentIndex + 1].id]: true })
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          e.preventDefault()
          setRowSelection({ [rows[currentIndex - 1].id]: true })
        } else if (e.key === 'Enter' && onRowClick) {
          e.preventDefault()
          onRowClick(rows[currentIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [rowSelection, table, onRowClick])

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background-secondary border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider",
                      header.column.getCanSort() && "cursor-pointer select-none hover:text-text-primary transition-colors duration-fast"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <div className="text-text-tertiary">
                          {header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown size={14} />
                          ) : header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronUp size={14} className="opacity-30" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "transition-colors duration-fast cursor-pointer",
                    "hover:bg-background-secondary/50",
                    row.getIsSelected() && "bg-accent/5",
                    hoveredRow === row.id && "bg-background-secondary/30"
                  )}
                  onClick={() => {
                    setRowSelection({ [row.id]: true })
                    onRowClick?.(row)
                  }}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-text-primary"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-text-tertiary"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-text-secondary">
            Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-fast",
                "hover:bg-background-secondary",
                !table.getCanPreviousPage() && "opacity-50 cursor-not-allowed"
              )}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                .filter((page) => {
                  const current = table.getState().pagination.pageIndex + 1
                  return page === 1 || 
                         page === table.getPageCount() || 
                         Math.abs(page - current) <= 1
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="text-text-tertiary">...</span>
                    )}
                    <button
                      onClick={() => table.setPageIndex(page - 1)}
                      className={cn(
                        "w-8 h-8 text-sm font-medium rounded-md transition-colors duration-fast",
                        table.getState().pagination.pageIndex === page - 1
                          ? "bg-accent text-white"
                          : "hover:bg-background-secondary text-text-secondary"
                      )}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-fast",
                "hover:bg-background-secondary",
                !table.getCanNextPage() && "opacity-50 cursor-not-allowed"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
