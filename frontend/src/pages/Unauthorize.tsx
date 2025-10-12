import { useNavigate } from "react-router-dom"
import Unauthorized from '@/images/Unauthorized.gif'
import { Button } from "@/components/ui/button"
import { BASE_PATH } from "@/constants/routes"
const Unauthorize = () => {
    const navigate = useNavigate()

    return (
        <div className = 'flex flex-col items-center justify-center min-h-screen text-cneter gap-4'>
            <img src = {Unauthorized} alt = 'unauthorized 401' className = 'size-[200px]' />
            <h1 className = 'text-2xl font-bold'>401 Unauthorized Access!</h1>
            <div className = 'flex flex-row gap-4 justify justify-around p-5'>
                <Button variant = 'secondary' className=  'border-1' onClick = {() => navigate(-1)}>
                    Back
                </Button>
                <Button className = 'border-1' onClick = {() => navigate(BASE_PATH, {replace: true})}>
                    Back to home
                </Button>
            </div>
        </div>
    )
}

export default Unauthorize