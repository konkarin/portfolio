import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { saveFileToDb } from './saveFileToDb'
import { deleteFileFromStorage } from './deleteFileFromStorage'
import { createUser } from './createUser'
import { deleteUser } from './deleteUser'

admin.initializeApp()

exports.saveFileToDb = functions
  .region('asia-northeast1')
  .storage.object()
  .onFinalize((object, ctx) => {
    saveFileToDb(object, ctx)
  })

exports.deleteFileFromStorage = functions
  .region('asia-northeast1')
  .firestore.document('/users/{uid}/images/{imageId}')
  .onDelete((snap) => deleteFileFromStorage(snap))

exports.createUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate((user) => createUser(user))

exports.deleteUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onDelete((user) => deleteUser(user))
