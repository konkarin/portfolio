import { useRuntimeConfig, useAsyncData } from '#app'
import type { Article } from '@/types'
import { getArticles } from '@/utils/article'

export const useArticle = async (articleIdOrCustomId: string) => {
  const { AUTHOR_ID } = useRuntimeConfig().public

  const { data: article } = await useAsyncData(`article-${articleIdOrCustomId}`, async () => {
    // 全記事取得してフィルタリングするのは非効率だが、現状の getArticles がそれを行っているため一旦合わせる
    // ただし、useArticles は truncate しているので、ここでは生のデータを取得するユーティリティが必要
    const articlesPath = `users/${AUTHOR_ID}/articles`

    // getArticles を使わずに直接 Firestore から取得するか、
    // getArticles を truncate しないオプション付きで呼ぶ必要がある。
    // 現状の getArticles は utils/article.ts にあり、truncate は composable 側で行われている。

    const allArticles = await getArticles(AUTHOR_ID)
    const article = allArticles.find(
      (a) => a.id === articleIdOrCustomId || a.customId === articleIdOrCustomId,
    )

    return article || null
  })

  return {
    article,
  }
}
