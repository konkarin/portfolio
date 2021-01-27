import firebase from '@/plugins/firebase'
import Firestore from '@/api/firestore'

export type DocumentData = firebase.firestore.DocumentData[]

type ProfileData = {
  profile: string
}

/**
 * firestoreから取得した画像をロードする
 */
export const loadImgList = async () => {
  const collectionRef = firebase
    .firestore()
    .collection(`/users/y6VxBfC6TPPWTRvV5siYr1wzfBx2/images`)

  const snapshot = await collectionRef.get()

  const imgList = snapshot.docs.map((doc) => doc.data())
  const urls: string[] = imgList.map((img) => img.thumbUrl)

  for (const url of urls) {
    const img = new Image()
    // TODO: onerrorのハンドリング
    img.src = url
  }

  return imgList
}

export const saveProfile = async (data: ProfileData) => {
  try {
    const fn = firebase.functions().httpsCallable('saveProfile')
    return await fn(data)
  } catch (e) {
    return e
  }
}

export default {
  Db: new Firestore(),
}
