import { useCallback } from 'react';

import { useComplaintComments } from '@/hooks/complaints/useComplaintComments';
import { useComplaintDetail } from '@/hooks/complaints/useComplaintDetail';
import { useComplaintFollowers } from '@/hooks/complaints/useComplaintFollowers';
import { useComplaintVolunteers } from '@/hooks/complaints/useComplaintVolunteers';

export function useComplaintDetailScreenData(complaintId) {
  const detail = useComplaintDetail(complaintId);
  const { fetchComplaintDetails } = detail;
  const followers = useComplaintFollowers(complaintId);
  const { refresh: refreshFollowers } = followers;

  const onVolunteerStatusChanged = useCallback(() => {
    fetchComplaintDetails();
    refreshFollowers();
  }, [fetchComplaintDetails, refreshFollowers]);

  const volunteers = useComplaintVolunteers(complaintId, {
    onStatusChanged: onVolunteerStatusChanged,
  });
  const comments = useComplaintComments(complaintId);

  const { complaint, error } = detail;
  const { initialError: followersError, initialReady: followersReady, refresh } = followers;
  const {
    initialError: volunteersError,
    initialReady: volunteersReady,
    refresh: refreshVolunteers,
  } = volunteers;
  const {
    initialError: commentsError,
    initialReady: commentsReady,
    loadInitial,
  } = comments;

  const hasComplaint = Boolean(complaint);
  const complaintError = !hasComplaint ? error : null;
  const socialError = followersError || volunteersError || commentsError;
  const initialError = complaintError || socialError;
  const initialLoading =
    !initialError && (!hasComplaint || !followersReady || !volunteersReady || !commentsReady);

  const retryInitialLoad = useCallback(() => {
    if (!complaint) {
      fetchComplaintDetails();
    }

    refresh();
    refreshVolunteers();
    loadInitial();
  }, [complaint, fetchComplaintDetails, loadInitial, refresh, refreshVolunteers]);

  return {
    detail,
    followers,
    volunteers,
    comments,
    initialLoading,
    initialError,
    retryInitialLoad,
  };
}
