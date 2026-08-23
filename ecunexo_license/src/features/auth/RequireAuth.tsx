import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/platformAuthSlice'

export function RequireAuth() {
  const location = useLocation()
  const isAuthed = useAppSelector(selectIsAuthenticated)

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
