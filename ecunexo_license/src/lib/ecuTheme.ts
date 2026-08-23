export type GluThemePreset = 'default' | 'modern' | 'enterprise'
export type EcuThemeMode = 'light' | 'dark'

const MODE_STORAGE_KEY = 'ecunexo.ui.theme'
const PRESET_STORAGE_KEY = 'ecunexo.glu.theme.preset'
const DEFAULT_PRESET: GluThemePreset = 'default'

export function readStoredThemePreset(): GluThemePreset {
  try {
    const raw = localStorage.getItem(PRESET_STORAGE_KEY)
    if (raw === 'default' || raw === 'modern' || raw === 'enterprise') return raw
  } catch { /* ignore */ }
  return DEFAULT_PRESET
}

export function readStoredTheme(): EcuThemeMode {
  try {
    const raw = localStorage.getItem(MODE_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark') return raw
  } catch { /* ignore */ }
  return 'dark'
}

export function applyGluTheme(preset: GluThemePreset, mode: EcuThemeMode): void {
  const root = document.documentElement
  root.setAttribute('data-theme', preset)
  root.setAttribute('data-mode', mode)
  root.classList.remove('sf-dark-mode')

  try {
    localStorage.setItem(PRESET_STORAGE_KEY, preset)
    localStorage.setItem(MODE_STORAGE_KEY, mode)
  } catch { /* ignore */ }
}

/** Compatibilidad con ThemeProvider existente (preset desde storage). */
export function applyEcuTheme(mode: EcuThemeMode): void {
  applyGluTheme(readStoredThemePreset(), mode)
}

export function readCurrentTheme(): EcuThemeMode {
  const mode = document.documentElement.getAttribute('data-mode')
  return mode === 'light' ? 'light' : 'dark'
}
