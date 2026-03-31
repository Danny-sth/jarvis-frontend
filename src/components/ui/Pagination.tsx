import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = (): number[] => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showFirstLast = totalPages > maxVisible;

  return (
    <div className="flex items-center justify-center gap-1">
      {/* First Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:bg-jarvis-cyan/10 text-jarvis-text-secondary hover:text-jarvis-cyan'
          )}
          aria-label="First page"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>
      )}

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:bg-jarvis-cyan/10 text-jarvis-text-secondary hover:text-jarvis-cyan'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages[0] > 1 && (
          <span className="px-2 text-sm text-jarvis-text-muted">...</span>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[40px] px-3 py-2 rounded-lg font-body font-medium text-sm transition-colors',
              page === currentPage
                ? 'bg-jarvis-cyan text-jarvis-bg-dark'
                : 'text-jarvis-text-secondary hover:bg-jarvis-cyan/10 hover:text-jarvis-cyan'
            )}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <span className="px-2 text-sm text-jarvis-text-muted">...</span>
        )}
      </div>

      {/* Next Page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:bg-jarvis-cyan/10 text-jarvis-text-secondary hover:text-jarvis-cyan'
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Last Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:bg-jarvis-cyan/10 text-jarvis-text-secondary hover:text-jarvis-cyan'
          )}
          aria-label="Last page"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
