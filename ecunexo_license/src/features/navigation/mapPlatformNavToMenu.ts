import type { MenuConfig, MenuItem, MenuSubItem } from 'glubox'
import type { PlatformNavItem } from '@/config/platformNav'

function formatLabel(item: PlatformNavItem): string {
  return item.badge ? `${item.label} · ${item.badge}` : item.label
}

function resolvePath(item: PlatformNavItem): string | undefined {
  if (item.disabled) {
    return undefined
  }
  return item.path
}

function toMenuSubItem(item: PlatformNavItem): MenuSubItem {
  const children = item.children?.length ? item.children.map(toMenuSubItem) : undefined

  return {
    id: item.id,
    label: formatLabel(item),
    path: resolvePath(item),
    children,
  }
}

function toMenuItem(item: PlatformNavItem): MenuItem {
  const children = item.children?.length ? item.children.map(toMenuSubItem) : undefined

  return {
    id: item.id,
    label: formatLabel(item),
    icon: item.icon,
    path: children ? undefined : resolvePath(item),
    position: 'top',
    children,
  }
}

export function platformNavToMenuConfig(items: PlatformNavItem[]): MenuConfig {
  return { items: items.map(toMenuItem) }
}
