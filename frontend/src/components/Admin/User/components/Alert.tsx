import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { User } from '@/types/user'
import React from 'react'

type Props = {
    deleteTarget: {single?: User; multilple?: boolean} | null
    confirmDelete: () => void
    selectedCount: number
    deleteDialogOpen: boolean 
    setDeleteDialogOpen: (open:boolean) => void
}

const UserTableAlert: React.FC<Props> = ({
    deleteTarget,
    confirmDelete,
    selectedCount,
    deleteDialogOpen,
    setDeleteDialogOpen,
    } : Props) => {
    return (
        <AlertDialog open = {deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleteTarget?.single
                        ? `This will permanently delete the user "${deleteTarget?.single?.username}"`:
                        `This will permanently delete ${selectedCount} selected users.`}
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick = {confirmDelete} className = "bg-red-400 hover: bg:red-600">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UserTableAlert