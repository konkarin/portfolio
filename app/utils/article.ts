import { db } from '@/api/apis'
import type { Query, Order } from '@/api/firestore'
import type { Article } from '@/types/index'

export async function getArticles(
  authorId: string,
  options: { limitCount?: number; tag?: string } = {},
) {
  const { limitCount, tag } = options
  const articlesPath = `users/${authorId}/articles`
  const whereQueries: Query[] = [
    {
      fieldPath: 'isPublished',
      filterStr: '==',
      value: true,
    },
  ]

  if (tag) {
    whereQueries.push({
      fieldPath: 'tags',
      filterStr: 'array-contains',
      value: tag,
    })
  }

  const order: Order = {
    fieldPath: 'releaseDate',
    direction: 'desc',
  }

  // 一覧用の記事一覧
  return (await db.getDocsData(articlesPath, whereQueries, order, limitCount).catch((e) => {
    console.error(e)
    return []
  })) as Article[]
}

export async function getArticleTags(authorId: string, limitCount?: number) {
  const tagsPath = `users/${authorId}/articleTags`
  // サイドメニュー用のタグ一覧
  return await db.getDocIds(tagsPath, undefined, undefined, limitCount).catch((e) => {
    console.error(e)
    return [] as string[]
  })
}
