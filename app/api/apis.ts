import firebase from '../utils/firebase'
import Firestore from './firestore'

interface ProfileData {
  profile: string
}

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

const db = new Firestore()

export const loadImgList = async (imgList: Img[]) => {
  const urls: string[] = imgList.map((img) => img.thumbUrl)

  const promiseList = []
  for (const url of urls) {
    promiseList.push(loadImg(url))
  }

  return await Promise.allSettled(promiseList)
}

export const loadImg = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = () => reject(url)
    img.src = url
  })
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
