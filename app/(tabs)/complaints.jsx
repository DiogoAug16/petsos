import { ComplaintCard } from '@/components/complaints/complaint-card';
import { ComplaintsHeader } from '@/components/complaints/complaint-header';
import { EmptyState } from '@/components/complaints/empty-state';
import { ErrorState } from '@/components/complaints/error-state';
import { LoadingState } from '@/components/complaints/loading-state';
import { useComplaints } from '@/context/ComplaintsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { complaintsStyles } from '@/styles/complaints.styles';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

export default function ComplaintsScreen() {
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const { data, loading, refreshing, error, refetchSilent, refresh } = useComplaints();

  useFocusEffect(
    useCallback(() => {
      refetchSilent();
    }, [refetchSilent])
  );

  const renderItem = useCallback(
    ({ item }) => <ComplaintCard complaint={item} styles={styles} />,
    [styles],
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  if (loading) return <LoadingState styles={styles} />;
  if (error) return <ErrorState message={error} onRetry={refresh} styles={styles} />;

  return (
    <View style={styles.container}>
      <ComplaintsHeader count={data.length} />

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          data.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={<EmptyState styles={styles} />}
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