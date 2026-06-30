import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { CommentsSection } from "@/components/complaints/comments/comments-section";
import { DetailActionDock } from "@/components/complaints/detail/detail-action-dock";
import { DetailCommentComposerBar } from "@/components/complaints/detail/detail-comment-composer-bar";
import { DetailConfirmationModals } from "@/components/complaints/detail/detail-confirmation-modals";
import { DetailContentSection } from "@/components/complaints/detail/detail-content-section";
import { DetailHero } from "@/components/complaints/detail/detail-hero";
import { DetailLeadSection } from "@/components/complaints/detail/detail-lead-section";
import { ErrorState } from "@/components/complaints/states/error-state";
import { EvidenceValidationSection } from "@/components/complaints/evidence-validation/evidence-validation-section";
import { LoadingState } from "@/components/complaints/states/loading-state";
import { RequestValidationButton } from "@/components/complaints/request-validation/request-validation-button";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/context/AuthPromptContext";
import { useRequireVerifiedEmail } from "@/hooks/auth/useRequireVerifiedEmail";
import { useAddress } from "@/hooks/complaints/useAddress";
import { useColorScheme } from "@/hooks/ui/useColorScheme";
import { useCommentComposerVisibility } from "@/hooks/complaints/useCommentComposerVisibility";
import { useComplaintConfig } from "@/hooks/complaints/useComplaintConfig";
import { useComplaintDetailScreenData } from "@/hooks/complaints/useComplaintDetailScreenData";
import { useComplaintEvidence } from "@/hooks/complaints/useComplaintEvidence";
import { useComplaintReplyComposer } from "@/hooks/complaints/useComplaintReplyComposer";
import { COMPLAINT_REPORT_REASONS } from "@/constants/complaints/report-reasons.constants";
import { complaintsStyles } from "@/styles/complaints";
import Colors from "@/styles/theme/Colors";
import { reportComplaint } from "@/services/complaints/complaints.service";
import { openReportReasonAlert } from "@/utils/complaints/report-reason-alert.utils";

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams();
  const complaintId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const requireAuth = useRequireAuth();
  const requireVerifiedEmail = useRequireVerifiedEmail();
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const theme = Colors[colorScheme ?? "light"];
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
    fetchComplaintDetails,
    handleEdit,
    handleOpenMap,
    handleDelete,
  } = detail;

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
    reportCommentItem,
    incrementRepliesCount,
    isBlocked: commentsBlocked,
  } = commentsState;

  const { evidences, refresh: refreshEvidence } = useComplaintEvidence(
    complaintId,
    complaint?.status,
  );
  const [evidenceModalVisible, setEvidenceModalVisible] = useState(false);

  const { address } = useAddress(complaint?.location);
  const { status, type, emoji } = useComplaintConfig(complaint);
  const isOwner = Boolean(user?.uid && user.uid === complaint?.createdById);
  const canParticipate = isAuthenticated && isEmailVerified;

  const { composerState, handleReplyPress, handleComposerSubmit } =
    useComplaintReplyComposer({ addComment, handleInputFocus });
  const composerVisible = isCommentComposerVisible || composerState.isReplying;
  const composerSubmitting = composerState.isReplying
    ? composerState.submitting
    : commentSubmitting;

  const handleReportComplaint = () => {
    if (
      !requireAuth(null, {
        title: "Entre para reportar",
        message: "Faça login ou crie uma conta para reportar denúncias.",
      })
    ) {
      return;
    }

    if (
      !requireVerifiedEmail(null, {
        title: "Confirme seu email",
        message: "Confirme seu email para reportar denúncias.",
      })
    ) {
      return;
    }

    openReportReasonAlert({
      title: "Motivo do reporte",
      message: "Escolha por que esta denúncia deve ser analisada.",
      reasons: COMPLAINT_REPORT_REASONS,
      onSelect: async (reason) => {
        try {
          await reportComplaint(complaintId, reason);
          Alert.alert("Denúncia reportada", "A moderação recebeu seu reporte.");
        } catch (reportError) {
          Alert.alert(
            "Não foi possível reportar",
            reportError?.message ?? "Tente novamente em instantes.",
          );
        }
      },
    });
  };

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
      <ErrorState message={initialError} onRetry={retryInitialLoad} />,
    );
  }

  if (error && !complaint) {
    return renderScreenState(
      <ErrorState message={error} onRetry={fetchComplaintDetails} />,
    );
  }

  if (!complaint) return renderScreenState(null);

  return (
    <View style={styles.detailScreen}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.detailKeyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.detailScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.detailScrollContent,
            composerVisible &&
              canParticipate &&
              styles.detailScrollContentWithComposer,
          ]}
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
            onReport={handleReportComplaint}
          />

          <DetailActionDock
            complaint={complaint}
            followersState={followersState}
            isOwner={isOwner}
            volunteersState={volunteersState}
            onSubmitEvidence={() => {
              requireVerifiedEmail(() => setEvidenceModalVisible(true), {
                title: "Confirme seu email",
                message: "Confirme seu email para enviar evidências.",
              });
            }}
            styles={styles}
          />

          <DetailLeadSection
            address={address}
            complaint={complaint}
            followersState={followersState}
            isOwner={isOwner}
            status={status}
            type={type}
            emoji={emoji}
            styles={styles}
          />

          <DetailContentSection
            address={address}
            complaint={complaint}
            evidences={evidences}
            onOpenMap={handleOpenMap}
            styles={styles}
          />

          <RequestValidationButton
            complaint={complaint}
            isVolunteer={canParticipate && volunteersState.isVolunteer}
            evidences={evidences}
            onRequested={() => {
              fetchComplaintDetails();
            }}
          />

          <EvidenceValidationSection
            complaint={complaint}
            isOwner={isOwner}
            isVolunteer={canParticipate && volunteersState.isVolunteer}
            isFollowing={canParticipate && followersState.isFollowing}
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
            reportComment={reportCommentItem}
            toggleLike={toggleLike}
            incrementRepliesCount={incrementRepliesCount}
            onReplyPress={handleReplyPress}
            onSectionLayout={handleSectionLayout}
            onComposerAnchorLayout={handleComposerAnchorLayout}
            styles={styles}
          />
        </ScrollView>

        {canParticipate && (
          <DetailCommentComposerBar
            animatedStyle={commentComposerAnimatedStyle}
            composerState={composerState}
            composerSubmitting={composerSubmitting}
            composerVisible={composerVisible}
            onSubmit={async (text) => {
              const result = await handleComposerSubmit(text);
              if (result) {
                fetchComplaintDetails();
                refreshEvidence();
              }
              return result;
            }}
            onFocus={handleInputFocus}
            onBlur={() => {
              if (!composerState.isReplying) {
                handleInputBlur();
              }
            }}
            styles={styles}
          />
        )}
      </KeyboardAvoidingView>

      <DetailConfirmationModals
        complaintId={complaintId}
        evidenceModalVisible={evidenceModalVisible}
        followersState={followersState}
        onCloseEvidence={() => setEvidenceModalVisible(false)}
        onEvidenceSubmitted={() => {
          fetchComplaintDetails();
          refreshEvidence();
        }}
        styles={styles}
        volunteersState={volunteersState}
      />
    </View>
  );
}
