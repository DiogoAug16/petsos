import { apiFetch } from './api';

export async function getComplaints(signal) {
  const result = await apiFetch('/complaints', { signal });

  if (Array.isArray(result)) return result;

  const arrayKey = Object.keys(result).find(key => Array.isArray(result[key]));
  return arrayKey ? result[arrayKey] : [];
}


//Envio do Formulario de criação de denúncia para o backend
export async function createComplaint(data) {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('type', data.type);
  formData.append('animal', data.animal);
  formData.append('status', data.status);
  formData.append('location', JSON.stringify(data.location));

  //  MULTIPLAS FOTOS
  if (data.imageUris && data.imageUris.length > 0) {
    data.imageUris.forEach((uri, index) => {
      formData.append('photos', {
        uri,
        name: `foto_${index}.jpg`,
        type: 'image/jpeg',
      });
    });
  }

  return apiFetch('/complaints', {
    method: 'POST',
    body: formData,
  });

}