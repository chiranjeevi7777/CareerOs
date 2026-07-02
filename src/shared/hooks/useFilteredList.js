import { useState, useMemo } from 'react';

/**
 * Client-side search + pagination over an array.
 *
 * @param {Array} items     - Full array to filter
 * @param {Function} filterFn - (item, query) => boolean
 * @param {number} pageSize  - Items per page (default 20)
 *
 * Usage:
 *   const { filtered, query, setQuery, page, setPage, totalPages } =
 *     useFilteredList(applications, (a, q) => a.company.toLowerCase().includes(q));
 */
export const useFilteredList = (items, filterFn, pageSize = 20) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) => filterFn(item, query.toLowerCase()));
  }, [items, query, filterFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return {
    filtered: paginated,
    allFiltered: filtered,
    query,
    setQuery: (q) => { setQuery(q); setPage(1); },
    page,
    setPage,
    totalPages,
  };
};
