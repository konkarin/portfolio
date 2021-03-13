import axios from 'axios'

export const buildArticles = async () => {
  await requestCI()
}

const requestCI = async () => {
  console.log('env', process.env.GCP_PROJECT)

  const branch =
    process.env.GCP_PROJECT === 'konkarin-photo' ? 'production' : 'develop'
  const job =
    process.env.GCP_PROJECT === 'konkarin-photo' ? 'deploy_prod' : 'deploy_sta'

  const url = `https://circleci.com/api/v1.1/project/github/konkarin/portfolio/tree/${branch}`
  const data = {
    build_parameters: {
      CIRCLE_JOB: job,
    },
  }
  const headers = {
    'Content-Type': 'application/json',
    'Circle-Token': 'c30944ed6c07f6ec3691177b92b1a2c61363bf94',
  }

  await axios
    .post(url, data, {
      headers,
    })
    .catch((e) => {
      console.error('catch1')
      throw e
    })

  console.log('triggered success')
}

requestCI()
