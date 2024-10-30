// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly BASE_URL_LOCAL: string
  readonly BASE_URL_PRODUCTION: string
  // add other env variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export { ImportMetaEnv, ImportMeta }
