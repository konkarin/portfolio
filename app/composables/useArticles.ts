import { getArticleTags, getArticles } from '~/utils/article'

export function useArticles() {
  const config = useRuntimeConfig()

  const { data: articles } = useLazyAsyncData('articles', () => {
    return getArticles(config.public.AUTHOR_ID)
  })

  const { data: tags } = useLazyAsyncData('tags', () => {
    return getArticleTags(config.public.AUTHOR_ID)
  })

  const articleTags = computed(() => {
    return tags.value?.filter((tag) => {
      return articles.value.some((article) => article.tags.includes(tag))
    })
  })

  return {
    articles,
    articleTags,
  }
}
