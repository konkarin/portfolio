import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

import * as rehype from 'rehype'
import * as merge from 'deepmerge'
import * as gh from 'hast-util-sanitize'
import * as sanitize from 'rehype-sanitize'

type ProfileData = {
  profile: string
}

type CallableContext = functions.https.CallableContext

const schema = merge(gh, { tagNames: ['math', 'mi'] })

export const saveProfile = async (data: ProfileData, ctx: CallableContext) => {
  const { uid } = ctx.auth

  const sanitizedMarkdown = await rehype()
    .data('settings', { fragment: true })
    .use(sanitize, schema)
    .process(data.profile)

  const profile: ProfileData = {
    profile: sanitizedMarkdown.toString(),
  }

  try {
    const collectionRef = admin.firestore().collection('users')
    await collectionRef.doc(uid).update(profile)

    return 'success'
  } catch (e) {
    console.error(e)
    return e
  }
}
