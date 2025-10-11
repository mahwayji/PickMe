import { Button } from '@/components/ui/button'
import type { User } from '@/types/user'
import { type Table } from '@tanstack/react-table'

type Props = {
  table: Table<User>
  selectedCount: number
}

const UserDataPagination: React.FC<Props> = ({ table, selectedCount }: Props) => {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        {selectedCount} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default UserDataPagination