import { BASE_PATH, PROFILE_INFO_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from '@/constants/routes'
import type { RootState } from '@/store/store'
import { Bell, Home, Search, UserCheck, UserPlus, UserRound,LogOutIcon } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useState } from 'react'
import { logout } from '@/store/slice/authSlice'
import { useAppDispatch } from '@/store/store'

const SideBar: React.FC = () => {
//profile
//login
//logout
//post
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        try {
            dispatch(logout()).unwrap();
            setLoading(true);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to log out');
        }
        setLoading(false);
    }

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    return (
    <div className = "fixed top-0 left-0 min-w-[150px] w-[10%] h-[100%] shadow-sm" >
        <div className = 'text-left p-4 text-5xl font-italianno'>PickMe</div>
        <Link to ={BASE_PATH} 
        className = 'px-5 py-2 flex items-center justify-start gap-2 hover:bg-zinc-400'
        >
            <Home size = {16}/>
            Home
        </Link>

        <Link to ={BASE_PATH} 
        className = 'px-5 py-2 flex items-center justify-start gap-2 hover:bg-zinc-400'
        >
            <Search size = {16}/>
            Search
        </Link>

        <Link to ={BASE_PATH} 
        className = 'px-5 py-2 flex items-center justify-start gap-2 hover:bg-zinc-300'
        >
            <Bell size = {16}/>
            Notification
        </Link>

        {
        isAuthenticated &&
            <Link to ={PROFILE_INFO_PATH} 
            className = 'px-5 py-2 flex items-center justify-start gap-2 hover:bg-zinc-400'
            >
                <UserRound size = {16}/>
                Profile
            </Link>
        }
        
        {!isAuthenticated && 
            <Link to ={SIGN_UP_PATH} 
            className = 'px-5 py-2 flex items-center justify-start gap-2 hover:bg-zinc-400'
            >
                <UserPlus size = {16}/>
                Sign up
            </Link>
        }
    
        {!isAuthenticated && 
            <Link to ={SIGN_IN_PATH} 
            className = 'px-5 py-2 flex items-center justify-start gap-2 hover:bg-zinc-400'
            >
                <UserCheck size = {16}/>
                Sign in
            </Link>
        }

        {isAuthenticated && 
            <Link to ={BASE_PATH} onClick = {(e) => {if(loading){e.preventDefault()}handleLogout(); }
        } 
            className = 'px-5 py-2 flex items-center justify-start gap-2 hover:bg-zinc-400'
            >
                <LogOutIcon size = {16}/>
                Log out
            </Link>
        }
        
    </div>
)
}

export default SideBar