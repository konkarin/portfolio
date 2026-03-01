import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

import { buildArticles } from './buildArticles'
import { deleteFileFromStorage } from './deleteFileFromStorage'
import { generateThumbnail } from './generateThumbnail'
import { saveImgToDb } from './saveImgToDb'

initializeApp()
getFirestore().settings({ ignoreUndefinedProperties: true })

exports.generateThumbnail = generateThumbnail
exports.saveImgToDb = saveImgToDb
exports.deleteFileFromStorage = deleteFileFromStorage
exports.buildArticles = buildArticles
