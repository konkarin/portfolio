import * as path from 'path'
import admin from 'firebase-admin'
import functions from 'firebase-functions'

export type QueryDocumentSnapshot = functions.firestore.QueryDocumentSnapshot

export const deleteFileFromStorage = async (snap: QueryDocumentSnapshot) => {
  const bucketName = 'konkarin-photo.appspot.com'
  const bucket = admin.storage().bucket(bucketName)
  // /users/{uid}/images/{imageId}/original/hoge.jpg
  const deletedPath = snap.data().originalFilePath

  // /users/{uid}/images/{imageId}
  const target = path.join(path.dirname(deletedPath), '../')

  try {
    // NOTE: bucket.file(target).delete()だとディレクトリは消せない
    await bucket.deleteFiles({ prefix: target })
    console.log('Delete Completed: ', target)
  } catch (e) {
    console.error(e)
  }

  return null
}
