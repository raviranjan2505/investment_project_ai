'use client';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-600">
        Page {currentPage} of {totalPages} • {totalItems} total listings
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
