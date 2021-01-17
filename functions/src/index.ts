import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { saveFileToDb } from './saveFileToDb'
import { deleteFileFromStorage } from './deleteFileFromStorage'
import { createUser } from './createUser'
import { deleteUser } from './deleteUser'

admin.initializeApp()

exports.saveFileToDb = functions.storage.object().onFinalize((object) => {
  saveFileToDb(object)
})

exports.deleteFileFromStorage = functions.firestore
  .document('images/{imageId}')
  .onDelete((snap) => deleteFileFromStorage(snap))

exports.createUser = functions.auth.user().onCreate((user) => createUser(user))

exports.deleteUser = functions.auth.user().onDelete((user) => deleteUser(user))
