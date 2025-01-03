import { initializeApp } from 'firebase-admin/app'
import { region } from 'firebase-functions'
import { getFirestore } from 'firebase-admin/firestore'
import { buildArticles } from './buildArticles'
import { deleteFileFromStorage } from './deleteFileFromStorage'
import { saveImgToDb } from './saveImgToDb'

initializeApp()
getFirestore().settings({ ignoreUndefinedProperties: true })

const functions = region('asia-northeast1')

exports.saveImgToDb = functions.storage.object().onFinalize((object) => saveImgToDb(object))

exports.deleteFileFromStorage = functions.firestore
  .document('/users/{uid}/images/{imageId}')
  .onDelete((snap) => deleteFileFromStorage(snap))

exports.buildArticles = functions
  .runWith({ secrets: ['CIRCLE_CI_TOKEN'] })
  .firestore.document('/users/{uid}/articles/{articleId}')
  .onWrite((snap) => buildArticles(snap))
