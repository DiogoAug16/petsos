import { ComplaintCard } from '@/components/complaints/complaint-card';
import { ComplaintsHeader } from '@/components/complaints/complaint-header';
import { EmptyState } from '@/components/complaints/empty-state';
import { ErrorState } from '@/components/complaints/error-state';
import { FilterChips } from '@/components/filter-chips/filter-chips';
import { LoadingState } from '@/components/complaints/loading-state';
import { SearchBar } from '@/components/search-bar/search-bar';
import { ComplaintsProvider, useComplaints } from '@/context/ComplaintsContext';
import { useComplaintsListControls } from '@/hooks/useComplaintsListControls';
import { useColorScheme } from '@/hooks/useColorScheme';
import { complaintsStyles } from '@/styles/complaints';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

const COMPLAINTS_BACKGROUND = require('@/assets/images/pets/denuncias_bg.webp');
const keyExtractor = (item) => String(item.id);
const renderItem = ({ item }) => <ComplaintCard complaint={item} />;

function ComplaintsScreenContent() {
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const {
    data,
    loading,
    loadingMore,
    refreshing,
    error,
    refetchSilent,
    refresh,
    loadMore,
  } = useComplaints();
  const {
    search,
    setSearch,
    activeChip,
    setActiveChip,
    sortOrder,
    toggleSortOrder,
    visibleComplaints,
  } = useComplaintsListControls(data);

  useFocusEffect(
    useCallback(() => {
      refetchSilent();
    }, [refetchSilent])
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <View style={styles.container}>
      <Image
        source={COMPLAINTS_BACKGROUND}
        style={styles.complaintsBackgroundImage}
        contentFit="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={styles.topPanel}>
        <ComplaintsHeader count={visibleComplaints.length} />
        <SearchBar
          style={styles}
          value={search}
          onChangeText={setSearch}
          showSortBtn
          sortOrder={sortOrder}
          onSortPress={toggleSortOrder}
        />
        <FilterChips activeChip={activeChip} onChipPress={setActiveChip} />
      </View>
      {visibleComplaints.length === 0 ? (
        <View style={styles.centered}>
          <EmptyState />
        </View>
      ) : (
        <FlatList
          data={visibleComplaints}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.35}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color="#FF9F1C" /> : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#FF9F1C"
              colors={['#FF9F1C']}
            />
          }
        />
      )}
    </View>
  );
}

export default function ComplaintsScreen() {
  return (
    <ComplaintsProvider>
      <ComplaintsScreenContent />
    </ComplaintsProvider>
  );
}
