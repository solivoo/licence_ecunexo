import { useTheme } from '@/theme/ThemeProvider'

/** Tema de componente gluBox alineado con `data-mode` global. */
export function useGluComponentTheme(): 'light' | 'dark' {
  const { mode } = useTheme()
  return mode
}
