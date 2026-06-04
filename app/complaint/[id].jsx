import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import { CommentComposer } from '@/components/complaints/comment-composer';
import { CommentsSection } from '@/components/complaints/comments-section';
import { DetailFollowSummary } from '@/components/complaints/detail-follow-summary';
import { DetailHero } from '@/components/complaints/detail-hero';
import { DetailInfoBar } from '@/components/complaints/detail-info-bar';
import { DetailMainCard } from '@/components/complaints/detail-main-card';
import { DetailMapCard } from '@/components/complaints/detail-map-card';
import { DetailMapModal } from '@/components/complaints/detail-map-modal';
import { DetailPhotosCard } from '@/components/complaints/detail-photos-card';
import { EvidenceSection } from '@/components/complaints/evidence-section';
import { EvidenceSubmitModal } from '@/components/complaints/evidence-submit-modal';
import { EvidenceValidationSection } from '@/components/complaints/evidence-validation-section';
import { VolunteerButton } from '@/components/complaints/volunteer-button';
import { ErrorState } from '@/components/complaints/error-state';
import { LoadingState } from '@/components/complaints/loading-state';
import { FollowConfirmModal } from '@/components/complaints/follow-confirm-modal';
import { UnfollowConfirmModal } from '@/components/complaints/unfollow-confirm-modal';
import { VolunteerConfirmModal } from '@/components/complaints/volunteer-confirm-modal';
import { UnvolunteerConfirmModal } from '@/components/complaints/unvolunteer-confirm-modal';
import { useAuth } from '@/context/AuthContext';
import { useAddress } from '@/hooks/useAddress';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCommentComposerVisibility } from '@/hooks/useCommentComposerVisibility';
import { useComplaintConfig } from '@/hooks/useComplaintConfig';
import { useComplaintDetailScreenData } from '@/hooks/useComplaintDetailScreenData';
import { useComplaintEvidence } from '@/hooks/useComplaintEvidence';
import { useComplaintReplyComposer } from '@/hooks/useComplaintReplyComposer';
import { complaintsStyles } from '@/styles/complaints';
import Colors from '@/styles/theme/Colors';

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams();
  const complaintId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const theme = Colors[colorScheme ?? 'light'];
  const mapRef = useRef();
  const {
    isVisible: isCommentComposerVisible,
    animatedStyle: commentComposerAnimatedStyle,
    handleViewportLayout,
    handleScroll,
    handleSectionLayout,
    handleComposerAnchorLayout,
    handleInputFocus,
    handleInputBlur,
  } = useCommentComposerVisibility();

  const {
    detail,
    followers: followersState,
    volunteers: volunteersState,
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
    followModalVisible,
    unfollowModalVisible,
    toggleFollow,
    closeFollowModal,
    confirmFollow,
    closeUnfollowModal,
    confirmUnfollow,
  } = followersState;

  const {
    isVolunteer,
    actionLoading: volunteerLoading,
    volunteerModalVisible,
    unvolunteerModalVisible,
    toggleVolunteer,
    closeVolunteerModal,
    confirmVolunteer,
    closeUnvolunteerModal,
    confirmUnvolunteer,
  } = volunteersState;

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
    isBlocked: commentsBlocked,
  } = commentsState;

  const { evidences, refresh: refreshEvidence } = useComplaintEvidence(complaintId, complaint?.status);
  const [evidenceModalVisible, setEvidenceModalVisible] = useState(false);

  const { address } = useAddress(complaint?.location);
  const { status, type, emoji } = useComplaintConfig(complaint);
  const isOwner = Boolean(user?.uid && user.uid === complaint?.createdById);
  const {
    composerState,
    handleReplyPress,
    handleComposerSubmit,
  } = useComplaintReplyComposer({ addComment, handleInputFocus });
  const composerVisible = isCommentComposerVisible || composerState.isReplying;
  const composerSubmitting = composerState.isReplying
    ? composerState.submitting
    : commentSubmitting;

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
          contentContainerStyle={{
            paddingBottom: composerVisible && isAuthenticated ? 104 : 18,
          }}
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

          <VolunteerButton
            complaint={complaint}
            isOwner={isOwner}
            isVolunteer={isVolunteer}
            volunteerLoading={volunteerLoading}
            onToggleVolunteer={toggleVolunteer}
            onSubmitEvidence={() => setEvidenceModalVisible(true)}
            styles={styles}
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
            <EvidenceSection evidences={evidences} styles={styles} />
          </View>

          <EvidenceValidationSection
            complaint={complaint}
            isOwner={isOwner}
            isVolunteer={isVolunteer}
            isFollowing={isFollowing}
            evidences={evidences}
            onStatusChanged={() => {
              fetchComplaintDetails();
              refreshEvidence();
            }}
          />

          <CommentsSection
            complaintId={complaintId}
            comments={comments}
            totalComments={totalComments}
            pageInfo={commentsPageInfo}
            loading={commentsLoading}
            loadingMore={commentsLoadingMore}
            isBlocked={commentsBlocked}
            loadMore={loadMoreComments}
            toggleLike={toggleLike}
            incrementRepliesCount={incrementRepliesCount}
            onReplyPress={handleReplyPress}
            onSectionLayout={handleSectionLayout}
            onComposerAnchorLayout={handleComposerAnchorLayout}
            styles={styles}
          />
        </ScrollView>

        {isAuthenticated && (
          <Animated.View
            pointerEvents={composerVisible ? 'auto' : 'none'}
            style={[styles.detailCommentInputBar, commentComposerAnimatedStyle]}
          >
            <CommentComposer
              key={composerState.key}
              placeholder={composerState.placeholder}
              submitting={composerSubmitting}
              initialText={composerState.initialText}
              autoFocus={composerState.isReplying}
              onSubmit={handleComposerSubmit}
              onFocus={handleInputFocus}
              onBlur={() => {
                if (!composerState.isReplying) {
                  handleInputBlur();
                }
              }}
              styles={styles}
            />
          </Animated.View>
        )}
      </KeyboardAvoidingView>

      <FollowConfirmModal
        visible={followModalVisible}
        loading={followLoading}
        onCancel={closeFollowModal}
        onConfirm={confirmFollow}
        styles={styles}
      />

      <UnfollowConfirmModal
        visible={unfollowModalVisible}
        loading={followLoading}
        onCancel={closeUnfollowModal}
        onConfirm={confirmUnfollow}
        styles={styles}
      />

      <VolunteerConfirmModal
        visible={volunteerModalVisible}
        loading={volunteerLoading}
        onCancel={closeVolunteerModal}
        onConfirm={confirmVolunteer}
        styles={styles}
      />

      <UnvolunteerConfirmModal
        visible={unvolunteerModalVisible}
        loading={volunteerLoading}
        onCancel={closeUnvolunteerModal}
        onConfirm={confirmUnvolunteer}
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

      <EvidenceSubmitModal
        visible={evidenceModalVisible}
        complaintId={complaintId}
        onClose={() => setEvidenceModalVisible(false)}
        onSubmitted={() => {
          fetchComplaintDetails();
          refreshEvidence();
        }}
      />
    </View>
  );
}
