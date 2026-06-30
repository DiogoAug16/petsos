import { Alert } from 'react-native';

export const openReportReasonAlert = ({ title, message, reasons, onSelect }) => {
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    ...reasons.map((reason) => ({
      text: reason.label,
      onPress: () => onSelect(reason.value),
    })),
  ]);
};
