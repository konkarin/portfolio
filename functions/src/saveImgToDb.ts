import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import dayjs from 'dayjs'
import { parse } from 'exifr'
import { getStorage } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'

import imageSize from 'image-size'
import { spawn } from 'child-process-promise'
import { onObjectFinalized } from 'firebase-functions/v2/storage'
import { log, error } from 'firebase-functions/logger'

export const saveImgToDb = onObjectFinalized({ region: 'asia-northeast1' }, async (object) => {
  const fileBucket: string = object.bucket

  if (!object.data.name || !object.data.contentType) return
  // images/{uid}/{imageId: uuid}/original/hogehoge.jpg
  const originalFilePath: string = object.data.name
  const contentType: string = object.data.contentType

  // gallery配下以外はFirestoreに保存・サムネ作成をしない
  if (!originalFilePath.includes('gallery')) return

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    log('This is not an image.')
    return
  }

  // Exit if the image is already a thumbnail.
  if (path.dirname(originalFilePath).includes('thumb')) {
    log('Already a Thumbnail.')
    return
  }

  // Get the file name.
  const originalFileName = path.basename(originalFilePath)

  // Download file from bucket.
  const bucket = getStorage().bucket(fileBucket)
  const tempFilePath = path.join(os.tmpdir(), originalFileName)

  await bucket.file(originalFilePath).download({ destination: tempFilePath })
  log('Image downloaded locally to', tempFilePath)

  // Get image size
  const size = getSize(tempFilePath)

  // Get Exif info.
  const exif = await getExif(tempFilePath)

  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempFilePath, '-thumbnail', '800x800>', tempFilePath])
  log('Thumbnail created at', tempFilePath)

  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  const thumbFilePath = path.join(
    // /images/{uid}/{imageId: uuid}/original
    path.dirname(originalFilePath),
    '../thumb',
    originalFileName,
  )

  const metadata = {
    contentType,
    cacheControl: 'public, max-age=31536000, s-maxage=31536000',
  }

  // Uploading the thumbnail.
  await bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata,
  })

  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)

  const date = dayjs().format()

  // NOTE: StorageのonFinalizeはcontextのauthにuidを持たないため、ファイルパスから取得
  const uid = originalFilePath.split('/')[1]
  const collectionRef = getFirestore().collection(`users/${uid}/images`)
  // getCountFromServerを使うと現在の最後のorderを取得できないため、orderByで取得
  const lastOrderSnapshot = await collectionRef.orderBy('order', 'desc').limit(1).get()
  const lastOrder = lastOrderSnapshot.empty ? 0 : (lastOrderSnapshot.docs[0]?.data().order ?? 0)

  const data = {
    originalFileName,
    // NOTE: bucketのgetSignedUrlだと有効期限切れたら死ぬから下記で回避
    originalUrl: `https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/${encodeURIComponent(
      originalFilePath,
    )}?alt=media`,
    originalFilePath,
    thumbUrl: `https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/${encodeURIComponent(
      thumbFilePath,
    )}?alt=media`,
    thumbFilePath,
    date,
    exif,
    width: size.width,
    height: size.height,
    order: lastOrder + 1,
  }

  try {
    await collectionRef.add(data)
    log('Completed')
  } catch (e) {
    error(e)
  }
})

const getSize = (tempFilePath: string): { width: number; height: number } => {
  const image = imageSize(tempFilePath)

  if (!image.width || !image.height) {
    return {
      width: 0,
      height: 0,
    }
  }

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

  const data = await parse(tempFilePath, options).catch((e: Error) => {
    error(e)
    return {}
  })

  if (data === undefined) {
    log('Exif does not exist')
    return {}
  }

  if (data.errors) {
    error('Exif parse error')
    return {}
  }

  log('Get Exif')
  return data
}
