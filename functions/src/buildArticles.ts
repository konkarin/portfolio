import axios from 'axios'
import { log, error } from 'firebase-functions/logger'
import { onDocumentWritten } from 'firebase-functions/v2/firestore'

export const buildArticles = onDocumentWritten(
  {
    region: 'asia-northeast1',
    secrets: ['GITHUB_TOKEN'],
    document: '/users/{uid}/articles/{articleId}',
  },
  async (event) => {
    const snap = event.data
    if (!snap?.before.get('isPublished') && !snap?.after.get('isPublished')) {
      log('No articles to update')
    } else {
      await triggerGitHubWorkflow()
    }
  },
)

const triggerGitHubWorkflow = async () => {
  // NOTE: https://firebase.google.com/docs/functions/config-env?hl=ja#automatically_populated_environment_variables
  const config = JSON.parse(process.env.FIREBASE_CONFIG)
  const workflow =
    config.projectId === 'konkarin-photo'
      ? 'deploy-production-hosting.yml'
      : 'deploy-staging-hosting.yml'

  // GitHubリポジトリ情報
  const owner = 'konkarin'
  const repo = 'portfolio'

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`
  const data = {
    ref: config.projectId === 'konkarin-photo' ? 'master' : 'develop',
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }

  await axios
    .post(url, data, {
      headers,
    })
    .catch((e) => {
      error(`Failed to trigger GitHub workflow: ${e.message}`)
      throw e
    })

  log(`GitHub Actions workflow ${workflow} triggered successfully`)
}
