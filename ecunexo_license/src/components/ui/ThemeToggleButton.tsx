import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/theme/ThemeProvider'

export type ThemeToggleButtonProps = {
  readonly className?: string
}

/** Alterna tema claro / oscuro (icono luna / sol). */
export function ThemeToggleButton({ className = '' }: ThemeToggleButtonProps) {
  const { mode, toggleMode } = useTheme()
  const isDark = mode === 'dark'
  const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      className={`platform-shell__icon-btn ecu-theme-toggle--icon ${className}`.trim()}
      onClick={toggleMode}
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden size={20} strokeWidth={1.75} />
    </button>
  )
}
