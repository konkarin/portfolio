import axios from 'axios'
import { onDocumentWritten } from 'firebase-functions/v2/firestore'

export const buildArticles = onDocumentWritten(
  {
    secrets: ['CIRCLE_CI_TOKEN'],
    document: '/users/{uid}/articles/{articleId}',
  },
  async (event) => {
    const snap = event.data
    if (!snap?.before.get('isPublished') && !snap?.after.get('isPublished')) {
      console.log('No articles to update')
    } else {
      await requestCI()
    }
  },
)

const requestCI = async () => {
  // NOTE: https://firebase.google.com/docs/functions/config-env?hl=ja#automatically_populated_environment_variables
  const config = JSON.parse(process.env.FIREBASE_CONFIG)
  const branch = config.projectId === 'konkarin-photo' ? 'master' : 'develop'
  const job = config.projectId === 'konkarin-photo' ? 'deploy_prod_hosting' : 'deploy_sta_hosting'

  const url = `https://circleci.com/api/v1.1/project/github/konkarin/portfolio/tree/${branch}`
  const data = {
    build_parameters: {
      CIRCLE_JOB: job,
    },
  }

  const headers = {
    'Content-Type': 'application/json',
    'Circle-Token': process.env.CIRCLE_CI_TOKEN,
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
