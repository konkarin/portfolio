const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const spawn = require('child-process-promise').spawn;
const path = require('path')
const os = require('os')
const fs = require('fs')

exports.saveFileToDb = functions.storage.object().onFinalize(async (object) => {
  const bucketName = 'konkarin-portfolio.appspot.com';
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.'); // eslint-disable-line no-console
    return null;
  }
  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.'); // eslint-disable-line no-console
    return null;
  }
  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const metadata = {
    contentType: contentType,
  };
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log('Image downloaded locally to', tempFilePath); // eslint-disable-line no-console
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempFilePath, '-thumbnail', '300x300>', tempFilePath]);
  console.log('Thumbnail created at', tempFilePath);  // eslint-disable-line no-console
  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  const thumbFileName = `thumb_${fileName}`;
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
  // Uploading the thumbnail.
  await bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata: metadata,
  });
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath);

  const db = admin.firestore();
  const date = new Date();

  db.collection('images').add({
    fileName,
    url: `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`,
    thumbFileName,
    thumburl: `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(thumbFilePath)}?alt=media`,
    date,
  }).then(() => console.log('Done')); // eslint-disable-line no-console
});

exports.deleteFileFromStorage = functions.firestore.document('images/{imageId}').onDelete((snap, context) => {
  const bucketName = 'konkarin-portfolio.appspot.com';
  const bucket = admin.storage().bucket(bucketName);
  const deletedValue = snap.data().fileName;

  bucket.file(deletedValue).delete().then(() => {
    console.log(`gs://${bucketName}/${deletedValue} deleted.`); // eslint-disable-line no-console
  })
    .catch(err => {
      console.error('ERROR:', err); // eslint-disable-line no-console
    });

  bucket.file(`thumb_${deletedValue}`).delete().then(() => {
    console.log(`gs://${bucketName}/thumb_${deletedValue} deleted.`); // eslint-disable-line no-console
  })
    .catch(err => {
      console.error('ERROR:', err); // eslint-disable-line no-console
    });
});