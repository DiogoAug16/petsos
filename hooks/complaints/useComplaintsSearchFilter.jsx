import { useState, useMemo } from 'react';

export function useComplaintsSearchFilter(data) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    return data.filter(item =>
      item.title?.toLowerCase().includes(query) ||
      item.type?.toLowerCase().includes(query) ||
      item.animal?.toLowerCase().includes(query)
    );
  }, [data, search]);

  return { search, setSearch, filteredData };
}