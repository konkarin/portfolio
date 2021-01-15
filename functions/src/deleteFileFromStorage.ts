const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

export const deleteFileFromStorage = (snap) => {
  // TODO:バケット確認
  const bucketName = 'konkarin-photo.appspot.com'
  const bucket = admin.storage().bucket(bucketName)
  const deletedValue = snap.data().fileName

  bucket
    .file(deletedValue)
    .delete()
    .then(() => {
      console.log(`gs://${bucketName}/${deletedValue} deleted.`)
    })
    .catch((err) => {
      console.error('ERROR:', err)
    })

  bucket
    .file(`thumb_${deletedValue}`)
    .delete()
    .then(() => {
      console.log(`gs://${bucketName}/thumb_${deletedValue} deleted.`)
    })
    .catch((err) => {
      console.error('ERROR:', err)
    })

  console.log('Delete Completed')
}
