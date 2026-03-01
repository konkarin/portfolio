import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { spawn } from 'child-process-promise'
import { getStorage } from 'firebase-admin/storage'
import { log, error } from 'firebase-functions/logger'
import { onObjectFinalized } from 'firebase-functions/v2/storage'

/**
 * 画像のアップロードをトリガーにサムネイルを生成する
 */
export const generateThumbnail = onObjectFinalized({ region: 'asia-northeast1' }, async (event) => {
  const { bucket: fileBucket, name: filePath, contentType } = event.data

  if (!filePath || !contentType) return
  if (!contentType.startsWith('image/')) return

  // 既にサムネイルフォルダ内にある場合はスキップ
  if (filePath.includes('/thumb/')) {
    log('Already a Thumbnail.')
    return
  }

  try {
    const bucket = getStorage().bucket(fileBucket)
    const fileName = path.basename(filePath)
    const tempFilePath = path.join(os.tmpdir(), fileName)

    // 1. ローカルにダウンロード
    await bucket.file(filePath).download({ destination: tempFilePath })
    log('Image downloaded locally to', tempFilePath)

    // 2. ImageMagickでリサイズ
    await spawn('convert', [tempFilePath, '-thumbnail', '800x800>', tempFilePath])
    log('Thumbnail created at', tempFilePath)

    // 3. サムネイルの保存先パス作成 (original/ を thumb/ に置換)
    const thumbFilePath = filePath.replace('/original/', '/thumb/')
    const metadata = {
      contentType,
      cacheControl: 'public, max-age=31536000, s-maxage=31536000',
    }

    // 4. アップロード
    await bucket.upload(tempFilePath, {
      destination: thumbFilePath,
      metadata,
    })
    log('Thumbnail uploaded to', thumbFilePath)

    // 一時ファイルの削除
    fs.unlinkSync(tempFilePath)
  } catch (e) {
    error('Thumbnail generation failed:', e)
  }
})
