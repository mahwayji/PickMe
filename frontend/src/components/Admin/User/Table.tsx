import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

import { useSelector } from 'react-redux'
import { type RootState } from '@/store/store'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios'
import type { User } from '@/types/user'
import UserTableAlert from './components/Alert'
import { tableColumns } from './components/Column'
import UserDataController from './components/Controller'
import { CreateUserForm } from './components/Form/CreateUserForm'
import UserDataPagination from './components/Pagination'

type Props = {
  data: User[]
  setData: (data: User[]) => void
  fetchUsers: () => Promise<void>
}

export function UsersDataTable({ data, setData, fetchUsers }: Props) {
  const user = useSelector((state: RootState) => state.auth.user)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<{ single?: User; multiple?: boolean } | null>(null)

  const [openCreateUserDialog, setOpenCreateUserDialog] = React.useState(false)
 
  const resetSelection = () => {
    setRowSelection({})
  }

  const handleAddUser = () => {
    setOpenCreateUserDialog(true)
  }

  const handleDeleteUser = (user?: User) => {
    if (user) {
      setDeleteTarget({ single: user })
    } else {
      setDeleteTarget({ multiple: true })
    }
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget?.single) {
      try {
        await axiosInstance.delete(`/user/${deleteTarget.single.id}`)
        toast.success(`User ${deleteTarget.single.username} has been deleted`)
      } catch (error) {
        if (isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Something went wrong'
          toast.error(errorMessage)
        } else {
          toast.error('An unexpected error occurred')
        }
      }
    } else if (deleteTarget?.multiple) {
      const selectedRows = table.getSelectedRowModel().rows
      const selectedUsers = selectedRows.map((row) => row.original)
      const selectedIds = selectedUsers.map((user) => user.id)

      const failedUsers: string[] = []

      await Promise.all(
        selectedUsers.map(async (user) => {
          try {
            await axiosInstance.delete(`/user/${user.id}`)
          } catch {
            failedUsers.push(user.username)
          }
        }),
      )

      const successfullyDeleted = selectedUsers.length - failedUsers.length
      if (successfullyDeleted > 0) {
        toast.success(`${successfullyDeleted} user(s) have been deleted`)
      }
      if (failedUsers.length > 0) {
        toast.error(`Failed to delete: ${failedUsers.join(', ')}`)
      }

      // Update frontend data
      setData(data.filter((user) => !selectedIds.includes(user.id)))
    }

    setDeleteDialogOpen(false)
    resetSelection()
  }

  const handleRefreshData = async () => {
    await fetchUsers()
    resetSelection()
    toast.success('User data has been refreshed')
  }
  //const isAdmin = user?.isAdmin
  const isAdmin = true;
  const columns: ColumnDef<User>[] = tableColumns({
    isAdmin,
    handleDeleteUser,
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="w-full">
      <UserDataController
        selectedCount={selectedCount}
        table={table}
        handleRefreshData={handleRefreshData}
        handleDeleteUser={handleDeleteUser}
        handleAddUser={handleAddUser}
      />

      <div className="rounded-sm border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CreateUserForm open={openCreateUserDialog} setOpen={setOpenCreateUserDialog} data={data} setData={setData} />
      <UserDataPagination table={table} selectedCount={selectedCount} />
      <UserTableAlert
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
        selectedCount={selectedCount}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
    </div>
  )
}