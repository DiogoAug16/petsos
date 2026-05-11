export const getPhotoPath = (photo) => {
  if (typeof photo === 'string') return photo;
  if (!photo || typeof photo !== 'object') return null;
  return photo.url || photo.uri || photo.path || photo.filePath || null;
};

export const isAbsolutePhotoUri = (photoPath) => {
  return /^(https?:|file:|content:|data:)/i.test(String(photoPath || ''));
};

export const buildUploadPhotoUri = (photo, uploadUrl) => {
  const photoPath = getPhotoPath(photo);
  if (!photoPath) return null;
  if (isAbsolutePhotoUri(photoPath)) return photoPath;
  if (!uploadUrl) return photoPath;

  const baseUrl = uploadUrl.endsWith('/') ? uploadUrl.slice(0, -1) : uploadUrl;
  const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
  return `${baseUrl}${normalizedPath}`;
};
