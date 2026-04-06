import { ComplaintCard } from '@/components/complaints/complaint-card';
import { ComplaintsHeader } from '@/components/complaints/complaint-header';
import { EmptyState } from '@/components/complaints/empty-state';
import { ErrorState } from '@/components/complaints/error-state';
import { LoadingState } from '@/components/complaints/loading-state';
import { SearchBar } from '@/components/search-bar/search-bar';
import { useComplaints } from '@/context/ComplaintsContext';
import { useComplaintsSearchFilter } from '@/hooks/useComplaintsSearchFilter';
import { useColorScheme } from '@/hooks/useColorScheme';
import { complaintsStyles } from '@/styles/complaints.styles';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

const keyExtractor = (item) => String(item.id);
const renderItem = ({ item }) => <ComplaintCard complaint={item} />;

export default function ComplaintsScreen() {
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const { data, loading, refreshing, error, refetchSilent, refresh } = useComplaints();
  const { search, setSearch, filteredData } = useComplaintsSearchFilter(data);

  useFocusEffect(
    useCallback(() => {
      refetchSilent();
    }, [refetchSilent])
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <View style={styles.container}>
      <ComplaintsHeader count={filteredData.length} />
      <SearchBar
        style={styles}
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          filteredData.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={<EmptyState />}
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
    </View>
  );
}