import React from "react";

interface PageNavigationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ page, totalPages, setPage }) => {
  return (
    <div className="pagenav-container">
      <button
        className={`pagenav-btn pagenav-prev${page === 1 ? " pagenav-disabled" : ""}`}
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`pagenav-btn pagenav-page${page === i + 1 ? " pagenav-active" : ""}`}
          onClick={() => setPage(i + 1)}
          disabled={page === i + 1}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={`pagenav-btn pagenav-next${page === totalPages ? " pagenav-disabled" : ""}`}
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PageNavigation;
