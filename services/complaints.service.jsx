import * as ImageManipulator from 'expo-image-manipulator';
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

  // Campos básicos da denúncia
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('type', data.type);
  formData.append('animal', data.animal);
  formData.append('status', data.status);
  formData.append('location', JSON.stringify(data.location));


 //  MULTIPLAS FOTOS
for (let i = 0; i < data.photos.length; i++) {
  const uri = data.photos[i];
  // Converte imagem (resolve HEIC e outros formatos)
  const convertedUri = await convertToJpg(uri);
  // Corrige URI caso necessário
  const fixedUri = convertedUri.startsWith('file://')
    ? convertedUri
    : 'file://' + convertedUri;
  // Adiciona ao FormData
  formData.append('photos', {
    uri: fixedUri,
    name: `foto_${i}.jpg`,
    type: 'image/jpeg',
  });
}
  // Envia para API
  return apiFetch('/complaints', {
    method: 'POST',
    body: formData,
  });

}

//Converte qualquer imagem para formato JPEG. Isso é útil para garantir
//  compatibilidade, especialmente com fotos tiradas em iPhones que podem estar no formato HEIC.
async function convertToJpg(uri) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [],
    {
      compress: 1, // mantém qualidade máxima (pode ajustar depois)
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  return result.uri;
}