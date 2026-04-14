import * as ImageManipulator from 'expo-image-manipulator';
import { Image as RNImage } from 'react-native';
import { apiFetch } from './api';

const MAX_UPLOAD_DIMENSION = 1280;
const JPEG_UPLOAD_QUALITY = 0.72;

export async function getComplaints(signal) {
  const result = await apiFetch('/complaints', { signal });

  if (Array.isArray(result)) return result;

  const arrayKey = Object.keys(result).find(key => Array.isArray(result[key]));
  return arrayKey ? result[arrayKey] : [];
}


//Envio do Formulario de criação de denúncia para o backend
export async function createComplaint(data) {
  const formData = new FormData();

  // Campos básicos da denúncia
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('type', data.type);
  formData.append('animal', data.animal);
  formData.append('status', data.status);
  formData.append('location', JSON.stringify(data.location));

  const convertedPhotos = await Promise.all(
    (Array.isArray(data.photos) ? data.photos : []).map(async (uri, index) => {
      const convertedUri = await convertToJpg(uri);
      const fixedUri = convertedUri.startsWith('file://')
        ? convertedUri
        : `file://${convertedUri}`;

      return {
        uri: fixedUri,
        name: `foto_${index}.jpg`,
        type: 'image/jpeg',
      };
    })
  );

  convertedPhotos.forEach((photo) => {
    formData.append('photos', photo);
  });

  // Envia para API
  return apiFetch('/complaints', {
    method: 'POST',
    body: formData,
  });

}

const getImageSize = (uri) =>
  new Promise((resolve, reject) => {
    RNImage.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      reject
    );
  });

async function convertToJpg(uri) {
  let actions = [];

  try {
    const { width, height } = await getImageSize(uri);
    const largerSide = Math.max(width, height);

    if (Number.isFinite(largerSide) && largerSide > MAX_UPLOAD_DIMENSION) {
      actions = width >= height
        ? [{ resize: { width: MAX_UPLOAD_DIMENSION } }]
        : [{ resize: { height: MAX_UPLOAD_DIMENSION } }];
    }
  } catch (_error) {
    actions = [];
  }

  const result = await ImageManipulator.manipulateAsync(
    uri,
    actions,
    {
      compress: JPEG_UPLOAD_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  return result.uri;
}

const isLocalPhotoUri = (uri) =>
  /^(file:|content:|ph:|assets-library:)/i.test(String(uri || ''));

export async function getComplaintById(id, signal) {
  return await apiFetch(`/complaints/${id}`, { signal });
}

export async function deleteComplaint(id) {
  return await apiFetch(`/complaints/${id}`, { method: 'DELETE' });
  
}

export async function updateComplaint(id, data) {
  const hasPhotosField = Array.isArray(data.photos);

  const payload = {
    title: data.title,
    description: data.description,
    type: data.type,
    animal: data.animal,
    status: data.status,
    photos: hasPhotosField ? data.photos.filter((photo) => Boolean(photo)) : undefined,
    location: data.location
      ? {
          latitude: Number(data.location.latitude),
          longitude: Number(data.location.longitude),
        }
      : undefined,
  };

  const localPhotos = hasPhotosField && Array.isArray(payload.photos)
    ? payload.photos.filter((photo) => isLocalPhotoUri(photo))
    : [];

  const existingPhotos = hasPhotosField && Array.isArray(payload.photos)
    ? payload.photos.filter((photo) => !isLocalPhotoUri(photo))
    : [];

  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('type', payload.type);
  formData.append('animal', payload.animal);

  if (payload.status !== undefined) {
    formData.append('status', payload.status);
  }

  if (payload.location) {
    formData.append('location', JSON.stringify(payload.location));
  }

  if (hasPhotosField) {
    formData.append('existingPhotos', JSON.stringify(existingPhotos));
  }

  if (localPhotos.length > 0) {
    const convertedPhotos = await Promise.all(
      localPhotos.map(async (uri, index) => {
        const convertedUri = await convertToJpg(uri);
        const fixedUri = convertedUri.startsWith('file://')
          ? convertedUri
          : `file://${convertedUri}`;

        return {
          uri: fixedUri,
          name: `foto_editada_${index}.jpg`,
          type: 'image/jpeg',
        };
      })
    );

    convertedPhotos.forEach((photo) => {
      formData.append('photos', photo);
    });
  }

  return await apiFetch(`/complaints/${id}`, {
    method: 'PATCH',
    body: formData,
  });
}

// Função para buscar denúncias próximas com base na localização
export async function getNearbyComplaints(lat, lng, radiusKm = 5) {
  return apiFetch(`/complaints/nearest?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);
}
