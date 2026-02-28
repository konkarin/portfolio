export interface UseArticleTagsOptions {
  limit?: number
}

export const useArticleTags = async (options: UseArticleTagsOptions = {}) => {
  const { AUTHOR_ID } = useRuntimeConfig().public

  const { data: tags } = await useAsyncData(
    `tags-${options.limit ?? 'all'}`,
    () => {
      return getArticleTags(AUTHOR_ID, options.limit)
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
