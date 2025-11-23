import { useNavigate } from 'react-router-dom'
import Nothing from '@/images/NotFound.png'
import { Button } from '@/components/ui/button'
import { BASE_PATH } from '@/constants/routes'
const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className = 'flex flex-col items-center justify-center min-h-screen text-center gap-4'>
            <img src = {Nothing} alt = 'error 404' className = 'size-[200px]' />
            <h1 className = "text-2xl font-bold">404 Not Found</h1>
            <p className = "text-sm text-zinc-400 ">The page you are looking for doesn't exist</p>
            <div className = "flex flex-row gap-4 justify justify-around p-5">
                <Button variant = "secondary" className = 'border-1' onClick = {() => navigate(-1)}>
                    Back
                </Button> 
                <Button className = 'border-1' onClick = {() => navigate(BASE_PATH, {replace: true})}>
                    Back to home    
                </Button>   
            </div>
        </div>
    )
}

export default NotFound