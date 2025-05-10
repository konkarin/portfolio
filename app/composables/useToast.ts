export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  title: string
  description?: string
  duration: number
  type: ToastType
}

export interface ToastOptions {
  title: string
  description?: string
  duration?: number
  type?: ToastType
}

export const ToastKey: InjectionKey<(toast: Toast) => void> = Symbol('toast')

export const useToast = () => {
  const addToast = inject(ToastKey)

  if (addToast === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const showToast = (options: ToastOptions) => {
    const id = `toast-${crypto.randomUUID()}`
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description || '',
      duration: options.duration || 3000,
      type: options.type || 'info',
    }

    addToast(newToast)
  }

  return {
    showToast,
  }
}
