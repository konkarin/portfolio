import firebase from '@/plugins/firebase'

export type imgList = firebase.firestore.DocumentData[]

/**
 * firestoreから取得した画像をロードする
 */
export const preloadImgList = async () => {
  const snapshot = await firebase.firestore().collection('images').get()

  const imgList = snapshot.docs.map((doc) => doc.data())
  const urls: string[] = imgList.map((img) => img.thumburl)

  for (const url of urls) {
    const img = new Image()
    // TODO: onerrorのハンドリング
    img.src = url
  }

  return imgList
}
