import * as ImageManipulator from 'expo-image-manipulator';
import { Image as RNImage } from 'react-native';

import {
  EVIDENCE_SUBMIT_JPEG_QUALITY,
  EVIDENCE_SUBMIT_MAX_UPLOAD_DIMENSION,
} from '@/constants/complaints/complaint-evidence-submit.constants';

const getImageSize = (uri) =>
  new Promise((resolve, reject) => {
    RNImage.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });

export const compressEvidencePhoto = async (uri) => {
  let actions = [];

  try {
    const { width, height } = await getImageSize(uri);
    const larger = Math.max(width, height);
    if (larger > EVIDENCE_SUBMIT_MAX_UPLOAD_DIMENSION) {
      actions =
        width >= height
          ? [{ resize: { width: EVIDENCE_SUBMIT_MAX_UPLOAD_DIMENSION } }]
          : [{ resize: { height: EVIDENCE_SUBMIT_MAX_UPLOAD_DIMENSION } }];
    }
  } catch {
    actions = [];
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: EVIDENCE_SUBMIT_JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return result.uri;
};

export const toEvidenceUploadFile = (uri, index) => {
  const fixedUri = uri.startsWith('file://') ? uri : `file://${uri}`;
  return {
    uri: fixedUri,
    name: `evidencia_${index}.jpg`,
    type: 'image/jpeg',
  };
};
