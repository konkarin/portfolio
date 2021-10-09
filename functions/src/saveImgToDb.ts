import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import dayjs from 'dayjs'
import exifr from 'exifr'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const imageSize = require('image-size')
const spawn = require('child-process-promise').spawn

export type ObjectMetadata = functions.storage.ObjectMetadata

export const saveImgToDb = async (object: ObjectMetadata) => {
  const fileBucket: string = object.bucket
  // images/{uid}/{imageId: uuid}/original/hogehoge.jpg
  const originalFilePath: string = object.name
  const contentType: string = object.contentType

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.')
    return
  }

  // Exit if the image is already a thumbnail.
  if (path.dirname(originalFilePath).includes('thumb')) {
    console.log('Already a Thumbnail.')
    return
  }

  // Get the file name.
  const originalFileName = path.basename(originalFilePath)

  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket)
  const tempFilePath = path.join(os.tmpdir(), originalFileName)

  await bucket.file(originalFilePath).download({ destination: tempFilePath })
  console.log('Image downloaded locally to', tempFilePath)

  // Get image size
  const size = getSize(tempFilePath)

  // Get Exif info.
  const exif = await getExif(tempFilePath)

  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempFilePath, '-thumbnail', '300x300>', tempFilePath])
  console.log('Thumbnail created at', tempFilePath)

  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  const thumbFilePath = path.join(
    // /images/{uid}/{imageId: uuid}/original
    path.dirname(originalFilePath),
    '../thumb',
    originalFileName
  )

  const metadata = {
    contentType,
    // キャッシュ max-age: 24時間, s-maxage: ３日
    cacheControl: 'public,max-age=86400,s-maxage=2592000',
  }

  // Uploading the thumbnail.
  await bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata,
  })

  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)

  const date = dayjs().format()

  const data = {
    originalFileName,
    // NOTE: bucketのgetSignedUrlだと有効期限切れたら死ぬから下記で回避
    originalUrl: `https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/${encodeURIComponent(
      originalFilePath
    )}?alt=media`,
    originalFilePath,
    thumbUrl: `https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/${encodeURIComponent(
      thumbFilePath
    )}?alt=media`,
    thumbFilePath,
    date,
    exif,
    width: size.width,
    height: size.height,
  }

  // NOTE: StorageのonFinalizeはcontextのauthにuidを持たないため、ファイルパスから取得
  const uid = originalFilePath.split('/')[1]
  const collectionRef = admin.firestore().collection(`users/${uid}/images`)

  try {
    await collectionRef.add(data)
    console.log('Completed')
  } catch (e) {
    console.error(e)
  }
}

const getSize = (tempFilePath: string): { width: number; height: number } => {
  const image = imageSize(tempFilePath)

  return {
    width: image.width,
    height: image.height,
  }
}

const getExif = async (tempFilePath: string) => {
  const options = {
    gps: false,
    xmp: true,
    translateKeys: true,
    translateValues: true,
    reviveValues: true,
    sanitize: true,
    mergeOutput: false,
    silentErrors: true,
  }

  const data = await exifr.parse(tempFilePath, options).catch((e) => {
    console.error(e)
    return {}
  })

  console.log('Get Exif')
  return data
}
