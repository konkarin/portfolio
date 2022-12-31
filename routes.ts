import { DocumentData } from 'firebase/firestore'
import { db } from './app/api/apis'
import { Query } from './app/api/firestore'

interface Articles {
  [key: string]: DocumentData[]
}

export const generateRoutes = async () => {
  // /articles/_article.vue用の記事
  const articles = await getArticles()

  const result = articles.map((article) => {
    return {
      route: `/articles/${article.id}`,
      payload: article,
    }
  })

  // /tags/_tag.vue用の記事一覧
  const articlesList = await getArticlesByTag()

  // TODO:記事が一つもないタグはルートを生成しないようにする
  for (const [tag, articles] of Object.entries(articlesList)) {
    result.push({
      route: `/tags/${tag}`,
      payload: articles,
    })
  }

  return result
}

const getArticles = async () => {
  const collectionPath = `users/${process.env.AUTHOR_ID}/articles`
  const query: Query = {
    fieldPath: 'isPublished',
    filterStr: '==',
    value: true,
  }

  return await db.getDocsData(collectionPath, [query])
}

const getArticlesByTag = async () => {
  const articleTags = await getArticleTags()
  const articlesList: Articles = {}
  const articlesPath = `users/${process.env.AUTHOR_ID}/articles`

  for (let i = 0; i < articleTags.length; i++) {
    const tag = articleTags[i]
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

    articlesList[tag] = await db.getDocsData(articlesPath, queries)
  }

  return articlesList
}

const getArticleTags = async () => {
  const articleTagsPath = `users/${process.env.AUTHOR_ID}/articleTags`
  return await db.getDocIds(articleTagsPath)
}
