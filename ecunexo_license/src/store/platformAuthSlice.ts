import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  clearSession,
  getAccessToken,
  getExpiresAt,
  getOperatorId,
  getOperatorRole,
  setSession,
} from '@/lib/session'

export type PlatformAuthState = {
  accessToken: string | null
  operatorId: string | null
  expiresAt: string | null
  operatorRole: string | null
}

const initialState: PlatformAuthState = {
  accessToken: null,
  operatorId: null,
  expiresAt: null,
  operatorRole: null,
}

export const platformAuthSlice = createSlice({
  name: 'platformAuth',
  initialState,
  reducers: {
    hydrateFromStorage(state) {
      state.accessToken = getAccessToken()
      state.operatorId = getOperatorId()
      state.expiresAt = getExpiresAt()
      state.operatorRole = getOperatorRole()
    },
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string
        operatorId: string
        expiresAt: string
        operatorRole: string
      }>
    ) {
      const { accessToken, operatorId, expiresAt, operatorRole } = action.payload
      state.accessToken = accessToken
      state.operatorId = operatorId
      state.expiresAt = expiresAt
      state.operatorRole = operatorRole
      setSession(accessToken, operatorId, expiresAt, operatorRole)
    },
    clearCredentials(state) {
      state.accessToken = null
      state.operatorId = null
      state.expiresAt = null
      state.operatorRole = null
      clearSession()
    },
  },
})

export const { hydrateFromStorage, setCredentials, clearCredentials } = platformAuthSlice.actions

export function selectAccessToken(state: { platformAuth: PlatformAuthState }): string | null {
  return state.platformAuth.accessToken
}

export function selectIsAuthenticated(state: { platformAuth: PlatformAuthState }): boolean {
  return Boolean(state.platformAuth.accessToken)
}

export function selectOperatorRole(state: { platformAuth: PlatformAuthState }): string | null {
  return state.platformAuth.operatorRole
}

export function selectCanManageOperators(state: { platformAuth: PlatformAuthState }): boolean {
  const role = state.platformAuth.operatorRole
  return role === 'Admin' || role === 'SuperAdmin'
}
