const ACCESS = 'ecunexo.platform.accessToken'
const OPERATOR = 'ecunexo.platform.operatorId'
const EXPIRES = 'ecunexo.platform.expiresAt'
const ROLE = 'ecunexo.platform.operatorRole'

const LEGACY_ACCESS = 'ecunexo.platform.accessToken'

export function getAccessToken(): string | null {
  return (
    sessionStorage.getItem(ACCESS) ??
    localStorage.getItem(ACCESS) ??
    localStorage.getItem(LEGACY_ACCESS)
  )
}

export function getOperatorId(): string | null {
  return sessionStorage.getItem(OPERATOR) ?? localStorage.getItem(OPERATOR)
}

export function getExpiresAt(): string | null {
  return sessionStorage.getItem(EXPIRES) ?? localStorage.getItem(EXPIRES)
}

export function getOperatorRole(): string | null {
  return sessionStorage.getItem(ROLE) ?? localStorage.getItem(ROLE)
}

export function setSession(
  accessToken: string,
  operatorId: string,
  expiresAt: string,
  role: string
): void {
  sessionStorage.setItem(ACCESS, accessToken)
  sessionStorage.setItem(OPERATOR, operatorId)
  sessionStorage.setItem(EXPIRES, expiresAt)
  sessionStorage.setItem(ROLE, role)
  localStorage.removeItem(LEGACY_ACCESS)
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(OPERATOR)
  localStorage.removeItem(EXPIRES)
  localStorage.removeItem(ROLE)
}

export function clearSession(): void {
  sessionStorage.removeItem(ACCESS)
  sessionStorage.removeItem(OPERATOR)
  sessionStorage.removeItem(EXPIRES)
  sessionStorage.removeItem(ROLE)
  localStorage.removeItem(LEGACY_ACCESS)
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(OPERATOR)
  localStorage.removeItem(EXPIRES)
  localStorage.removeItem(ROLE)
}
