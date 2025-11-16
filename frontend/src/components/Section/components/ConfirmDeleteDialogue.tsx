import type { Dispatch, SetStateAction } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Props = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    onConfirm: () => void 
}

export const ConfirmDeleteDialogue: React.FC<Props> = ({ open, setOpen,onConfirm}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[300px] w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-normal text-lg text-black-1000 text-center">Delete Section</AlertDialogTitle>
          <AlertDialogDescription className="font-light text-sm text-black-1000 text-center">
            This action will the selected section and all its contents from your profile. <br />{' '}<span className="text-red-600 font-md">You cannot undo this action.</span>{' '}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel
            className="border font-light rounded-3xl bg-white text-zinc-700 px-4 py-2 cursor-pointer"
          >CANCEL</AlertDialogCancel>
          <AlertDialogAction
            className="border font-light rounded-3xl bg-red-600 text-white px-4 py-2 cursor-pointer"
            onClick={onConfirm}
          >
            DELETE
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
