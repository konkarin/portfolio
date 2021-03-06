import firebase from 'firebase/app'
import 'firebase/firestore'

export const generateRoutes = async (env) => {
  if (firebase.apps.length === 0) firebase.initializeApp(env.firebaseConfig)

  const articles = await getArticles(env)

  const result = []

  result.push(
    articles.map((article) => {
      return {
        route: `/articles/${article.id}`,
        payload: article,
      }
    })
  )

  return result.flat()
}

const getArticles = async (env) => {
  const collectionPath = `users/${env.authorId}/articles`

  return await firebase
    .firestore()
    .collection(collectionPath)
    .get()
    .then((snap) => {
      return snap.docs.map((doc) => doc.data())
    })
}
