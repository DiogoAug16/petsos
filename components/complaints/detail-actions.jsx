import { Pressable, Text, View } from 'react-native';

export function DetailActions({ isHelping, isOwner, onToggleHelp, onEdit, onDelete, loading, styles }) {
  return (
    <View style={styles.detailActionsFixed}>
      <Pressable
        style={[styles.detailBtnHelp, isHelping && styles.detailBtnHelping, loading && styles.detailBtnDisabled]}
        onPress={onToggleHelp}
        disabled={loading}
      >
        <Text style={styles.detailBtnHelpText}>
          {loading ? 'Carregando...' : isHelping ? 'Acompanhando' : 'Assumir'}
        </Text>

        <Text style={{ fontSize: 16 }}>
          {isHelping ? '✅' : '🤝'}
        </Text>
      </Pressable>

      {isOwner && (
        <Pressable style={styles.detailBtnEdit} onPress={onEdit}>
          <Text style={{ fontSize: 16 }}>✏️</Text>
          <Text style={styles.detailBtnEditText}>Editar</Text>
        </Pressable>
      )}

      {isOwner && (
        <Pressable style={styles.detailBtnDelete} onPress={onDelete}>
          <Text style={{ fontSize: 16 }}>🗑️</Text>
        </Pressable>
      )}
    </View>
  );
}