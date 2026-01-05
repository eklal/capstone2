// src/components/Pagination.tsx
import React from "react";

export default function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (p:number) => void;
}) {
  const { currentPage, totalPages } = pagination;
  const pages: number[] = [];

  // create simple window of pages (1 ... current-1, current, current+1 ... total)
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) pages.push(1);
  if (start > 2) pages.push(-1); // ellipsis marker

  for (let p = start; p <= end; p++) pages.push(p);

  if (end < totalPages - 1) pages.push(-1);
  if (end < totalPages) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={!pagination.hasPrevPage}
      >
        Previous
      </button>

      {pages.map((p, idx) =>
        p === -1 ? (
          <span key={idx} className="px-2">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded ${p === currentPage ? "bg-[var(--primary)] text-white" : "border"}`}
          >
            {p}
          </button>
        )
      )}

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={!pagination.hasNextPage}
      >
        Next
      </button>
    </div>
  );
}
