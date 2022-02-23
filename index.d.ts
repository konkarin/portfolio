declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly authorId: string
    readonly APP_URL: string
  }
}
