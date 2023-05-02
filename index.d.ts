declare namespace NodeJS {
  interface ProcessEnv {
    readonly AUTHOR_ID: string
    readonly APP_URL: string
  }
}

interface HTMLInputEvent<T> extends Event {
  target: T & EventTarget
}

interface HTMLKeyboardEvent<T> extends KeyboardEvent {
  target: T & EventTarget
}
