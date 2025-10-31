import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SIGN_IN_PATH,BASE_PATH } from '@/constants/routes';
import axios from 'axios';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/store';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '@/constants/cookie';
import { googleLoginSuccess } from '@/store/slice/authSlice';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const formScheme = z.object({
  email: z.string().min(1, 'Username in required'),
  password: z.string()
          .min(8, 'Password must be at least 8 characters')
          .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
          .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .regex(/[0-9]/, 'Password must contain at least one number')
          .regex(/[\W_]/, 'Password must contain at least one special character (e.g., !@#$%^&*)'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })
const SignUp: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    }
  })
  const [loading, setLoading] = useState(false);
  const [, setCookie] = useCookies([ACCESS_TOKEN]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    const newUser = {
      email:values.email,
      password: values.password,
    }
    setLoading(true);
    
    try{
      await axiosInstance.post('/auth/signup', newUser);
      toast.success('Sign up successful! Please sign in.');
      navigate(SIGN_IN_PATH, { replace: true });

    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Sign up failed'
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
    setLoading(false); 
  };

 useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const success = urlParams.get('success');
    const email = urlParams.get('email');
    const checkGoogleLogin = async () => {
      if (success === 'true' && token && email) {
        try {
          setCookie(ACCESS_TOKEN, token, { path: '/', httpOnly: false});         
          dispatch(googleLoginSuccess({ 
              user: {
                  email: email,
                  username:'',
                  firstName: '',
                  lastName: '',
                  isAdmin: false,
              }
          }));
          
          window.history.replaceState({}, document.title, SIGN_IN_PATH);

          toast.success('Google sign-in successful!');
          navigate(BASE_PATH, { replace: true });
        } catch (error) {
          console.error('Google login failed', error);
          toast.error('Google sign-in failed. Please try again.');
          navigate(SIGN_IN_PATH, { replace: true });
        }
      }   
      };

  checkGoogleLogin();

  }, [setCookie, navigate]); 

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-5xl font-italianno mb-8 text-foreground">PickMe</h1>
        
        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-semibold text-center mb-8 text-card-foreground">Sign up</h2>
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4"
              onClick={()=> window.location.href = `http://localhost:8080/api/v2/auth/google` 
              }
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              continue with google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit = {form.handleSubmit(onSubmit)} className = 'flex flex-col space-y-4'>
                <FormField
                  control = {form.control}
                  name = 'email'
                  render = {({field}) => (
                    <FormItem>
                        <FormControl>
                          <Input placeholder = "email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                  />
                 <FormField 
                  control={form.control}
                  name = "password"
                  render = {({field}) => (
                      <FormItem>
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
                          <FormControl>
                              <Input type = "password" placeholder = "Confirm Password" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <Button type = "submit" className = 'w-full' disabled = {loading}>
                Continue
              </Button>
              </form>
            </Form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to= {SIGN_IN_PATH} className="text-foreground underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp
