import { useState } from 'react'

const DefaultPageSizeOptions = [10, 20, 50] as const

/**
 * Paginación controlada para DataGrid (gluBox): pageIndex 0-based + pageSize.
 * Con `paging.pageSize` sin handlers el selector queda trabado.
 */
export function useGluDataGridPaging(initialPageSize = 10) {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(initialPageSize)

  return {
    paging: { enabled: true as const, pageIndex, pageSize },
    pageSizeOptions: [...DefaultPageSizeOptions],
    onPageChange: setPageIndex,
    onPageSizeChange: (size: number) => {
      setPageSize(size)
      setPageIndex(0)
    },
  }
}
