/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_SCORECARD_API_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
