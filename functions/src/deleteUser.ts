import { UserRecord } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

export const deleteUser = async (user: UserRecord) => {
  const usersCollectionRef = getFirestore().collection('users')

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
