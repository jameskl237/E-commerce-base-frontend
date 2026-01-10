import React from 'react';
import './Pagination.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Toujours afficher la première page

      let start = Math.max(2, currentPage - halfMaxPages + 1);
      let end = Math.min(totalPages - 1, currentPage + halfMaxPages - 1);

      if (currentPage - 1 <= halfMaxPages) {
        end = maxPagesToShow - 1;
      }
      if (totalPages - currentPage <= halfMaxPages) {
        start = totalPages - maxPagesToShow + 2;
      }

      if (start > 2) {
        pageNumbers.push('...');
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages); // Toujours afficher la dernière page
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        Précédent
      </button>
      {pageNumbers.map((number, index) =>
        number === '...' ? (
          <span key={`ellipsis-${index}`} className="ellipsis">
            ...
          </span>
        ) : (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        )
      )}
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
