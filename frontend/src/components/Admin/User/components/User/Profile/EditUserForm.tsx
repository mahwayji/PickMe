import {z} from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { axiosInstance } from '@/lib/axios';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Visibility, visibilityOption, type UserProfile } from '@/types/userProfile';

type Props = {
    open: boolean
    setOpen: (open:boolean) => void
    data: UserProfile
    setData: (data:UserProfile) => void
}

const formScheme = z.object({
    username: z.string().min(1, 'Username is required'),
    firstName: z.string().optional(),
    lastName: z.any().optional(),
    description: z.any().optional(),
    profileImage: z.any().optional(),
    location: z.any().optional(),
    visibility: z.any()
})

export const EditUserForm: React.FC<Props> = ({open, setOpen, data, setData} : Props) => {
const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        description: data.description,
        location: data.location,
        visibility: Visibility[data.visibility],
        profileImage: undefined
    }
})

const onSubmit = async (values: z.infer<typeof formScheme>) => {
    const formData = new FormData();

    formData.append("username", values.username);
    formData.append("firstName", values.firstName || "");
    formData.append("lastName", values.lastName || "");
    formData.append("description", values.description || "");
    formData.append("location", values.location || "");
    formData.append("visibility", Visibility[values.visibility]);

    if (values.profileImage) {
        formData.append("profileImage", values.profileImage);
    }

    console.log(formData)
    try {
        const res = await axiosInstance.patch(
            `profile/${data.id}`,
            formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        setData(res.data)
        toast("Update profile successfully!")
    } catch(error) {
        if(isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || "Something went wrong"
            toast.error(errorMessage)
        } else {
            toast.error('An unexpected error occurred')
        }
    }
    setOpen(false)
}
    return (
    <Dialog open = {open} onOpenChange={setOpen}>
        <DialogContent className = 'sm:max-w-[600px] max-h-[900px] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>Update Profile</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit = {form.handleSubmit(onSubmit)} className = 'flex flex-col gap-4 mt-6'>
                <FormField
                    control={form.control}
                    name="profileImage" 
                    render={({ field }) => (
                    <FormItem>
                        <label htmlFor="profileImage">Upload Profile Image</label>
                        <FormControl>
                            <div className="relative w-100% h-36">
                                <Input
                                    id='profileImage'
                                    type='file'
                                    className="peer border-dashed border-1 rounded-lg px-3 pt-5 pb-2 w-full h-full text-gray-700 border-gray-700 bg-transparent "
                                    {...field}
                                    value={undefined} 
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        field.onChange(file);
                                    if (file) {
                                        console.log("File selected:", file.name);
                                    } else {
                                    console.log("File selection canceled.");
                                    }
                                    }}
                                />
                            </div>
                        </FormControl>
                        <FormMessage className='italic text-red-600 font-normal pl-1'/>
                    </FormItem>
                    )} 
                />

                <FormField 
                    control={form.control}
                    name = "username"
                    render = {({field}) => (
                        <FormItem>
                            <label htmlFor="username">Username</label>
                            <FormControl>
                                <Input placeholder = "username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className = "flex flex-col md:grid grid-cols-2 gap-4">
                    <FormField 
                        control={form.control}
                        name = "firstName"
                        render = {({field}) => (
                            <FormItem>
                                <label htmlFor="username">First Name</label>
                                <FormControl>
                                    <Input placeholder = "First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name = "lastName"
                        render = {({field}) => (
                            <FormItem>
                                <label htmlFor="lastName">Last Name</label>
                                <FormControl>
                                    <Input placeholder = "Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField 
                        control={form.control}
                        name = "description"
                        render = {({field}) => (
                            <FormItem>
                                <label htmlFor="description">Description</label>  
                                <FormControl>
                                    <Input placeholder = "Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                <div className = 'flex flex-col md:grid grid-cols-2 gap-4'>
                    <FormField 
                        control={form.control}
                        name = "location"
                        render = {({field}) => (
                            <FormItem>
                                <label htmlFor="location">Location</label>  
                                <FormControl>
                                    <Input placeholder = "Location" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control = {form.control}
                        name = "visibility"
                        render={({field}) => (
                            <FormItem>
                                <label htmlFor="visibility">Visibility</label>
                                <FormControl>
                                    <select 
                                    className = "border rounded-md px-3 py-2 text-sm block w-full"
                                    value={field.value}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    >
                                        {visibilityOption.map((option) => (
                                        <option key={option.label} value={option.value}>
                                            {option.label}
                                        </option>
                                        ))}
                                    </select>

                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <DialogFooter>
                    <Button type = "submit" size = "sm">
                        Create
                    </Button>
                </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

