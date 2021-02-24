import Firestore from '@/api/firestore'
import firebase from '@/plugins/firebase'

interface ProfileData {
  profile: string
}

const db = new Firestore()

/**
 * firestoreから取得した画像をロードする
 */
export const loadImgList = async () => {
  const collectionPath = `/users/${process.env.authorId}/images`

  const imgList = await db.getDocs(collectionPath)

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
  db,
}
