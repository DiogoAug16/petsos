import { FOCUS_REGION_DELTA, SUGGESTION_MAX_ITEMS } from '@/constants/map.constants';
import { useCallback, useMemo, useState } from 'react';

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useMapSearchAutocomplete(validComplaints = []) {
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedComplaint, setHighlightedComplaint] = useState(null);

  const suggestions = useMemo(() => {
    const query = normalizeText(searchText.trim());

    if (!query) return [];

    return validComplaints
      .filter((complaint) => {
        const title = normalizeText(complaint.title);
        const type = normalizeText(complaint.type);
        return title.includes(query) || type.includes(query);
      })
      .sort((a, b) => {
        const aStartsWith = normalizeText(a.title).startsWith(query) ? 1 : 0;
        const bStartsWith = normalizeText(b.title).startsWith(query) ? 1 : 0;

        if (aStartsWith !== bStartsWith) return bStartsWith - aStartsWith;
        return String(a.title || '').localeCompare(String(b.title || ''), 'pt-BR');
      })
      .slice(0, SUGGESTION_MAX_ITEMS);
  }, [searchText, validComplaints]);

  const highlightedCoordinate = useMemo(() => {
    const latitude = Number(highlightedComplaint?.location?.latitude);
    const longitude = Number(highlightedComplaint?.location?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return { latitude, longitude };
  }, [highlightedComplaint]);

  const handleSearchTextChange = useCallback((text) => {
    setSearchText(text);
    setShowSuggestions(Boolean(text.trim()));

    if (!text.trim()) {
      setHighlightedComplaint(null);
    }
  }, []);

  const hideSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  const selectSuggestion = useCallback((complaint) => {
    const latitude = Number(complaint?.location?.latitude);
    const longitude = Number(complaint?.location?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    setSearchText(String(complaint?.title || ''));
    setHighlightedComplaint(complaint ?? null);
    setShowSuggestions(false);

    return {
      latitude,
      longitude,
      latitudeDelta: FOCUS_REGION_DELTA,
      longitudeDelta: FOCUS_REGION_DELTA,
    };
  }, []);

  return {
    searchText,
    suggestions,
    highlightedCoordinate,
    shouldRenderSuggestions: showSuggestions && suggestions.length > 0,
    handleSearchTextChange,
    hideSuggestions,
    selectSuggestion,
  };
}
