import { ComplaintCard } from '@/components/complaints/complaint-card';
import { ComplaintsHeader } from '@/components/complaints/complaint-header';
import { EmptyState } from '@/components/complaints/empty-state';
import { ErrorState } from '@/components/complaints/error-state';
import { FilterChips } from '@/components/filter-chips/filter-chips';
import { LoadingState } from '@/components/complaints/loading-state';
import { SearchBar } from '@/components/search-bar/search-bar';
import { useComplaints } from '@/context/ComplaintsContext';
import { useComplaintsSearchFilter } from '@/hooks/useComplaintsSearchFilter';
import { useColorScheme } from '@/hooks/useColorScheme';
import { complaintsStyles } from '@/styles/complaints.styles';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

const keyExtractor = (item) => String(item.id);
const renderItem = ({ item }) => <ComplaintCard complaint={item} />;

export default function ComplaintsScreen() {
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const { data, loading, refreshing, error, refetchSilent, refresh } = useComplaints();
  const { search, setSearch, filteredData } = useComplaintsSearchFilter(data);
  const [activeChip, setActiveChip] = useState(null);

  useFocusEffect(
    useCallback(() => {
      refetchSilent();
    }, [refetchSilent])
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  const chipFilteredData = activeChip
    ? filteredData.filter((item) => item.type === activeChip)
    : filteredData;

  return (
    <View style={styles.container}>
      <ComplaintsHeader count={chipFilteredData.length} />
      <SearchBar
        style={styles}
        value={search}
        onChangeText={setSearch}
      />
      <FilterChips activeChip={activeChip} onChipPress={setActiveChip} />
      {chipFilteredData.length === 0 ? (
        <View style={styles.centered}>
          <EmptyState />
        </View>
      ) : (
        <FlatList
          data={chipFilteredData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#FF6B35"
              colors={['#FF6B35']}
            />
          }
        />
      )}
    </View>
  );
}