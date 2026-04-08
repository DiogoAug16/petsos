import { ANIMAL_EMOJI, STATUS_CONFIG, TYPE_CONFIG } from '@/constants/complaints.constants';

export function useComplaintConfig(complaint) {
  if (!complaint) return { status: null, type: null, emoji: null };

  const status = STATUS_CONFIG[complaint.status] ?? STATUS_CONFIG.aberto;
  const type = TYPE_CONFIG[complaint.type] ?? TYPE_CONFIG.outro;
  const emoji = ANIMAL_EMOJI[complaint.animal] ?? type.emoji;

  return { status, type, emoji };
}
