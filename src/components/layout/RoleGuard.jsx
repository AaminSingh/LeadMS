import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

function RoleGuard({ allowedRoles, children }) {
  const user = useAuthStore((state) => state.user)

  if (user && allowedRoles.includes(user.role)) {
    return children || <Outlet />
  }

  return <Navigate to="/app/dashboard" replace />
}

export default RoleGuard
