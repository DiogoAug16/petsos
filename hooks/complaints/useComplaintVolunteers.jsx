import {
  volunteerForComplaint,
  unvolunteerFromComplaint,
  getIsVolunteer,
  getVolunteersCount,
  getComplaintVolunteers,
} from '@/services/complaints/complaint-volunteers.service';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/context/AuthPromptContext';
import { useCallback, useEffect, useState } from 'react';

const normalizeVolunteers = (response) =>
  Array.isArray(response?.data) ? response.data : [];

const normalizeCount = (response) => {
  if (typeof response?.data === 'number') return response.data;
  return Number(response?.data?.totalVolunteers ?? response?.data?.count ?? 0);
};

export function useComplaintVolunteers(complaintId, { onStatusChanged } = {}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const requireAuth = useRequireAuth();
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [volunteerModalVisible, setVolunteerModalVisible] = useState(false);
  const [unvolunteerModalVisible, setUnvolunteerModalVisible] = useState(false);
  const [initialReady, setInitialReady] = useState(false);
  const [initialError, setInitialError] = useState(null);

  const loadVolunteers = useCallback(async () => {
    if (!complaintId) return;

    const countResponse = await getVolunteersCount(complaintId);
    setTotalVolunteers(normalizeCount(countResponse));

    if (!isAuthenticated) {
      setVolunteers([]);
      return;
    }

    const volunteersResponse = await getComplaintVolunteers(complaintId);
    setVolunteers(normalizeVolunteers(volunteersResponse));
  }, [complaintId, isAuthenticated]);

  const refresh = useCallback(async () => {
    if (!complaintId) {
      setInitialReady(false);
      setInitialError('Não foi possível identificar a denúncia.');
      return false;
    }

    if (authLoading) {
      setInitialReady(false);
      return false;
    }

    try {
      setLoading(true);
      setInitialReady(false);
      setInitialError(null);

      if (!isAuthenticated) {
        setVolunteers([]);
        setTotalVolunteers(0);
        setIsVolunteer(false);
        setInitialReady(true);
        return true;
      }

      const [volunteerResponse] = await Promise.all([
        getIsVolunteer(complaintId),
        loadVolunteers(),
      ]);

      setIsVolunteer(Boolean(volunteerResponse?.data?.isVolunteer));
      setInitialReady(true);
      return true;
    } catch {
      setIsVolunteer(false);
      setVolunteers([]);
      setTotalVolunteers(0);
      setInitialReady(false);
      setInitialError('Não foi possível carregar os voluntários.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [authLoading, complaintId, isAuthenticated, loadVolunteers]);

  const refreshVolunteers = useCallback(async () => {
    if (!complaintId) return false;

    try {
      await loadVolunteers();
      return true;
    } catch {
      return false;
    }
  }, [complaintId, loadVolunteers]);

  const doVolunteer = useCallback(async () => {
    if (!complaintId || actionLoading) return false;

    if (!isAuthenticated) {
      requireAuth(null, {
        title: 'Entre para se voluntariar',
        message:
          'Faça login ou crie uma conta para se voluntariar em denúncias.',
      });
      return false;
    }

    const previousState = isVolunteer;
    const shouldIncrement = !previousState;

    try {
      setActionLoading(true);
      setIsVolunteer(true);
      if (shouldIncrement) {
        setTotalVolunteers((current) => current + 1);
      }

      await volunteerForComplaint(complaintId);
      await refreshVolunteers();
      onStatusChanged?.();
      return true;
    } catch (err) {
      if (err?.message?.includes('409')) {
        setIsVolunteer(true);
        const refreshed = await refreshVolunteers();
        if (!refreshed && shouldIncrement) {
          setTotalVolunteers((current) => Math.max(current - 1, 0));
        }
        return true;
      }

      setIsVolunteer(previousState);
      if (shouldIncrement) {
        setTotalVolunteers((current) => Math.max(current - 1, 0));
      }
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [
    actionLoading,
    complaintId,
    isAuthenticated,
    isVolunteer,
    onStatusChanged,
    refreshVolunteers,
    requireAuth,
  ]);

  const doUnvolunteer = useCallback(async () => {
    if (!complaintId || actionLoading) return false;

    if (!isAuthenticated) {
      requireAuth(null, {
        title: 'Entre para se voluntariar',
        message:
          'Faça login ou crie uma conta para se voluntariar em denúncias.',
      });
      return false;
    }

    const previousState = isVolunteer;
    const shouldDecrement = previousState;

    try {
      setActionLoading(true);
      setIsVolunteer(false);
      if (shouldDecrement) {
        setTotalVolunteers((current) => Math.max(current - 1, 0));
      }

      await unvolunteerFromComplaint(complaintId);
      await refreshVolunteers();
      onStatusChanged?.();
      return true;
    } catch {
      setIsVolunteer(previousState);
      if (shouldDecrement) {
        setTotalVolunteers((current) => current + 1);
      }
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [
    actionLoading,
    complaintId,
    isAuthenticated,
    isVolunteer,
    onStatusChanged,
    refreshVolunteers,
    requireAuth,
  ]);

  const toggleVolunteer = useCallback(() => {
    requireAuth(
      () => {
        if (isVolunteer) {
          setUnvolunteerModalVisible(true);
          return;
        }
        setVolunteerModalVisible(true);
      },
      {
        title: 'Entre para se voluntariar',
        message:
          'Faça login ou crie uma conta para se voluntariar em denúncias.',
      },
    );
  }, [isVolunteer, requireAuth]);

  const closeVolunteerModal = useCallback(() => {
    setVolunteerModalVisible(false);
  }, []);

  const confirmVolunteer = useCallback(async () => {
    const success = await doVolunteer();
    if (success) {
      setVolunteerModalVisible(false);
    }
  }, [doVolunteer]);

  const closeUnvolunteerModal = useCallback(() => {
    setUnvolunteerModalVisible(false);
  }, []);

  const confirmUnvolunteer = useCallback(async () => {
    const success = await doUnvolunteer();
    if (success) {
      setUnvolunteerModalVisible(false);
    }
  }, [doUnvolunteer]);

  useEffect(() => {
    setInitialReady(false);
    setInitialError(null);
    refresh();
  }, [refresh]);

  return {
    isVolunteer,
    volunteers,
    totalVolunteers,
    loading,
    actionLoading,
    volunteerModalVisible,
    unvolunteerModalVisible,
    initialReady,
    initialError,
    toggleVolunteer,
    closeVolunteerModal,
    confirmVolunteer,
    closeUnvolunteerModal,
    confirmUnvolunteer,
    refresh,
  };
}
