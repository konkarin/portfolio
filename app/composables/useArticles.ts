import type { Article } from '@/types'

export interface UseArticlesOptions {
  limit?: number
  tag?: string
}

export const useArticles = async (options: UseArticlesOptions = {}) => {
  const { AUTHOR_ID } = useRuntimeConfig().public

  const { data: articles } = await useAsyncData(
    `articles-${options.tag ?? 'all'}-${options.limit ?? 'all'}`,
    () => {
      return getArticles(AUTHOR_ID, {
        limitCount: options.limit,
        tag: options.tag,
      })
    },
    {
      default(): Article[] {
        return []
      },
    },
  )

  return {
    articles,
  }
}
