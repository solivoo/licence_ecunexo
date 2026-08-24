/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_LICENSE_SYNCFUSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
