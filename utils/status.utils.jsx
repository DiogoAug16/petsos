export const cleanStatusLabel = (label) =>
  String(label || '')
    .trim()
    .replace(/^[^A-Za-zÀ-ÿ0-9]+\s*/, '');
