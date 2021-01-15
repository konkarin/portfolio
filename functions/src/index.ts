const functions = require('firebase-functions')

const saveFileToDb = require('saveFileToDb')
const deleteFileFromStorage = require('deleteFileFromStorage')

exports.saveFileToDb = functions.storage.object().onFinalize(async (object) => {
  await saveFileToDb(object)
})

exports.deleteFileFromStorage = functions.firestore
  .document('images/{imageId}')
  .onDelete((snap) => {
    deleteFileFromStorage(snap)
  })
