import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import 'glubox/style.css'
import 'glubox/themes/index.css'
import './index.css'
import { ToastProvider } from 'glubox'
import { configurePlatformApi } from '@/lib/configurePlatformApi'
import { applyGluTheme, readStoredTheme, readStoredThemePreset } from '@/lib/ecuTheme'
import { router } from '@/router'
import { store } from '@/store'
import { hydrateFromStorage } from '@/store/platformAuthSlice'
import { ThemeProvider } from '@/theme/ThemeProvider'

applyGluTheme(readStoredThemePreset(), readStoredTheme())

configurePlatformApi(store)
store.dispatch(hydrateFromStorage())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
)
