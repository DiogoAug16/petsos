import { Text, View } from 'react-native';
import { complaintDescriptionStyles } from '../../styles/complaints/description.styles';

export default function ComplaintDescription({ description, theme }) {
  return (
    <View>
      <Text style={complaintDescriptionStyles.sectionTitle}>Descrição</Text>
      <Text style={[complaintDescriptionStyles.description, { color: theme.text }]}>
        {description}
      </Text>
    </View>
  );
}
