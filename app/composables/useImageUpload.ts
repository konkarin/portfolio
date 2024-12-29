import { getStorage, uploadBytes, ref as storageRef } from 'firebase/storage'

export function useImageUpload() {
  const isUploading = ref(false)

  /**
   * @param path e.g. users/{userId}/{uuid}/...
   */
  async function uploadImage(file: File, path: string): Promise<string | undefined> {
    isUploading.value = true

    try {
      const result = await uploadBytes(storageRef(getStorage(), `${path}/${file.name}`), file, {
        cacheControl: 'public, max-age=31536000, s-maxage=31536000',
      })

      return `https://firebasestorage.googleapis.com/v0/b/${
        result.metadata.bucket
      }/o/${encodeURIComponent(result.metadata.fullPath)}?alt=media`
    } catch (e) {
      console.error(e)
      return
    } finally {
      isUploading.value = false
    }
  }

  return {
    uploadImage,
    isUploading,
  }
}
