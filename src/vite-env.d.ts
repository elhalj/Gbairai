/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_ANON_KEY: string
  readonly VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: string
  readonly VITE_SUPABASE_URL: string

  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
