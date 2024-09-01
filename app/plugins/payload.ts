import type { Article } from '@/types'

export default defineNuxtPlugin(async () => {
  const { AUTHOR_ID } = useRuntimeConfig().public

  const { data: articles } = await useAsyncData(
    'articles-plugins',
    () => {
      return getArticles(AUTHOR_ID)
    },
    {
      default(): Ref<Article[]> {
        return ref([])
      },
    }
  )

  const { data: tags } = await useAsyncData(
    'tags-plugins',
    () => {
      return getArticleTags(AUTHOR_ID)
    },
    {
      default(): Ref<string[]> {
        return ref([])
      },
    }
  )

  return {
    provide: {
      articles,
      tags,
    },
  }
})
