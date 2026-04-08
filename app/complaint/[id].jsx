import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';

import { DetailActions } from '@/components/complaints/detail-actions';
import { DetailDescriptionCard } from '@/components/complaints/detail-description-card';
import { DetailHelpToast } from '@/components/complaints/detail-help-toast';
import { DetailHero } from '@/components/complaints/detail-hero';
import { DetailInfoBar } from '@/components/complaints/detail-info-bar';
import { DetailMapCard } from '@/components/complaints/detail-map-card';
import { DetailMapModal } from '@/components/complaints/detail-map-modal';
import { DetailPhotosCard } from '@/components/complaints/detail-photos-card';
import { DetailRegistrarCard } from '@/components/complaints/detail-registrar-card';
import { DetailTitleCard } from '@/components/complaints/detail-title-card';
import { ErrorState } from '@/components/complaints/error-state';
import { LoadingState } from '@/components/complaints/loading-state';
import { complaintsStyles } from '@/styles/complaints';

import Colors from '@/constants/Colors';
import { useAddress } from '@/hooks/useAddress';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useComplaintConfig } from '@/hooks/useComplaintConfig';
import { useComplaintDetail } from '@/hooks/useComplaintDetail';

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const theme = Colors[colorScheme ?? 'light'];
  const mapRef = useRef();
  
  const {
    complaint,
    loading,
    error,
    isHelping,
    showMapModal,
    fetchComplaintDetails,
    handleToggleHelp,
    handleEdit,
    handleOpenMap,
    handleDelete,
    handleShare,
    handleCloseMapModal,
  } = useComplaintDetail(id);

  const { address } = useAddress(complaint?.location);
  const { status, type, emoji } = useComplaintConfig(complaint);

  if (loading && !complaint) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchComplaintDetails} />;
  if (!complaint) return null;
  
  return (
    <View style={styles.detailScreen}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <DetailHero 
          complaint={complaint}
          type={type}
          emoji={emoji}
          styles={styles}
          theme={theme}
          onBack={() => router.back()}
          onShare={handleShare}
        />

        <DetailInfoBar 
          complaint={complaint}
          status={status}
          type={type}
          emoji={emoji}
          isHelping={isHelping}
          styles={styles}
          colorScheme={colorScheme}
        />

        <View style={styles.detailContent}>
          <DetailTitleCard complaint={complaint} address={address} styles={styles} />
          <DetailDescriptionCard description={complaint.description} styles={styles} />
          <DetailPhotosCard photos={complaint.photos} styles={styles} />
          <DetailMapCard 
            location={complaint.location}
            address={address}
            onOpenMap={() => handleOpenMap(mapRef)}
            styles={styles}
          />
          <DetailRegistrarCard complaint={complaint} styles={styles} />
          <DetailHelpToast isHelping={isHelping} styles={styles} />
        </View>
      </ScrollView>

      <DetailActions 
        isHelping={isHelping}
        onToggleHelp={handleToggleHelp}
        onEdit={handleEdit}
        onDelete={handleDelete}
        styles={styles}
      />

      <DetailMapModal 
        visible={showMapModal}
        location={complaint.location}
        mapRef={mapRef}
        onClose={handleCloseMapModal}
        styles={styles}
        theme={theme}
      />
    </View>
  );
}
