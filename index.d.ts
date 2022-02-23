declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'staging' | 'production' | 'test'
    readonly AUTHOR_ID: string
    readonly APP_URL: string
  }
}
