export function validateComplaintForm({
  title,
  description,
  type,
  animal,
  animalOther,
  locationMode,
  address,
}) {
  if (!title.trim()) {
    return 'Informe o título.';
  }

  if (!description.trim()) {
    return 'Informe a descrição.';
  }

  if (!type) {
    return 'Selecione o tipo da denúncia.';
  }

  if (!animal) {
    return 'Selecione o tipo de animal.';
  }

  if (locationMode === 'text' && !address.trim()) {
    return 'Digite o endereço.';
  }

  return null;
}

export const normalizeComplaintResponse = (response) =>
  response?.data || response?.complaint || response;

export const normalizeLocation = (location) => {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return { latitude, longitude };
};

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const normalizeComplaintType = (value, complaintTypes) => {
  const normalized = normalizeText(value);
  if (!normalized) return '';

  const directMatch = complaintTypes.find(
    (item) =>
      normalizeText(item.value) === normalized ||
      normalizeText(item.label) === normalized,
  );

  if (directMatch) return directMatch.value;

  if (normalized.includes('maus')) return 'maus-tratos fisicos';
  if (normalized.includes('neglig')) return 'negligencia';
  if (normalized.includes('aband')) return 'abandono';
  if (normalized.includes('perd')) return 'perdido';
  if (normalized.includes('outro')) return 'outro';

  return '';
};

export const normalizeAnimalType = (value, animalTypes) => {
  const normalized = normalizeText(value);
  if (!normalized) return '';

  const directMatch = animalTypes.find(
    (item) =>
      normalizeText(item.value) === normalized ||
      normalizeText(item.label) === normalized,
  );

  if (directMatch) return directMatch.value;

  if (normalized.includes('cach') || normalized.includes('cao')) return 'cachorro';
  if (normalized.includes('gat')) return 'gato';
  if (normalized.includes('pass')) return 'passaro';
  if (normalized.includes('outro')) return 'outro';

  return '';
};
