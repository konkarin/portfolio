import exifr from 'exifr'

export const getExif = async (tempFilePath: string) => {
  const exifInfo = await exifr.parse(tempFilePath).catch((e) => {
    console.error(e)
    return null
  })

  console.log('Get Exif')
  return exifInfo
}
