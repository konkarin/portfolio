import type { Article } from '@/types'

export const useArticles = async () => {
  const { AUTHOR_ID } = useRuntimeConfig().public

  const { data: articles } = await useAsyncData(
    'articles',
    () => {
      return getArticles(AUTHOR_ID)
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
