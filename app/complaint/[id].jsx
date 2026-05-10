import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { CommentComposer } from '@/components/complaints/comment-composer';
import { CommentsSection } from '@/components/complaints/comments-section';
import { DetailFollowSummary } from '@/components/complaints/detail-follow-summary';
import { DetailHero } from '@/components/complaints/detail-hero';
import { DetailInfoBar } from '@/components/complaints/detail-info-bar';
import { DetailMainCard } from '@/components/complaints/detail-main-card';
import { DetailMapCard } from '@/components/complaints/detail-map-card';
import { DetailMapModal } from '@/components/complaints/detail-map-modal';
import { DetailPhotosCard } from '@/components/complaints/detail-photos-card';
import { ErrorState } from '@/components/complaints/error-state';
import { LoadingState } from '@/components/complaints/loading-state';
import { UnfollowConfirmModal } from '@/components/complaints/unfollow-confirm-modal';
import { complaintsStyles } from '@/styles/complaints';

import { useAddress } from '@/hooks/useAddress';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useComplaintConfig } from '@/hooks/useComplaintConfig';
import { useComplaintDetailScreenData } from '@/hooks/useComplaintDetailScreenData';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import Colors from '@/styles/theme/Colors';

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams();
  const complaintId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const theme = Colors[colorScheme ?? 'light'];
  const mapRef = useRef();
  const {
    isVisible: isCommentComposerVisible,
    handleViewportLayout,
    handleScroll,
    handleSectionLayout,
  } = useSectionVisibility();

  const {
    detail,
    followers: followersState,
    comments: commentsState,
    initialLoading,
    initialError,
    retryInitialLoad,
  } = useComplaintDetailScreenData(complaintId);

  const {
    complaint,
    loading,
    error,
    showMapModal,
    fetchComplaintDetails,
    handleEdit,
    handleOpenMap,
    handleDelete,
    handleCloseMapModal,
  } = detail;

  const {
    isFollowing,
    followers,
    totalFollowers,
    loading: followersLoading,
    actionLoading: followLoading,
    unfollowModalVisible,
    toggleFollow,
    closeUnfollowModal,
    confirmUnfollow,
  } = followersState;

  const {
    comments,
    totalComments,
    pageInfo: commentsPageInfo,
    loading: commentsLoading,
    loadingMore: commentsLoadingMore,
    submitting: commentSubmitting,
    loadMore: loadMoreComments,
    addComment,
    toggleLike,
    incrementRepliesCount,
  } = commentsState;

  const { address } = useAddress(complaint?.location);
  const { status, type, emoji } = useComplaintConfig(complaint);
  const isOwner = user?.uid === complaint?.createdById;
  const renderScreenState = (children) => (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {children}
    </>
  );

  if (initialLoading || (loading && !complaint)) {
    return renderScreenState(<LoadingState message="Carregando denúncia..." />);
  }

  if (initialError) {
    return renderScreenState(
      <ErrorState message={initialError} onRetry={retryInitialLoad} />
    );
  }

  if (error && !complaint) {
    return renderScreenState(
      <ErrorState message={error} onRetry={fetchComplaintDetails} />
    );
  }

  if (!complaint) return renderScreenState(null);

  return (
    <View style={styles.detailScreen}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.detailKeyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.detailScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 18 }}
          onLayout={handleViewportLayout}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <DetailHero
            complaint={complaint}
            type={type}
            emoji={emoji}
            styles={styles}
            theme={theme}
            isOwner={isOwner}
            onBack={() => router.back()}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {!isOwner && (
            <DetailFollowSummary
              followers={followers}
              totalFollowers={totalFollowers}
              followersLoading={followersLoading}
              followLoading={followLoading}
              isFollowing={isFollowing}
              isOwner={isOwner}
              onToggleFollow={toggleFollow}
              styles={styles}
            />
          )}

          <DetailInfoBar
            complaint={complaint}
            status={status}
            type={type}
            emoji={emoji}
            styles={styles}
            colorScheme={colorScheme}
          />

          <View style={styles.detailContent}>
            <DetailMainCard
              complaint={complaint}
              address={address}
              followers={followers}
              totalFollowers={totalFollowers}
              followersLoading={followersLoading}
              showFollowers={isOwner}
              styles={styles}
            />
            <DetailPhotosCard photos={complaint.photos} styles={styles} />
            <DetailMapCard
              location={complaint.location}
              address={address}
              onOpenMap={() => handleOpenMap(mapRef)}
              styles={styles}
            />
          </View>

          <CommentsSection
            complaintId={complaintId}
            comments={comments}
            totalComments={totalComments}
            pageInfo={commentsPageInfo}
            loading={commentsLoading}
            loadingMore={commentsLoadingMore}
            loadMore={loadMoreComments}
            toggleLike={toggleLike}
            incrementRepliesCount={incrementRepliesCount}
            onLayout={handleSectionLayout}
            styles={styles}
          />
        </ScrollView>

        {isCommentComposerVisible && (
          <View style={styles.detailCommentInputBar}>
            <CommentComposer
              placeholder="Adicionar comentário..."
              submitting={commentSubmitting}
              onSubmit={addComment}
              styles={styles}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      <UnfollowConfirmModal
        visible={unfollowModalVisible}
        loading={followLoading}
        onCancel={closeUnfollowModal}
        onConfirm={confirmUnfollow}
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
