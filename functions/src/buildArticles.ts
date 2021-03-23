import axios from 'axios'
import * as functions from 'firebase-functions'

export type ChangeDocumentSnapshot = functions.Change<functions.firestore.DocumentSnapshot>

export const buildArticles = async (snap: ChangeDocumentSnapshot) => {
  if (!snap.before.get('isPublished') && !snap.after.get('isPublished')) {
    console.log('No articles to update')
  } else {
    await requestCI()
  }
}

const requestCI = async () => {
  const config = JSON.parse(process.env.FIREBASE_CONFIG)
  const branch = config.projectId === 'konkarin-photo' ? 'master' : 'develop'
  const job =
    config.projectId === 'konkarin-photo'
      ? 'deploy_prod_hosting'
      : 'deploy_sta_hosting'

  const url = `https://circleci.com/api/v1.1/project/github/konkarin/portfolio/tree/${branch}`
  const data = {
    build_parameters: {
      CIRCLE_JOB: job,
    },
  }

  const circleToken = functions.config().cricle_token

  const headers = {
    'Content-Type': 'application/json',
    'Circle-Token': circleToken,
  }

  await axios
    .post(url, data, {
      headers,
    })
    .catch((e) => {
      console.error(e)
      throw e
    })

  console.log('triggered success')
}
