import type { SidebarBrandProps } from 'glubox'
import logoDark from '@assets/solo_logo_ecunexo_dark.svg'
import logoLight from '@assets/solo_logo_ecunexo_light.svg'
import { useTheme } from '@/theme/ThemeProvider'

export function PlatformSidebarBrand({ collapsed }: SidebarBrandProps) {
  const { mode } = useTheme()
  const logo = mode === 'dark' ? logoDark : logoLight

  return (
    <img
      src={logo}
      alt="EcuNexo"
      className={
        collapsed
          ? 'platform-sidebar-brand__logo platform-sidebar-brand__logo--collapsed'
          : 'platform-sidebar-brand__logo'
      }
      decoding="async"
    />
  )
}
