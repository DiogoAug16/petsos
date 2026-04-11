import { getTimestampFromApiDate } from '@/utils/date.utils';
import { useCallback, useMemo, useState } from 'react';

export function useComplaintsListControls(data = []) {
  const [search, setSearch] = useState('');
  const [activeChip, setActiveChip] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const toggleSortOrder = useCallback(() => {
    setSortOrder((currentOrder) => (currentOrder === 'asc' ? 'desc' : 'asc'));
  }, []);

  const visibleComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    const searchFiltered = query
      ? data.filter((item) =>
          item.title?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query) ||
          item.animal?.toLowerCase().includes(query)
        )
      : data;

    const chipFiltered = activeChip
      ? searchFiltered.filter((item) => item.type === activeChip)
      : searchFiltered;

    return [...chipFiltered].sort((a, b) => {
      const dateA = getTimestampFromApiDate(a.createdAt);
      const dateB = getTimestampFromApiDate(b.createdAt);
      const safeDateA = Number.isFinite(dateA) ? dateA : 0;
      const safeDateB = Number.isFinite(dateB) ? dateB : 0;

      return sortOrder === 'asc' ? safeDateA - safeDateB : safeDateB - safeDateA;
    });
  }, [activeChip, data, search, sortOrder]);

  return {
    search,
    setSearch,
    activeChip,
    setActiveChip,
    sortOrder,
    toggleSortOrder,
    visibleComplaints,
  };
}
