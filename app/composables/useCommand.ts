export function useRouterCommand(path: 'root' | 'home') {
  const keyList = ref<string>('')

  function handleKeydown(event: KeyboardEvent) {
    keyList.value += event.key

    if (keyList.value.includes(`/${path}`)) {
      if (path === 'home') {
        useRouter().push('/')
      } else {
        useRouter().push('/dashboard/articles')
      }
    }
  }
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}

interface KeyCombination {
  key: string
  metaKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
}

export function useKeyCombination(callback: () => void, combination: KeyCombination) {
  const handleKeydown = (event: KeyboardEvent) => {
    const metaMatch = !!combination.metaKey === event.metaKey
    const ctrlMatch = !!combination.ctrlKey === event.ctrlKey
    const altMatch = !!combination.altKey === event.altKey
    const shiftMatch = !!combination.shiftKey === event.shiftKey
    const keyMatch = combination.key.toLowerCase() === event.key.toLowerCase()

    if (metaMatch && ctrlMatch && altMatch && shiftMatch && keyMatch) {
      event.preventDefault()
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
