import { FILTER_CHIPS } from '@/constants/complaints.constants';
import { Text, TouchableOpacity, View } from 'react-native';

export function FiltroDenuncias({
  style,
  visible = false,
  selectedType = null,
  onSelectType = () => {},
  onApply = () => {},
  onClear = () => {},
}) {
  if (!visible) return null;

  return (
    <View style={style.filterPanel}>
      <Text style={style.filterTitle}>Filtrar denúncias</Text>
      <Text style={style.filterLabel}>Tipo</Text>

      <View style={style.filterStatusList}>
        {FILTER_CHIPS.map((option) => {
          const isActive = selectedType === option.value;

          return (
            <TouchableOpacity
              key={option.label}
              style={[
                style.filterStatusOption,
                isActive ? style.filterStatusOptionActive : null,
              ]}
              onPress={() => onSelectType(option.value)}
            >
              <Text
                style={[
                  style.filterStatusOptionText,
                  isActive ? style.filterStatusOptionTextActive : null,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={style.filterActions}>
        <TouchableOpacity style={style.filterClearButton} onPress={onClear}>
          <Text style={style.filterClearButtonText}>Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.filterApplyButton} onPress={onApply}>
          <Text style={style.filterApplyButtonText}>Aplicar filtros</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
