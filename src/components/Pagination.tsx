"use client";

import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  active: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  active = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange = () => {},
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (active <= 3) {
        // Near the beginning
        pages.push(2, 3, 4, "...", totalPages);
      } else if (active >= totalPages - 2) {
        // Near the end
        pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push("...", active - 1, active, active + 1, "...", totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 px-6 py-4">
      <button
        className="px-3 py-1.5 flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={() => onPageChange(active - 1)}
        disabled={active === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-gray-400"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded transition-colors ${
                active === page
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => onPageChange(page as number)}
              disabled={active === page}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="px-3 py-1.5 flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={() => onPageChange(active + 1)}
        disabled={active === totalPages}
      >
        <span className="text-sm font-medium">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}