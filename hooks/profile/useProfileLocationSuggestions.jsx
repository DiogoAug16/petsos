import { useEffect, useRef, useState } from 'react';

import { searchCityLocations } from '@/services/locations/locations.service';

const DEBOUNCE_MS = 260;

export function useProfileLocationSuggestions(query) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return undefined;
    }

    const cacheKey = trimmedQuery.toLocaleLowerCase('pt-BR');
    if (cacheRef.current.has(cacheKey)) {
      setSuggestions(cacheRef.current.get(cacheKey));
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const result = await searchCityLocations(trimmedQuery, {
          signal: controller.signal,
        });
        if (!isActive) return;
        cacheRef.current.set(cacheKey, result);
        setSuggestions(result);
      } catch (error) {
        if (isActive && error?.name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      isActive = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]);

  return { suggestions, loading };
}
