import { Switch, Text, View } from 'react-native';

export default function ComplaintAnonymousOption({ value, onChange }) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0D8BF',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#272A3A', fontWeight: '800', fontSize: 15 }}>
            Denunciar anonimamente
          </Text>

          <Text style={{ color: '#8D7D78', fontSize: 13, marginTop: 4 }}>
            Seu nome e foto não aparecerão publicamente.
          </Text>
        </View>

        <Switch value={value} onValueChange={onChange} />
      </View>
    </View>
  );
}