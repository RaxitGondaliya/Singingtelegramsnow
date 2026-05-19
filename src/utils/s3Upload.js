import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import imageCompression from 'browser-image-compression';

const REGION = 'us-east-1';
const IDENTITY_POOL_ID = 'us-east-1:f62f63c3-cd32-4146-ac59-514006515def';

export const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
});

const BUCKET       = 'stn-deployments-mobilehub-1291405271';
export const BASE_URL     = 'https://s3.us-east-1.amazonaws.com/stn-deployments-mobilehub-1291405271/';
export const IMG_FOLDER   = 'character_images/';
export const VID_FOLDER   = 'character_videos/';
export const THUMB_FOLDER = 'character_thumb_images/';

export async function uploadToS3(file, s3Key) {
  const buffer = await file.arrayBuffer();
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: new Uint8Array(buffer),
    ContentType: file.type,
    ACL: 'public-read',
  }));
  return s3Key;
}

// Compress main image (80% quality equivalent)
export async function compressImage(file) {
  return imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
}

// Generate thumbnail from image (100px height)
export async function generateImageThumbnail(file) {
  return imageCompression(file, { maxSizeMB: 0.05, maxWidthOrHeight: 100, useWebWorker: true });
}

// Generate thumbnail from video (grab first frame)
export function generateVideoThumbnail(videoFile) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.currentTime = 0.1;
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(blob => resolve(new File([blob], 'thumb.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.6);
    };
  });
}

export async function uploadAllMedia(mediaList) {
  const txMedia = [];

  // Pass 1: upload actual files
  for (const item of mediaList) {
    let s3Key;
    if (!item.isVideo) {
      const compressed = await compressImage(item.localFile);
      s3Key = `${IMG_FOLDER}pic_${Date.now()}.jpg`;
      await uploadToS3(compressed, s3Key);
    } else {
      s3Key = `${VID_FOLDER}video_${Date.now()}.mp4`;
      await uploadToS3(item.localFile, s3Key);
    }
    item.s3Key = s3Key;
    txMedia.push({
      vMediaName: s3Key.split('/').pop(),   // filename only
      vMediaType: item.isVideo ? 'video' : 'image',
      vFileType:  item.isVideo ? 'video/mp4' : '',
      vThumb: '',                            // filled in pass 2
      tiMarkAsCoverPhoto: item.isCover ? 1 : 0,
    });
  }

  // Pass 2: upload thumbnails
  for (let i = 0; i < mediaList.length; i++) {
    const item = mediaList[i];
    const thumbFile = item.isVideo
      ? await generateVideoThumbnail(item.localFile)
      : await generateImageThumbnail(item.localFile);
    const thumbKey = `${THUMB_FOLDER}thumbnail_${Date.now()}.jpg`;
    await uploadToS3(thumbFile, thumbKey);
    txMedia[i].vThumb = thumbKey.split('/').pop();  // filename only
  }

  return txMedia;
}
