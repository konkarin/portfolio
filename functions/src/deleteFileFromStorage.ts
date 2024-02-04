import * as path from 'path'
import { firestore } from 'firebase-functions'
import { getStorage } from 'firebase-admin/storage'

export type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot

export const deleteFileFromStorage = async (snap: QueryDocumentSnapshot) => {
  const config = JSON.parse(process.env.FIREBASE_CONFIG)

  const bucketName =
    config.projectId === 'konkarin-photo'
      ? 'konkarin-photo.appspot.com'
      : 'staging-konkarin-photo.appspot.com'
  const bucket = getStorage().bucket(bucketName)
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
