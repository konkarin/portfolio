import * as path from 'path'

import { getStorage } from 'firebase-admin/storage'
import { log, error } from 'firebase-functions/logger'
import { onDocumentDeleted } from 'firebase-functions/v2/firestore'

export const deleteFileFromStorage = onDocumentDeleted(
  {
    region: 'asia-northeast1',
    document: '/users/{uid}/images/{imageId}',
  },
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
      log('Delete Completed: ', target)
    } catch (e) {
      error(e)
    }

    return null
  },
)
