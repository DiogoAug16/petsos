import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { toastStyles } from '@/styles/toast.styles';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[toastStyles.container, toastStyles.successBorder]}>
      <View style={[toastStyles.iconContainer, toastStyles.successIconBg]}>
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
      </View>
      <View style={toastStyles.textContainer}>
        <Text style={toastStyles.title}>{text1}</Text>
        {text2 && <Text style={toastStyles.subtitle}>{text2}</Text>}
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={[toastStyles.container, toastStyles.errorBorder]}>
      <View style={[toastStyles.iconContainer, toastStyles.errorIconBg]}>
        <Ionicons name="alert-circle" size={24} color="#EF4444" />
      </View>
      <View style={toastStyles.textContainer}>
        <Text style={toastStyles.title}>{text1}</Text>
        {text2 && <Text style={toastStyles.subtitle}>{text2}</Text>}
      </View>
    </View>
  ),
};
