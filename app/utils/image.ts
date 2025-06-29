import type { DocumentData } from 'firebase/firestore'

export interface ResizeOptions {
  maxSize?: number
  targetWidth?: number
  targetHeight?: number
  quality?: number
  mode?: 'cover' | 'contain' | 'exact'
}

export const loadImgList = async (imgList: DocumentData[]) => {
  const urls: string[] = imgList.map((img) => img.thumbUrl)

  const promiseList = []
  for (const url of urls) {
    promiseList.push(loadImg(url))
  }

  return await Promise.allSettled(promiseList)
}

const loadImg = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = () => reject(url)
    img.src = url
  })
}

/**
 * blob画像をインテリジェントにリサイズする
 * 高解像度の画像は適切にリサイズし、低解像度の画像はそのままにする
 */
export async function resizeImage(blob: Blob, options: ResizeOptions = {}) {
  const {
    maxSize = 1920,
    targetWidth,
    targetHeight,
    quality = 0.9,
    mode = 'contain',
  } = options

  return new Promise<Blob>((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      const { width: originalWidth, height: originalHeight } = img

      let finalWidth = originalWidth
      let finalHeight = originalHeight

      // 特定サイズが指定されている場合
      if (targetWidth && targetHeight) {
        finalWidth = targetWidth
        finalHeight = targetHeight
      } else {
        // インテリジェントリサイズ: 最大サイズを超える場合のみリサイズ
        if (originalWidth > maxSize || originalHeight > maxSize) {
          const aspectRatio = originalWidth / originalHeight

          if (originalWidth > originalHeight) {
            // 横長の画像: 幅を最大サイズに合わせる
            finalWidth = maxSize
            finalHeight = maxSize / aspectRatio
          } else {
            // 縦長の画像: 高さを最大サイズに合わせる
            finalHeight = maxSize
            finalWidth = maxSize * aspectRatio
          }
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = finalWidth
      canvas.height = finalHeight
      const ctx = canvas.getContext('2d')!

      // 描画パラメータを計算
      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number

      if (mode === 'exact' || (targetWidth && targetHeight && mode === 'cover')) {
        // exactモードまたはcoverモード: 指定サイズに合わせる
        const imgAspectRatio = originalWidth / originalHeight
        const targetAspectRatio = finalWidth / finalHeight

        if (mode === 'cover') {
          if (imgAspectRatio > targetAspectRatio) {
            drawHeight = finalHeight
            drawWidth = finalHeight * imgAspectRatio
            offsetX = (finalWidth - drawWidth) / 2
            offsetY = 0
          } else {
            drawWidth = finalWidth
            drawHeight = finalWidth / imgAspectRatio
            offsetX = 0
            offsetY = (finalHeight - drawHeight) / 2
          }

          // 背景を白で塗りつぶす
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, finalWidth, finalHeight)
        } else {
          // exact mode
          drawWidth = finalWidth
          drawHeight = finalHeight
          offsetX = 0
          offsetY = 0
        }
      } else {
        // containモード（デフォルト）: アスペクト比を保持
        drawWidth = finalWidth
        drawHeight = finalHeight
        offsetX = 0
        offsetY = 0
      }

      // Canvas に描画
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      // WebPを優先、フォールバックで指定形式
      const mimeType = 'image/webp'

      // Canvas を Blob に変換
      canvas.toBlob(
        (resizedBlob) => {
          URL.revokeObjectURL(url)
          if (resizedBlob) {
            resolve(resizedBlob)
          } else {
            reject(new Error('リサイズに失敗しました'))
          }
        },
        mimeType,
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('画像の読み込みに失敗しました'))
    }

    img.src = url
  })
}

export async function loadClipboardImage(): Promise<Blob | undefined> {
  const clipboardItems = await navigator.clipboard.read()
  for (const item of clipboardItems) {
    // MIMEタイプが image/ のデータを探す
    const imageType = item.types.find((type) => type.startsWith('image/'))
    if (imageType) {
      // 画像ファイルを取得
      return await item.getType(imageType)
    } else {
      return
    }
  }
}
