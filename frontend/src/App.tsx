import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import { Suspense, useEffect, useState } from 'react'
import Loading from './pages/Loading'
import { ADMIN_DASHBOARD_PATH, BASE_PATH, NOT_FOUND_PATH, PROFILE_INFO_PATH,
         SIGN_IN_PATH, SIGN_UP_PATH, 
         ITEM_CREATE_PATH, ITEM_EDIT_PATH, } from './constants/routes'
import { toast, Toaster } from 'sonner'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import AdminDashBoard from './pages/Admin/DashBoard'
import CreateItemModal from './pages/Item/CreateItemModal'
import EditItemPage from './pages/Item/EditItemPage'
import NotFound from './pages/NotFound'
import { axiosInstance } from './lib/axios'
import ServerDown from './pages/ServerDown'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { useCookies } from 'react-cookie'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AdminProtected from './components/utils/AdminProtected'
import { useAppDispatch } from './store/store'
import { ACCESS_TOKEN } from './constants/cookie'
import { me } from './store/slice/authSlice'

function App() {
  const [isServerDown, setServerDown] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [cookie, ,removeCookie] = useCookies([ACCESS_TOKEN])
  
  useEffect(() => {
    if (cookie[ACCESS_TOKEN]) {
      try {
        dispatch(me(cookie[ACCESS_TOKEN]))
      } catch (error) {
        toast.error(error as string)
        removeCookie(ACCESS_TOKEN)
        navigate(SIGN_IN_PATH, { replace: true })
      }
    }
  }, [cookie, dispatch, removeCookie, navigate])
  
  useEffect(() => {
    axiosInstance
      .get('/health')
      .then(() => setServerDown(false))
      .catch(() => setServerDown(true))
  }, [])

  if (isServerDown) return <ServerDown />

  const location = useLocation()
  const state = location.state as { background?: Location } | undefined
  const background = state?.background

  return (
    <Suspense fallback = {<Loading/>} >
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <TooltipProvider>
        <Toaster />
          <div className = 'flex flex-col min-h-screen'>
              <main className = "flex-1">
                <Routes location={background || location}>
                    <Route path = {BASE_PATH} element = {<Home/>} />
              
                    <Route path = {PROFILE_INFO_PATH} element = {<Profile />}/>
              
                    <Route path = {SIGN_IN_PATH} element={<SignIn />} />
                    <Route path = {SIGN_UP_PATH} element={<SignUp />} /> 
              
                    {/* Admin */}
                    <Route element = {<AdminProtected />}>
                      <Route path = {ADMIN_DASHBOARD_PATH} element={<AdminDashBoard />} />         
                    </Route>

                    <Route path={ITEM_EDIT_PATH} element={ <EditItemPage/>} />
              
                    <Route path = {NOT_FOUND_PATH} element={<NotFound />} />
                </Routes>

                {background && (
                  <Routes>
                    <Route path={ITEM_CREATE_PATH} element={<CreateItemModal />} />
                  </Routes>
                )}
              </main>
          </div>
      </TooltipProvider>
      </GoogleOAuthProvider>
    </Suspense>
  )
}

export default App
