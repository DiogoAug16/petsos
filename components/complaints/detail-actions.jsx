import { Pressable, Text, View } from 'react-native';

export function DetailActions({ isHelping, onToggleHelp, onEdit, onDelete, styles }) {
  return (
    <View style={styles.detailActionsFixed}>
      <Pressable 
        style={[styles.detailBtnHelp, isHelping && styles.detailBtnHelping]}
        onPress={onToggleHelp}
      >
        <Text style={styles.detailBtnHelpText}>{isHelping ? 'Ajudando' : 'Ajudar'}</Text>
        <Text style={{ fontSize: 16 }}>{isHelping ? '✅' : '🤝'}</Text>
      </Pressable>

      <Pressable style={styles.detailBtnEdit} onPress={onEdit}>
        <Text style={{ fontSize: 16 }}>✏️</Text>
        <Text style={styles.detailBtnEditText}>Editar</Text>
      </Pressable>

      <Pressable style={styles.detailBtnDelete} onPress={onDelete}>
        <Text style={{ fontSize: 16 }}>🗑️</Text>
      </Pressable>
    </View>
  );
}
