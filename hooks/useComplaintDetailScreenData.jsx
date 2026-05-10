import { useCallback } from 'react';

import { useComplaintComments } from '@/hooks/useComplaintComments';
import { useComplaintDetail } from '@/hooks/useComplaintDetail';
import { useComplaintFollowers } from '@/hooks/useComplaintFollowers';

export function useComplaintDetailScreenData(complaintId) {
  const detail = useComplaintDetail(complaintId);
  const followers = useComplaintFollowers(complaintId);
  const comments = useComplaintComments(complaintId);

  const { complaint, error, fetchComplaintDetails } = detail;
  const { initialError: followersError, initialReady: followersReady, refresh } = followers;
  const {
    initialError: commentsError,
    initialReady: commentsReady,
    loadInitial,
  } = comments;

  const hasComplaint = Boolean(complaint);
  const complaintError = !hasComplaint ? error : null;
  const socialError = followersError || commentsError;
  const initialError = complaintError || socialError;
  const initialLoading =
    !initialError && (!hasComplaint || !followersReady || !commentsReady);

  const retryInitialLoad = useCallback(() => {
    if (!complaint) {
      fetchComplaintDetails();
    }

    refresh();
    loadInitial();
  }, [complaint, fetchComplaintDetails, loadInitial, refresh]);

  return {
    detail,
    followers,
    comments,
    initialLoading,
    initialError,
    retryInitialLoad,
  };
}
