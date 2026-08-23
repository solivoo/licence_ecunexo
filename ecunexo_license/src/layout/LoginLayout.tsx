import { Outlet } from 'react-router-dom'
import '@pages/auth/loginPage.css'

export function LoginLayout() {
  return (
    <main className="login-page login-page--dense">
      <div className="login-page__glow" aria-hidden />
      <div className="login-page__inner">
        <Outlet />
      </div>
    </main>
  )
}
