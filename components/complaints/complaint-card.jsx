import { useAddress } from '@/hooks/useAddress';
import { formatDate } from '@/utils/date.utils';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { Pressable, Text, View } from 'react-native';
import { ANIMAL_EMOJI, STATUS_CONFIG, TYPE_CONFIG } from '@/constants/complaints.costants';
import Animated from 'react-native-reanimated';
import { useHaptics } from '@/hooks/useHaptics';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { complaintsStyles } from '@/styles/complaints';
import { memo } from 'react';

function ComplaintCardComponent({ complaint}) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const { address, loadingAddress } = useAddress(complaint.location);
  const { triggerHaptics } = useHaptics();
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);

  const type = TYPE_CONFIG[complaint.type] ?? TYPE_CONFIG.outro;
  const status = STATUS_CONFIG[complaint.status] ?? STATUS_CONFIG.aberto;
  const emoji = ANIMAL_EMOJI[complaint.animal] ?? type.emoji;

  const handlePressIn = () => {
    onPressIn();
    triggerHaptics('soft');
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={onPressOut}
      onPress={() => {}}
    >
        <Animated.View style={[styles.card, animatedStyle]}>
            <View style={styles.cardTop}>
                <View style={[styles.cardPhoto, { backgroundColor: type.photoColor }]}>
                <Text style={styles.cardPhotoEmoji}>{emoji}</Text>
                </View>

                <View style={styles.cardBody}>
                <View style={[styles.badgeBase, styles[type.badge]]}>
                    <Text style={[styles.badgeTextBase, styles[type.badgeText]]}>
                    {type.label}
                    </Text>
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                    {complaint.title}
                </Text>

                {address && (
                    <Text
                    style={[
                        styles.cardAddress,
                        loadingAddress && styles.cardAddressMuted,
                    ]}
                    numberOfLines={1}
                    >
                    📍 {address}
                    </Text>
                )}
                </View>
            </View>

            <View style={styles.cardDivider} />
            <View style={styles.cardFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="time-outline" size={14} style={styles.cardDate} />
                  <Text style={styles.cardDate}>{formatDate(complaint.createdAt)}</Text>
                </View>
                <View style={styles[status.container]}>
                <Text style={styles[status.text]}>{status.label}</Text>
                </View>
            </View>
        </Animated.View>
    </Pressable>
  );
}

export const ComplaintCard = memo(ComplaintCardComponent);