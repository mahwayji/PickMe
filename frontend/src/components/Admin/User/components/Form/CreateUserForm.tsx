import type { User } from '@/types/user'
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
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
    open: boolean
    setOpen: (open:boolean) => void
    data: User[]
    setData: (data:User[]) => void
}

const formScheme = z.object({
    username: z.string().min(1, 'Username is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional(),
    email: z.string().min(1, 'Email is required')      .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address'),
    admin: z.boolean(),
    password: z    .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[\W_]/, 'Password must contain at least one special character (e.g., !@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

export const CreateUserForm: React.FC<Props> = ({open, setOpen, data, setData} : Props) => {
const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        admin: false,
        password: '',
        confirmPassword: '',
    }
})

const onSubmit = async (values: z.infer<typeof formScheme>) => {
    const newUser = {
        username: values.username, 
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        isAdmin: values.admin,
        password: values.password,
    }
    console.log(newUser)
    try {
        const res = await axiosInstance.post('/user', newUser)
        setData([...data, res.data])
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
                <DialogTitle>Create user</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit = {form.handleSubmit(onSubmit)} className = 'flex flex-col gap-4 mt-6'>
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

                <FormField 
                    control={form.control}
                    name = "email"
                    render = {({field}) => (
                        <FormItem>
                            <label htmlFor="email">Email Address</label>
                            <FormControl>
                                <Input placeholder = "Email" {...field} />
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
                    name = "admin"
                    render = {({field}) => (
                        <FormItem className = "flex gap-2 items-center">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange = {field.onChange} />
                            </FormControl>
                                <label htmlFor ="admin">Admin</label>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField 
                    control={form.control}
                    name = "password"
                    render = {({field}) => (
                        <FormItem>
                            <label htmlFor="password">Password</label>
                            <FormControl>
                                <Input type = 'password' placeholder = "Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField 
                    control={form.control}
                    name = "confirmPassword"
                    render = {({field}) => (
                        <FormItem>
                            <label htmlFor="ConfirmPassword">Confirm Password</label>
                            <FormControl>
                                <Input type = "password" placeholder = "Confirm Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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

