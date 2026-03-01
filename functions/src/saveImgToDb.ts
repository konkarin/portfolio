import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import dayjs from 'dayjs'
import { parse } from 'exifr'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { log, error } from 'firebase-functions/logger'
import { onObjectFinalized } from 'firebase-functions/v2/storage'
import { imageSizeFromFile } from 'image-size/fromFile'

/**
 * サムネイルのアップロードをトリガーに、オリジナル画像からメタデータを抽出して Firestore に保存する
 */
export const saveImgToDb = onObjectFinalized({ region: 'asia-northeast1' }, async (event) => {
  const { bucket: fileBucket, name: thumbFilePath, contentType } = event.data

  if (!thumbFilePath || !contentType) return
  // gallery配下のthumbフォルダのみ対象
  if (!thumbFilePath.includes('gallery') || !thumbFilePath.includes('/thumb/')) return

  try {
    const bucket = getStorage().bucket(fileBucket)
    const fileName = path.basename(thumbFilePath)

    // オリジナルのパスを取得 (.../thumb/file.jpg -> .../original/file.jpg)
    const originalFilePath = path.join(path.dirname(thumbFilePath), '../original', fileName)

    // オリジナル画像からサイズ・EXIF情報を取得するためにダウンロード
    const tempOriginalPath = path.join(os.tmpdir(), `orig_${fileName}`)
    await bucket.file(originalFilePath).download({ destination: tempOriginalPath })

    const { width, height } = await getSize(tempOriginalPath)
    const exif = await getExif(tempOriginalPath)

    // 不要になった一時ファイルの削除
    fs.unlinkSync(tempOriginalPath)

    // Firestoreへの書き込み
    const uid = thumbFilePath.split('/')[1]
    const collectionRef = getFirestore().collection(`users/${uid}/images`)

    // orderの決定
    const lastOrderSnapshot = await collectionRef.orderBy('order', 'desc').limit(1).get()
    const lastOrder = lastOrderSnapshot.empty ? 0 : (lastOrderSnapshot.docs[0]?.data().order ?? 0)

    const data = {
      originalFileName: fileName,
      originalUrl: createStorageUrl(fileBucket, originalFilePath),
      originalFilePath,
      thumbUrl: createStorageUrl(fileBucket, thumbFilePath),
      thumbFilePath,
      date: dayjs().format(),
      exif,
      width,
      height,
      order: lastOrder + 1,
    }

    await collectionRef.add(data)
    log('Metadata saved to Firestore successfully')
  } catch (e) {
    error('Failed to save metadata to Firestore:', e)
  }
})

const createStorageUrl = (bucket: string, filePath: string) => {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filePath)}?alt=media`
}

const getSize = async (tempFilePath: string): Promise<{ width: number; height: number }> => {
  const image = await imageSizeFromFile(tempFilePath)
  return {
    width: image?.width ?? 0,
    height: image?.height ?? 0,
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

  try {
    const data = await parse(tempFilePath, options)
    if (!data || data.errors) {
      log('Exif parse error or does not exist')
      return {}
    }
    log('Get Exif')
    return data
  } catch (e) {
    error(e)
    return {}
  }
}
