import * as admin from 'firebase-admin'

export const saveProfile = async (data, ctx) => {
  const { uid } = ctx.auth

  try {
    const collectionRef = admin.firestore().collection('users')
    await collectionRef.doc(uid).update(data)

    return 'success'
  } catch (e) {
    console.error(e)
    return e
  }
}
