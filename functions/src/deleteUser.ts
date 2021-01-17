import * as admin from 'firebase-admin'

export const deleteUser = async (user: admin.auth.UserRecord) => {
  const db = admin.firestore()
  const usersCollectionRef = db.collection('users')

  await usersCollectionRef
    .doc(user.uid)
    .delete()
    .catch((e) => {
      console.error(e)
      return 0
    })

  console.log('Deleted user: ', user.uid)
  return 0
}
