import { BASE_PATH, PROFILE_INFO_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from '@/constants/routes'
import type { RootState } from '@/store/store'
import { Bell, Home, Search, UserCheck, UserPlus, UserRound } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const SideBar: React.FC = () => {
//profile
//login
//logout
//post

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    return (
    <div className = "fixed top-0 left-0 min-w-[150px] w-[10%] h-[100%] shadow-sm">
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
        
    </div>
)
}

export default SideBar