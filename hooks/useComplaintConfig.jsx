import { ANIMAL_EMOJI, STATUS_CONFIG, TYPE_CONFIG } from '@/constants/complaints.constants';

export function useComplaintConfig(complaint) {
  if (!complaint) return { status: null, type: null, emoji: null };
  // Normalizar possíveis status vindos do backend (ex.: 'resolved')
  let statusKey = complaint.status;
  if (statusKey === 'resolved') statusKey = 'resolvido';

  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.aberto;
  const type = TYPE_CONFIG[complaint.type] ?? TYPE_CONFIG.outro;
  const emoji = ANIMAL_EMOJI[complaint.animal] ?? type.emoji;

  return { status, type, emoji };
}
