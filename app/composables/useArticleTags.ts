export const useArticleTags = async () => {
  const { AUTHOR_ID } = useRuntimeConfig().public

  const { data: tags } = await useAsyncData(
    'tags',
    () => {
      return getArticleTags(AUTHOR_ID)
    },
    {
      default(): string[] {
        return []
      },
    },
  )

  return {
    tags,
  }
}
