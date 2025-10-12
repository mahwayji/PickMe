import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import Loading from '@/pages/Loading'
import Unauthorize from '@/pages/Unauthorize'

const AdminProtected: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth)
  console.log(isAuthenticated, user, isLoading)
  
  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated || (user && !user.isAdmin)) {
    return <Unauthorize/>
  }

  if (!user) return (<Unauthorize />)

  return <Outlet />
}

export default AdminProtected