import { remark } from 'remark'
import strip from 'strip-markdown'

import type { Article } from '@/types'

export interface UseArticlesOptions {
  limit?: number
  tag?: string
}

export const useArticles = async (options: UseArticlesOptions = {}) => {
  const { AUTHOR_ID } = useRuntimeConfig().public

  const { data: articles } = await useAsyncData(
    `articles-${options.tag ?? 'all'}-${options.limit ?? 'all'}`,
    async () => {
      const articles = await getArticles(AUTHOR_ID, {
        limitCount: options.limit,
        tag: options.tag,
      })

      return await Promise.all(
        articles.map(async (article) => {
          const file = await remark()
            .use(strip)
            .process(article.text)
            .catch((e) => {
              console.error({ e })
              return article.text
            })

          const strippedText = file.toString()
          const sliecedText =
            strippedText.length > 80 ? strippedText.slice(0, 80) + '...' : strippedText

          return {
            ...article,
            text: sliecedText,
          }
        }),
      )
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
