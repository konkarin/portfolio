interface Img {
  date: string
  exif: any
  height: number
  originalFileName: string
  originalFilePath: string
  originalUrl: string
  thumbFilePath: string
  thumbUrl: string
  width: number
}

export const loadImgList = async (imgList: Img[]) => {
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
