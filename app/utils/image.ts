import type { DocumentData } from 'firebase/firestore'

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

export async function resizeImage(blob: Blob, targetWidth = 1200, targetHeight = 630) {
  return new Promise<Blob>((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')!

      const imgAspectRatio = img.width / img.height
      const targetAspectRatio = targetWidth / targetHeight

      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number

      if (imgAspectRatio > targetAspectRatio) {
        // 画像の横幅が長い → 横をトリミング
        drawHeight = targetHeight
        drawWidth = targetHeight * imgAspectRatio
        offsetX = (targetWidth - drawWidth) / 2
        offsetY = 0
      } else {
        // 画像の縦幅が長い → 縦をトリミング
        drawWidth = targetWidth
        drawHeight = targetWidth / imgAspectRatio
        offsetX = 0
        offsetY = (targetHeight - drawHeight) / 2
      }

      // 背景を白で塗りつぶす（透明な画像の場合）
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      // Canvas に描画（リサイズ & トリミング）
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      // Canvas を Blob に変換
      canvas.toBlob((resizedBlob) => {
        URL.revokeObjectURL(url)
        if (resizedBlob) {
          resolve(resizedBlob)
        } else {
          reject(new Error('トリミングとリサイズに失敗しました'))
        }
      }, 'image/webp')
    }

    img.onerror = () => {
      URL.revokeObjectURL(url) // メモリを解放
      reject(new Error('画像の読み込みに失敗しました'))
    }

    img.src = url // 画像を読み込む
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
