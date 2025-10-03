import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { BASE_PATH } from '@/constants/routes'
import Loading from '@/pages/Loading'

const AdminProtected: React.FC = () => {
  const { isAuthenticated: _isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth)

  if (isLoading) {
    return <Loading />
  }

  if (user && !user.isAdmin && !user.isSuperAdmin) {
    return <Navigate to={BASE_PATH} replace />
  }

  return <Outlet />
}

export default AdminProtected