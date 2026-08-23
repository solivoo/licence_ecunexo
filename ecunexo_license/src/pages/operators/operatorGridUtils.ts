export function operatorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return '?'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

/** Tono HSL estable a partir de un identificador (correo o nombre). */
export function operatorAvatarHue(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % 360
  }
  return hash
}

export type OperatorRoleTone = 'viewer' | 'issuer' | 'admin' | 'super' | 'default'

export function operatorRoleTone(role: string): OperatorRoleTone {
  switch (role) {
    case 'SuperAdmin':
      return 'super'
    case 'Admin':
      return 'admin'
    case 'Issuer':
      return 'issuer'
    case 'Viewer':
      return 'viewer'
    default:
      return 'default'
  }
}
