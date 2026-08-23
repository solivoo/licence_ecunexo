import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { applyEcuTheme, readStoredTheme } from '@/lib/ecuTheme'

export type UiThemeMode = 'light' | 'dark'

export type ThemeContextValue = {
  mode: UiThemeMode
  setMode: (mode: UiThemeMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [mode, setModeState] = useState<UiThemeMode>(() => readStoredTheme())

  const setMode = useCallback((next: UiThemeMode) => {
    setModeState(next)
    applyEcuTheme(next)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      applyEcuTheme(next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode, setMode, toggleMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider.')
  }
  return ctx
}
