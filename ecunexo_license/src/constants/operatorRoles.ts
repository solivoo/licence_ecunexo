import type { EcuDropDownOption } from '@/components/form/EcuLabeledDropDown'

export const OPERATOR_ROLE_OPTIONS: EcuDropDownOption[] = [
  { text: 'Visor (solo consulta)', value: '0' },
  { text: 'Emisor de licencias', value: '1' },
  { text: 'Administrador', value: '2' },
  { text: 'Super administrador', value: '3' },
]

export const OPERATOR_ROLE_LABELS: Record<string, string> = {
  Viewer: 'Visor',
  Issuer: 'Emisor',
  Admin: 'Administrador',
  SuperAdmin: 'Super administrador',
}

/** Roles que el operador actual puede asignar al crear otro operador. */
export function getAssignableOperatorRoles(managerRole: string | null): EcuDropDownOption[] {
  if (managerRole === 'SuperAdmin') {
    return OPERATOR_ROLE_OPTIONS
  }
  if (managerRole === 'Admin') {
    return OPERATOR_ROLE_OPTIONS.filter((r) => r.value === '0' || r.value === '1')
  }
  return []
}

export function formatOperatorRole(role: string): string {
  return OPERATOR_ROLE_LABELS[role] ?? role
}
