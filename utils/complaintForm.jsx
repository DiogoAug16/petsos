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
