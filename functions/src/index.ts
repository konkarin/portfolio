import * as admin from 'firebase-admin'
import * as fn from 'firebase-functions'
import { buildArticles } from './buildArticles'
import { createUser } from './createUser'
import { deleteFileFromStorage } from './deleteFileFromStorage'
import { deleteUser } from './deleteUser'
import { saveFileToDb } from './saveFileToDb'

admin.initializeApp()

const functions = fn.region('asia-northeast1')

exports.saveFileToDb = functions.storage
  .object()
  .onFinalize((object) => saveFileToDb(object))

exports.deleteFileFromStorage = functions.firestore
  .document('/users/{uid}/images/{imageId}')
  .onDelete((snap) => deleteFileFromStorage(snap))

exports.createUser = functions.auth.user().onCreate((user) => createUser(user))

exports.deleteUser = functions.auth.user().onDelete((user) => deleteUser(user))

exports.buildArticles = functions.firestore
  .document('/users/{uid}/articles/{articleId}')
  .onWrite((snap) => buildArticles(snap))
