import type { User } from '@/types/user'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal, Shield, Trash } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type Props = {
    isAdmin: boolean | undefined
    handleDeleteUser: (user?: User) => void
}

export const tableColumns = ({isAdmin, handleDeleteUser}: Props) => { 
    const columns: ColumnDef<User>[] = [
      {
        id:'select', 
        header: ({table}) => (
          <Checkbox
            checked = {table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label = "Select all"
         /> 
        ),
        cell: ({row}) => (
          <Checkbox
            checked = {row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label = "Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'id',
        header: 'User ID',
        cell: ({row}) => <div className = "text-xs text-muted-foreground">{row.getValue('id')}</div>,
      },
      {
        accessorKey: 'username',
        header: ({ column }) => {
          return (
            <Button variant = "ghost" onClick = {() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              Username
              <ArrowUpDown className = "ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({row}) => <div className = "text-xs text-muted-foreground">{row.getValue('username')}</div>
      },
      {
        accessorKey: 'firstName',
        header: 'First name',
        cell: ({row}) => <div className = "text-xs text-muted-foreground">{row.getValue('firstName')}</div>
      },
      {
        accessorKey: 'lastName',
        header: 'Last name',
        cell: ({row}) => <div className = "text-xs text-muted-foreground">{row.getValue('lastName')}</div>
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({row}) => <div className = "text-xs text-muted-foreground">{row.getValue('email')}</div>
      },
      {
        accessorKey: 'isAdmin',
        header: 'Admin',
        cell: ({row}) => 
       <div className = 'flex justify-center'>
         {row.getValue('isAdmin') ? <Shield className = 'h-5 w-5 text-blue-500' /> : <div className = 'h-5 w-5'></div>}
       </div>
      },
            {
        accessorKey: 'createdAt',
        header: ({ column }) => {
          return (
            <Button variant = "ghost" onClick = {() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              Created At
              <ArrowUpDown className = "ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({row}) => {
          const date = new Date(row.getValue('createdAt'))
          return <div className = "text-xs text-muted-foreground">{date.toLocaleDateString()}</div>}
      },
      {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {isAdmin ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete user
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    
    ]
    return columns
}
