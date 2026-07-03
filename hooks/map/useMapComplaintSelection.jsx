import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { prefetchComplaintById } from '@/services/complaints/complaints.service';
import { getDrivingRoute } from '@/services/map/routes.service';
import { appLogger } from '@/utils/shared/app-logger';

export function useMapComplaintSelection({ location, mapRef, router }) {
  const routeRequestRef = useRef(0);
  const fitRouteTimeoutRef = useRef(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [routeComplaintId, setRouteComplaintId] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeRenderKey, setRouteRenderKey] = useState(0);
  const [routeLoadingComplaintId, setRouteLoadingComplaintId] = useState(null);

  const selectedCoordinate = useMemo(() => {
    const latitude = Number(selectedComplaint?.location?.latitude);
    const longitude = Number(selectedComplaint?.location?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { latitude, longitude };
  }, [selectedComplaint]);

  const selectMapComplaint = useCallback(
    (complaint) => {
      setSelectedComplaint(complaint);
      setPreviewVisible(true);

      const complaintId = complaint?.id ?? complaint?._id;
      if (complaintId) prefetchComplaintById(complaintId);

      const latitude = Number(complaint?.location?.latitude);
      const longitude = Number(complaint?.location?.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        450,
      );
    },
    [mapRef],
  );

  const clearSelectedComplaint = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  const clearPendingFit = useCallback(() => {
    if (fitRouteTimeoutRef.current) {
      clearTimeout(fitRouteTimeoutRef.current);
      fitRouteTimeoutRef.current = null;
    }
  }, []);

  const showSelectedRoute = useCallback(async () => {
    if (!location || !selectedComplaint || !selectedCoordinate) return;

    const selectedComplaintId = selectedComplaint.id ?? selectedComplaint._id;
    if (!selectedComplaintId) return;

    const routeIsActive =
      routeComplaintId === selectedComplaintId && routeCoordinates.length > 1;

    if (routeIsActive) {
      routeRequestRef.current += 1;
      clearPendingFit();
      setRouteComplaintId(null);
      setRouteCoordinates([]);
      setRouteRenderKey((current) => current + 1);
      setRouteLoadingComplaintId(null);
      return;
    }

    if (routeLoadingComplaintId === selectedComplaintId) return;

    const requestId = routeRequestRef.current + 1;
    routeRequestRef.current = requestId;
    clearPendingFit();
    setRouteLoadingComplaintId(selectedComplaintId);
    const start = { latitude: location.latitude, longitude: location.longitude };
    let nextRoute = null;

    try {
      const route = await getDrivingRoute(start, selectedCoordinate);
      if (route?.length > 1) {
        nextRoute = route;
      }
    } catch (error) {
      appLogger.warn('Falha ao buscar rota no mapa', { error });
    }

    if (requestId !== routeRequestRef.current) return;
    setRouteLoadingComplaintId(null);

    if (!nextRoute) {
      setRouteComplaintId(null);
      setRouteCoordinates([]);
      setRouteRenderKey((current) => current + 1);
      return;
    }

    setRouteComplaintId(selectedComplaintId);
    setRouteCoordinates(nextRoute);
    setRouteRenderKey((current) => current + 1);
    fitRouteTimeoutRef.current = setTimeout(() => {
      mapRef.current?.fitToCoordinates(nextRoute, {
        edgePadding: { top: 120, right: 64, bottom: 260, left: 64 },
        animated: true,
      });
      fitRouteTimeoutRef.current = null;
    }, 80);
  }, [
    clearPendingFit,
    location,
    mapRef,
    routeComplaintId,
    routeCoordinates.length,
    routeLoadingComplaintId,
    selectedComplaint,
    selectedCoordinate,
  ]);

  const openSelectedComplaintDetails = useCallback(() => {
    const complaintId = selectedComplaint?.id ?? selectedComplaint?._id;
    if (complaintId) router.push(`/complaint/${complaintId}`);
  }, [router, selectedComplaint]);

  useEffect(() => clearPendingFit, [clearPendingFit]);

  return {
    isPreviewVisible,
    routeComplaintId,
    routeCoordinates,
    routeRenderKey,
    routeLoadingComplaintId,
    selectedComplaint,
    selectedCoordinate,
    clearSelectedComplaint,
    openSelectedComplaintDetails,
    selectMapComplaint,
    showSelectedRoute,
  };
}
