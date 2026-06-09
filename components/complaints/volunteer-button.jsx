import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function VolunteerButton({
  complaint,
  isOwner,
  isVolunteer,
  volunteerLoading,
  onToggleVolunteer,
  onSubmitEvidence,
  styles,
}) {
  if (complaint?.status !== 'aberto' && complaint?.status !== 'em_andamento') return null;

  if (isOwner) {
    if (complaint?.status !== 'em_andamento') return null;

    return (
      <View style={styles.statusUpdateContainer}>
        <Pressable
          style={[styles.volunteerButton, { backgroundColor: '#FF6B35' }]}
          onPress={onSubmitEvidence}
        >
          <Ionicons name="camera-outline" size={18} color="#fff" />
          <Text style={styles.volunteerButtonText}>Enviar Evidência</Text>
        </Pressable>
      </View>
    );
  }

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

      {isVolunteer && complaint?.status === 'em_andamento' && (
        <Pressable
          style={[styles.volunteerButton, { marginTop: 8, backgroundColor: '#FF6B35' }]}
          onPress={onSubmitEvidence}
        >
          <Ionicons name="camera-outline" size={18} color="#fff" />
          <Text style={styles.volunteerButtonText}>Enviar Evidência</Text>
        </Pressable>
      )}
    </View>
  );
}
