import firebase from '@/plugins/firebase'

export type DocumentData = firebase.firestore.DocumentData[]

/**
 * firestoreから取得した画像をロードする
 */
export const loadImgList = async () => {
  const collectionRef = firebase
    .firestore()
    .collection(`/users/y6VxBfC6TPPWTRvV5siYr1wzfBx2/images`)

  const snapshot = await collectionRef.get()

  const imgList = snapshot.docs.map((doc) => doc.data())
  const urls: string[] = imgList.map((img) => img.thumburl)

  for (const url of urls) {
    const img = new Image()
    // TODO: onerrorのハンドリング
    img.src = url
  }

  return imgList
}
