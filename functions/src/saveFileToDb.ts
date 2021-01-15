const path = require('path')
const os = require('os')
const fs = require('fs')

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const spawn = require('child-process-promise').spawn

// TODO: sharpかnode-imagemagickでexifとwidth, heightをcanvasとか使って引っこ抜いてfirestoreに書き込む
// https://github.com/rsms/node-imagemagick
// https://sharp.pixelplumbing.com/
export const saveFileToDb = async (object) => {
  const bucketName = 'konkarin-portfolio.appspot.com'
  const fileBucket = object.bucket
  const filePath = object.name
  const contentType = object.contentType

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.')
    return null
  }

  // Get the file name.
  const fileName = path.basename(filePath)

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.')
    return null
  }

  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket)
  const tempFilePath = path.join(os.tmpdir(), fileName)

  const metadata = {
    contentType,
  }

  await bucket.file(filePath).download({ destination: tempFilePath })
  console.log('Image downloaded locally to', tempFilePath)

  // Get exif
  const result = await spawn('identify', ['-verbose', tempFilePath], {
    capture: ['stdout', 'stderr'],
  })

  const exif = imageMagickOutputToObject(result.stdout)
  console.log(exif)

  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempFilePath, '-thumbnail', '300x300>', tempFilePath])
  console.log('Thumbnail created at', tempFilePath)

  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  const thumbFileName = `thumb_${fileName}`
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName)

  // Uploading the thumbnail.
  await bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata,
  })

  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)

  const db = admin.firestore()
  const date = new Date()

  const document = {
    fileName,
    // NOTE: bucketのgetSignedUrlだと有効期限切れたら死ぬから下記で回避
    url: `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
      filePath
    )}?alt=media`,
    thumbFileName,
    thumburl: `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
      thumbFilePath
    )}?alt=media`,
    date,
    exif,
  }

  db.collection('images')
    .add(document)
    .then(() => console.log('Done'))
}

/**
 * Convert the output of ImageMagick's `identify -verbose` command to a JavaScript Object.
 */
function imageMagickOutputToObject(output) {
  let previousLineIndent = 0
  const lines = output.match(/[^\r\n]+/g)
  lines.shift() // Remove First line

  lines.forEach((line, index) => {
    const currentIdent = line.search(/\S/)
    line = line.trim()

    if (line.endsWith(':')) {
      lines[index] = makeKeyFirebaseCompatible(`"${line.replace(':', '":{')}`)
    } else {
      const split = line.replace('"', '\\"').split(': ')
      split[0] = makeKeyFirebaseCompatible(split[0])
      lines[index] = `"${split.join('":"')}",`
    }

    if (currentIdent < previousLineIndent) {
      lines[index - 1] = lines[index - 1].substring(
        0,
        lines[index - 1].length - 1
      )
      lines[index] =
        new Array(1 + (previousLineIndent - currentIdent) / 2).join('}') +
        ',' +
        lines[index]
    }
    previousLineIndent = currentIdent
  })

  output = lines.join('')
  output = '{' + output.substring(0, output.length - 1) + '}' // remove trailing comma.
  output = JSON.parse(output)
  console.log('Metadata extracted from image', output)
  return output
}

/**
 * Makes sure the given string does not contain characters that can't be used as Firebase
 * Realtime Database keys such as '.' and replaces them by '*'.
 */
function makeKeyFirebaseCompatible(key) {
  return key.replace(/\./g, '*')
}
