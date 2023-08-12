import { getArticleTags, getArticles } from '~/utils/article'

export function useArticles() {
  const { AUTHOR_ID } = useRuntimeConfig().public

  const { data: articles } = useAsyncData('articles', () => {
    return getArticles(AUTHOR_ID)
  })
  const articleComputed = computed(() => {
    return articles.value || []
  })

  const { data: tags } = useAsyncData('tags', () => {
    return getArticleTags(AUTHOR_ID)
  })
  const articleTags = computed(() => {
    if (tags.value === null) {
      return []
    }

    return tags.value.filter((tag) => {
      return articleComputed.value.some((article) => article.tags.includes(tag))
    })
  })

  return {
    articles: articleComputed,
    articleTags,
  }
}
