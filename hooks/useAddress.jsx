import { getAddressFromCoords, formatCoords } from '@/utils/location.utils';
import { useEffect, useState } from 'react';

export function useAddress(location) {
  const [address, setAddress] = useState(
    location ? formatCoords(location.latitude, location.longitude) : null,
  );
  const [loadingAddress, setLoadingAddress] = useState(!!location);

  useEffect(() => {
    if (!location) return;

    let cancelled = false;
    const { latitude, longitude } = location;

    setLoadingAddress(true);

    getAddressFromCoords(latitude, longitude).then((result) => {
      if (cancelled) return;

      setAddress(result);
      setLoadingAddress(false);
    });

    return () => {
      cancelled = true;
    };
  }, [location]);

  return { address, loadingAddress };
}