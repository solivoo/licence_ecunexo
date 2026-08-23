import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

export const platformApi = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})
