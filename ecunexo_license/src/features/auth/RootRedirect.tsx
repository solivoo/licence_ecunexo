import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/platformAuthSlice'

export function RootRedirect() {
  const isAuthed = useAppSelector(selectIsAuthenticated)
  return <Navigate to={isAuthed ? '/app/inicio' : '/login'} replace />
}
