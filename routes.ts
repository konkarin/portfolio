import type { DocumentData } from 'firebase/firestore'
// NOTE: nuxt generate時に呼ばれるときはalias pathが使えない https://github.com/nuxt/nuxt/issues/7017
import { db } from './app/api/apis'
import type { Query } from './app/api/firestore'
import { runtimePublicConfig } from './config'

interface Articles {
  [key: string]: DocumentData[]
}

export const generateRoutes = async () => {
  // /articles/_article.vue用の記事
  const allArticles = await getArticles()

  const articleRoutes = allArticles.flatMap((article: Record<string, string>) => {
    const uuidRoute = {
      route: `/articles/${article.id}`,
      payload: article,
    }
    if (article.customId) {
      return [
        uuidRoute,
        {
          route: `/articles/${article.customId}`,
          payload: article,
        },
      ]
    }
    return uuidRoute
  })

  const allTags = await getArticleTags()

  // /tags/_tag.vue用の記事一覧
  const articleRecordByTag = await getArticleRecordByTag()

  const tagRoutes = Object.entries(articleRecordByTag)
    .map(([tag, articles]) => {
      return {
        route: `/tags/${tag}`,
        payload: {
          articlesByTag: articles,
          recentArticles: articles.slice(0, 2),
          allTags,
        },
      }
    })
    .filter(({ payload }) => {
      return payload.articlesByTag.length > 0
    })

  return [...articleRoutes, ...tagRoutes]
}

const getArticleRecordByTag = async () => {
  const allTags = await getArticleTags()
  const articleRecord: Articles = {}
  const articlesPath = `users/${runtimePublicConfig.AUTHOR_ID}/articles`

  for (let i = 0; i < allTags.length; i++) {
    const tag = allTags[i]
    const queries: Query[] = [
      {
        fieldPath: 'tags',
        filterStr: 'array-contains',
        value: tag,
      },
      {
        fieldPath: 'isPublished',
        filterStr: '==',
        value: true,
      },
    ]

    if (tag) articleRecord[tag] = await db.getDocsData(articlesPath, queries)
  }

  return articleRecord
}

const getArticles = async () => {
  const collectionPath = `users/${runtimePublicConfig.AUTHOR_ID}/articles`
  const query: Query = {
    fieldPath: 'isPublished',
    filterStr: '==',
    value: true,
  }

  return await db.getDocsData(collectionPath, [query])
}

const getArticleTags = async () => {
  const articleTagsPath = `users/${runtimePublicConfig.AUTHOR_ID}/articleTags`
  return await db.getDocIds(articleTagsPath)
}
