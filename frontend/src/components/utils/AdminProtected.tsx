import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { BASE_PATH } from '@/constants/routes'
import Loading from '@/pages/Loading'
import NotFound from '@/pages/NotFound'

const AdminProtected: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth)
  console.log(isAuthenticated, user, isLoading)


  if (!isAuthenticated || (user && !user.isAdmin && !user.isSuperAdmin)) {
    return <Navigate to={BASE_PATH} replace />
  }

    if (isLoading) {
    return <Loading />
  }

  if (!user) return (<NotFound />)
  return <Outlet />
}

export default AdminProtected