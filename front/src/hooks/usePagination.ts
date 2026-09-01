import { useState } from 'react';

export function usePagination(initialPageSize = 20) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);

  function goToPage(next: number) {
    setPage(Math.max(1, next));
  }

  return { page, pageSize, goToPage, resetPage: () => setPage(1) };
}
