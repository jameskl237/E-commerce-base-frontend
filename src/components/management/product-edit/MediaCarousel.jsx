import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './MediaCarousel.scss';

const MediaCarousel = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const mediaItems = Array.isArray(media) ? media : [];

  const goToPrevious = () => {
    const isFirstItem = currentIndex === 0;
    const newIndex = isFirstItem ? mediaItems.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastItem = currentIndex === mediaItems.length - 1;
    const newIndex = isLastItem ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (mediaItems.length === 0) {
    return <div className="media-carousel-container"><p>Aucun média disponible.</p></div>;
  }

  const currentItem = mediaItems[currentIndex];

  return (
    <div className="media-carousel-container">
      <h2>Médias</h2>
      <div className="carousel-main">
        {mediaItems.length > 1 && (
          <button onClick={goToPrevious} className="carousel-arrow left-arrow">
            <FiChevronLeft />
          </button>
        )}
        
        <div className="carousel-item">
          {currentItem.type === 'image' ? (
            <img src={currentItem.url} alt={`Product media ${currentIndex + 1}`} />
          ) : (
            <video controls src={currentItem.url} key={currentItem.url} />
          )}
        </div>

        {mediaItems.length > 1 && (
          <button onClick={goToNext} className="carousel-arrow right-arrow">
            <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaCarousel;