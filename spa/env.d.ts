/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Site Title
    readonly VITE_DEFAULT_TITLE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
