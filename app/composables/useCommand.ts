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
