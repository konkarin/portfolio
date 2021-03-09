import firebase from 'firebase/app'
import 'firebase/firestore'

let env

export const generateRoutes = async (envSettings) => {
  env = envSettings
  if (firebase.apps.length === 0) firebase.initializeApp(env.firebaseConfig)

  const result = []

  // /articles/_article.vue用の記事
  const articles = await getArticles()

  result.push(
    articles.map((article) => {
      return {
        route: `/articles/${article.id}`,
        payload: article,
      }
    })
  )

  // /tags/_tag.vue用の記事一覧
  const articlesList = await getArticlesByTag()

  for (const [tag, articles] of Object.entries(articlesList)) {
    result.push({
      route: `/tags/${tag}`,
      payload: articles,
    })
  }

  return result.flat()
}

const getArticles = async () => {
  const collectionPath = `users/${env.authorId}/articles`
  const snap = await firebase.firestore().collection(collectionPath).get()

  return snap.docs.map((doc) => doc.data())
}

const getArticlesByTag = async () => {
  const articleTags = await getArticleTags()

  const articlesPath = `users/${env.authorId}/articles`

  const articlesList = {}

  for (let i = 0; i < articleTags.length; i++) {
    const tag = articleTags[i]

    const snap = await firebase
      .firestore()
      .collection(articlesPath)
      .where('tags', 'array-contains', tag)
      .get()

    articlesList[tag] = snap.docs.map((doc) => doc.data())
  }

  return articlesList
}

const getArticleTags = async () => {
  const articleTagsPath = `users/${env.authorId}/articleTags`

  const snap = await firebase.firestore().collection(articleTagsPath).get()

  return snap.docs.map((doc) => doc.id)
}
