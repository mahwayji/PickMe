import { z } from 'zod'
import { useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import React, { useEffect } from 'react'

import { axiosInstance } from '@/lib/axios'
import type { Section } from "@/types/section";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import {ConfirmDeleteDialogue} from '@/components/Section/components/ConfirmDeleteDialogue'


type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    data: Section[]
    setData: React.Dispatch<React.SetStateAction<Section[]>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    userId: string
    sectionId: string
}
const formSchema = z.object({
    title: z.string().min(1, '**Title is required'),
    description: z.string().min(1, '**Description is required'),
    coverMediaId: z.any().optional(),
})



export const EditSectionForm: React.FC<Props> = ({ open, setOpen, data, setData,setLoading, userId, sectionId }: Props) => {

    const [isConfirmDeleteOpen,setIsconfirmDeleteOpen] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            coverMediaId: '',
        },
    })

    const fetchSectionById = async () => {
        try {
            const res = await axiosInstance.get(`/section/${sectionId}`);

            form.reset({
                title: res.data.title,
                description: res.data.description,
                coverMediaId: res.data.coverMediaId,
            })
        } catch (error) {
            console.error('Error fetching section by ID:', error);
        }
    }

    useEffect(() => {
        if (sectionId) {
            console.log('Fetching section data for ID:', sectionId);
            fetchSectionById()
    }
  }, [sectionId])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        toast.success('Updating section...')
        setLoading(true);
        try {
            console.log('Updating section with values:', values);
            if (!userId) {
                toast.error('Log in is required to create a section')
                return
            }
            const res = await axiosInstance.patch(`/section/update/${sectionId}`, values)
            setData([...data, res.data])
            toast.success('Section updated successfully')
            setLoading(false);
            setOpen(false)
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to update section')
            } else {
                toast.error('Failed to update section')
            }
        }
    }

    const onDelete = async () => {
        toast.success('Deleting section...')
        setLoading(true);
        try {
            if (!userId) {
                toast.error('Log in is required to delete create a section')
                return
            }
            await axiosInstance.delete(`/section/delete/${sectionId}`)
            toast.success('Section deleted successfully')
            setLoading(false);
            setOpen(false)
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to update section')
            } else {
                toast.error('Failed to delete section')
            }
        }
    }


    return (
    <>
    {/* Confirm Delete Dialog */}
    <ConfirmDeleteDialogue
      open={isConfirmDeleteOpen}
      setOpen={setIsconfirmDeleteOpen}
      onConfirm={onDelete}
    />

    {/* Section exists → show edit form */}
    {sectionId ? (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-full [&>button]:hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <DialogHeader>
                <div className="flex items-center w-full space-x-2 justify-between">
                  <div className="flex justify-center items-center space-x-2">
                    <X
                      className="cursor-pointer stroke-1 hover:stroke-1.6"
                      onClick={() => setOpen(false)}
                    />
                    <DialogTitle className="font-light text-lg text-black-1000">
                      Edit Section
                    </DialogTitle>
                  </div>

                  <Button
                    type="submit"
                    className="border font-light rounded-3xl bg-black text-white px-4 py-2 cursor-pointer"
                  >
                    SAVE
                  </Button>
                </div>
              </DialogHeader>

              {/* coverMediaId */}
              <FormField
                control={form.control}
                name="coverMediaId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-100% h-36">
                        <Input
                          id="coverMediaId"
                          type="file"
                          className="peer border-dashed border-1 rounded-lg px-3 pt-5 pb-2 w-full h-full text-gray-700 border-gray-700 bg-transparent"
                          {...field}
                          value={undefined}
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null
                            field.onChange(file)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="italic text-red-600 font-normal pl-1" />
                  </FormItem>
                )}
              />

              {/* title */}
              <FormField
                control={form.control}
                name="title"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-100% h-12">
                        <Input
                          id="title"
                          {...form.register("title")}
                          placeholder=" "
                          maxLength={50}
                          className="peer border rounded-lg px-3 pt-5 pb-2 w-full h-full text-gray-700 border-gray-700 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                        <Label
                          htmlFor="title"
                          className="absolute top-1 left-3 text-gray-500 text-xs transition-all font-normal
                          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
                          peer-focus:top-1 peer-focus:text-xs"
                        >
                          Title
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage className="italic text-red-600 font-normal pl-1" />
                  </FormItem>
                )}
              />

              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-100% h-36">
                        <textarea
                          id="description"
                          {...form.register("description")}
                          placeholder=" "
                          maxLength={250}
                          className="peer border rounded-lg px-3 pt-5 pb-2 h-36 text-sm w-full text-gray-700 border-gray-700 
                          focus-visible:ring-transparent resize-none focus-visible:outline-none"
                        />
                        <Label
                          htmlFor="description"
                          className="absolute top-1 left-3 text-gray-500 text-xs transition-all font-normal
                          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
                          peer-focus:top-1 peer-focus:text-xs"
                        >
                          Description
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage className="italic text-red-600 font-normal pl-1" />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setIsconfirmDeleteOpen(true)}
                  className="border font-light rounded-3xl bg-red-600 text-white px-4 py-2 cursor-pointer"
                >
                  DELETE
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    ) : (
      /* No Section Case */
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-full [&>button]:hidden">
          <Label className="font-normal text-lg text-black-1000 text-center">
            No section selected to edit.
          </Label>
        </DialogContent>
      </Dialog>
    )}
  </>
)
}
