import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Suspense, useEffect, useState } from 'react'
import Loading from './pages/Loading'
import { ADMIN_DASHBOARD_PATH, BASE_PATH, NOT_FOUND_PATH, PROFILE_INFO_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from './constants/routes'
import { Toaster } from 'sonner'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import AdminDashBoard from './pages/Admin/DashBoard'
import NotFound from './pages/NotFound'
import AdminProtected from './components/utils/AdminProtected'
import { axiosInstance } from './lib/axios'
import ServerDown from './pages/ServerDown'

function App() {
  const [isServerDown, setServerDown] = useState<boolean>(false)
  useEffect(() => {
    axiosInstance
      .get('/health')
      .then(() => setServerDown(false))
      .catch(() => setServerDown(true))
  }, [])

  if (isServerDown) return <ServerDown />
  
  return (
    <Suspense fallback = {<Loading/>} >
      <Toaster />
        <div className = 'flex flex-col min-h-screen'>
            <main className = "flex-1">
                <Routes>
                    <Route path = {BASE_PATH} element = {<Home/>} />
              
                    <Route path = {PROFILE_INFO_PATH} element = {<Profile />} />
              
                    <Route path = {SIGN_IN_PATH} element={<SignIn />} />
                    <Route path = {SIGN_UP_PATH} element={<SignUp />} /> 
              
                    {/* Admin */}
                    {/* <Route element = {<AdminProtected />}>
                      <Route path = {ADMIN_DASHBOARD_PATH} element={<AdminDashBoard />} />         
                    </Route> */}
              
                                    <Route path = {ADMIN_DASHBOARD_PATH} element={<AdminDashBoard />} />         
                    <Route path = {NOT_FOUND_PATH} element={<NotFound />} />
                    
                </Routes>
            </main>
        </div>
    </Suspense>
  
  )
}

export default App
