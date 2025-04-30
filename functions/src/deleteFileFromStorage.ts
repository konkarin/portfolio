import * as path from 'path'
import { getStorage } from 'firebase-admin/storage'
import { onDocumentDeleted } from 'firebase-functions/v2/firestore'

export const deleteFileFromStorage = onDocumentDeleted(
  '/users/{uid}/images/{imageId}',
  async (event) => {
    const config = JSON.parse(process.env.FIREBASE_CONFIG)

    const bucketName =
      config.projectId === 'konkarin-photo'
        ? 'konkarin-photo.appspot.com'
        : 'staging-konkarin-photo.appspot.com'
    const bucket = getStorage().bucket(bucketName)
    const snap = event.data
    // /users/{uid}/images/{imageId}/original/hoge.jpg
    const deletedPath = snap?.data()?.originalFilePath as string | undefined
    if (deletedPath === undefined) {
      return
    }

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
  },
)
