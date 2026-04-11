export function getTimestampFromApiDate(value) {
  if (!value) return Number.NaN;

  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;

  if (typeof value === 'object' && value.$date) {
    return getTimestampFromApiDate(value.$date);
  }

  if (typeof value !== 'string') return Number.NaN;

  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) return parsed;

  const [datePart, timePart = '00:00:00'] = value.trim().split(' ');
  const [day, month, year] = datePart.split('/');

  if (!day || !month || !year) return Number.NaN;

  const normalizedYear = year.length === 2 ? `20${year}` : year;
  const normalizedDate = `${normalizedYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`;
  return Date.parse(normalizedDate);
}

export function formatDate(isoString) {
  const timestamp = getTimestampFromApiDate(isoString);
  if (!Number.isFinite(timestamp)) return '—';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return 'agora mesmo';
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffH < 24) return `há ${diffH}h`;
  if (diffD === 1) return 'ontem';
  return `há ${diffD} dias`;
}
