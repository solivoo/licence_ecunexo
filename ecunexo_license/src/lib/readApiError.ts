import axios from 'axios'
import { logger } from './logger'

type ProblemBody = {
  detail?: string
  title?: string
}

function extractPostgresMessage(text: string): string | null {
  const messageText = text.match(/MessageText:\s*([^\r\n]+)/i)?.[1]?.trim()
  if (messageText) {
    return messageText
  }

  const noColumn = text.match(/no existe la columna\s+([^\s]+)/i)
  if (noColumn) {
    return `Falta la columna ${noColumn[1]} en la base de datos. Aplica las migraciones de platform.`
  }

  return null
}

function normalizeErrorText(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) {
    return ''
  }

  const postgres = extractPostgresMessage(trimmed)
  if (postgres) {
    return postgres
  }

  if (trimmed.length > 280 || trimmed.includes(' at ')) {
    const firstLine = trimmed.split(/\r?\n/)[0]?.trim()
    if (firstLine && firstLine.length <= 280) {
      return firstLine
    }
    return 'Ocurrió un error en el servidor. Revisa la consola de la API.'
  }

  return trimmed
}

export function readApiError(error: unknown, fallback = 'Ocurrió un error inesperado.'): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const url = error.config?.url ?? '(sin url)'
    const method = error.config?.method?.toUpperCase() ?? '?'
    logger.warn('readApiError', { method, url, status, message: error.message })

    const data = error.response?.data as ProblemBody | string | undefined
    if (typeof data === 'string' && data.trim()) {
      return normalizeErrorText(data)
    }
    if (data && typeof data === 'object' && data.detail?.trim()) {
      return normalizeErrorText(data.detail)
    }
    if (data && typeof data === 'object' && data.title?.trim()) {
      return normalizeErrorText(data.title)
    }
    if (error.message) {
      return normalizeErrorText(error.message)
    }
  }
  if (error instanceof Error && error.message) {
    return normalizeErrorText(error.message)
  }
  return fallback
}
