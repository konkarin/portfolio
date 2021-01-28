import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

import dayjs from 'dayjs'

export type ObjectMetadata = functions.storage.ObjectMetadata
export type EventContext = functions.EventContext

const spawn = require('child-process-promise').spawn

const BUCKET_NAME = 'konkarin-photo.appspot.com'

// TODO: sharpかnode-imagemagickでexifとwidth, heightをcanvasとか使って引っこ抜いてfirestoreに書き込む
// https://github.com/rsms/node-imagemagick
// https://sharp.pixelplumbing.com/
export const saveFileToDb = async (object: ObjectMetadata) => {
  const fileBucket: string = object.bucket
  // images/{uid}/{imageId: uuid}/original/hogehoge.jpg
  const originalFilePath: string = object.name
  const contentType: string = object.contentType

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.')
    return null
  }

  // Exit if the image is already a thumbnail.
  if (path.dirname(originalFilePath).includes('thumb')) {
    console.log('Already a Thumbnail.')
    return null
  }

  // Get the file name.
  const originalFileName = path.basename(originalFilePath)

  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket)
  const tempFilePath = path.join(os.tmpdir(), originalFileName)

  // キャッシュ max-age: 24時間, s-maxage: ３日
  const cacheControl = 'public,max-age=86400,s-maxage=2592000'

  const metadata = {
    contentType,
    cacheControl,
  }

  await bucket.file(originalFilePath).download({ destination: tempFilePath })
  console.log('Image downloaded locally to', tempFilePath)

  // // Get exif
  // const exif = await getExif(tempFilePath).catch((e) => {
  //   console.error(e)
  //   throw new Error(e)
  // })

  const thumbFilePath = await createThumb(
    metadata,
    tempFilePath,
    originalFileName,
    originalFilePath,
    bucket
  ).catch((e) => {
    console.error(e)
    throw new Error(e)
  })

  const date = dayjs().format()

  const data = {
    originalFileName,
    // NOTE: bucketのgetSignedUrlだと有効期限切れたら死ぬから下記で回避
    originalUrl: `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodeURIComponent(
      originalFilePath
    )}?alt=media`,
    originalFilePath,
    thumbUrl: `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodeURIComponent(
      thumbFilePath
    )}?alt=media`,
    thumbFilePath,
    date,
    // exif,
  }

  // NOTE: StorageのonFinalizeはauthにuidを持たないためファイルパスから取得
  const uid = originalFilePath.split('/')[1]
  const collectionRef = admin.firestore().collection(`users/${uid}/images`)

  try {
    await collectionRef.add(data)
    console.log('Completed')
  } catch (e) {
    console.error(e)
  }

  return null
}

// const getExif = async (tempFilePath) => {
//   // Get exif
//   const result = await spawn('identify', ['-verbose', tempFilePath], {
//     capture: ['stdout', 'stderr'],
//   }).catch((e) => {
//     throw new Error(e)
//   })
//   console.log(result)

//   const exif = imageMagickOutputToObject(result.stdout)
//   console.log('exif info:', exif)

//   return exif
// }

const createThumb = async (
  metadata,
  tempFilePath,
  originalFileName,
  originalFilePath,
  bucket
) => {
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempFilePath, '-thumbnail', '300x300>', tempFilePath])
  console.log('Thumbnail created at', tempFilePath)

  const thumbFilePath = path.join(
    // /images/{uid}/{imageId: uuid}/original
    path.dirname(originalFilePath),
    '../thumb',
    originalFileName
  )

  // Uploading the thumbnail.
  await bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata,
  })

  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)

  return thumbFilePath
}

/**
 * Convert the output of ImageMagick's `identify -verbose` command to a JavaScript Object.
 */
// function imageMagickOutputToObject(output) {
//   let previousLineIndent = 0
//   const lines = output.match(/[^\r\n]+/g)
//   lines.shift() // Remove First line

//   lines.forEach((line, index) => {
//     const currentIdent = line.search(/\S/)
//     line = line.trim()

//     if (line.endsWith(':')) {
//       lines[index] = makeKeyFirebaseCompatible(`"${line.replace(':', '":{')}`)
//     } else {
//       const split = line.replace('"', '\\"').split(': ')
//       split[0] = makeKeyFirebaseCompatible(split[0])
//       lines[index] = `"${split.join('":"')}",`
//     }

//     if (currentIdent < previousLineIndent) {
//       lines[index - 1] = lines[index - 1].substring(
//         0,
//         lines[index - 1].length - 1
//       )
//       lines[index] =
//         new Array(1 + (previousLineIndent - currentIdent) / 2).join('}') +
//         ',' +
//         lines[index]
//     }
//     previousLineIndent = currentIdent
//   })

//   output = lines.join('')
//   output = '{' + output.substring(0, output.length - 1) + '}' // remove trailing comma.
//   output = JSON.parse(output)
//   console.log('Metadata extracted from image', output)
//   return output
// }

// /**
//  * Makes sure the given string does not contain characters that can't be used as Firebase
//  * Realtime Database keys such as '.' and replaces them by '*'.
//  */
// function makeKeyFirebaseCompatible(key) {
//   return key.replace(/\./g, '*')
// }
