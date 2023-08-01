import { db } from '@/api/apis'
import { Article } from '@/types/index'
import { Query, Order } from '@/api/firestore'

export async function getArticles(authorId: string) {
  const articlesPath = `users/${authorId}/articles`
  const queries: Query = {
    fieldPath: 'isPublished',
    filterStr: '==',
    value: true,
  }
  const order: Order = {
    fieldPath: 'releaseDate',
    direction: 'desc',
  }

  // 一覧用の記事一覧
  return (await db.getOrderDocsByQueries(articlesPath, queries, order).catch((e) => {
    console.error(e)
    return []
  })) as Article[]
}

export async function getArticleTags(authorId: string) {
  const tagsPath = `users/${authorId}/articleTags`
  // サイドメニュー用のタグ一覧
  return await db.getDocIds(tagsPath).catch((e) => {
    console.error(e)
    return [] as string[]
  })
}
