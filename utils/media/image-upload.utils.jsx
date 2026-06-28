import * as ImageManipulator from 'expo-image-manipulator';
import { Image as RNImage } from 'react-native';

const MAX_UPLOAD_DIMENSION = 1280;
const JPEG_UPLOAD_QUALITY = 0.72;

export const isLocalMediaUri = (uri) => {
  return /^(file:|content:|ph:|assets-library:)/i.test(String(uri || ''));
};

const getImageSize = (uri) =>
  new Promise((resolve, reject) => {
    RNImage.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });

export async function convertLocalImageToJpeg(uri) {
  let actions = [];

  try {
    const { width, height } = await getImageSize(uri);
    const largerSide = Math.max(width, height);

    if (Number.isFinite(largerSide) && largerSide > MAX_UPLOAD_DIMENSION) {
      actions =
        width >= height
          ? [{ resize: { width: MAX_UPLOAD_DIMENSION } }]
          : [{ resize: { height: MAX_UPLOAD_DIMENSION } }];
    }
  } catch {
    actions = [];
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: JPEG_UPLOAD_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return result.uri;
}

export async function buildImageUploadFile(uri, name = 'foto.jpg') {
  const convertedUri = await convertLocalImageToJpeg(uri);
  const fixedUri = convertedUri.startsWith('file://')
    ? convertedUri
    : `file://${convertedUri}`;

  return {
    uri: fixedUri,
    name,
    type: 'image/jpeg',
  };
}
