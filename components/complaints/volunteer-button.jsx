import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function VolunteerButton({
  complaint,
  isOwner,
  isVolunteer,
  volunteerLoading,
  onToggleVolunteer,
  styles,
}) {
  if (isOwner) return null;
  if (complaint?.status !== 'aberto' && complaint?.status !== 'em_andamento') return null;

  return (
    <View style={styles.statusUpdateContainer}>
      <Pressable
        style={[
          styles.volunteerButton,
          isVolunteer && styles.volunteerButtonActive,
          volunteerLoading && { opacity: 0.6 },
        ]}
        onPress={onToggleVolunteer}
        disabled={volunteerLoading}
      >
        <Ionicons
          name={isVolunteer ? 'hand-left' : 'hand-left-outline'}
          size={18}
          color={isVolunteer ? '#10B981' : '#fff'}
        />
        <Text
          style={[
            styles.volunteerButtonText,
            isVolunteer && styles.volunteerButtonActiveText,
          ]}
        >
          {isVolunteer ? 'Voluntariado' : 'Voluntariar-se'}
        </Text>
      </Pressable>
    </View>
  );
}
