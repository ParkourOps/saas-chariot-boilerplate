/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Site Title
    readonly VITE_DEFAULT_TITLE: string
    // Firebase Config Variables
    readonly VITE_FIREBASE_API_KEY: string
    readonly VITE_FIREBASE_AUTH_DOMAIN: string
    readonly VITE_FIREBASE_PROJECT_ID: string
    readonly VITE_FIREBASE_STORAGE_BUCKET: string
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
    readonly VITE_FIREBASE_APP_ID: string
    readonly VITE_FIREBASE_MEASUREMENT_ID: string
    readonly VITE_FIREBASE_USE_EMULATOR: string
    // Logging
    readonly VITE_BETTERSTACK_SOURCE_TOKEN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
