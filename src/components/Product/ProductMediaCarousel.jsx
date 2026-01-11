import React, { useState } from 'react';
import './ProductMediaCarousel.scss';
import { FiChevronLeft, FiChevronRight, FiPlayCircle, FiImage } from 'react-icons/fi';

const ProductMediaCarousel = ({ medias, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!medias || medias.length === 0) {
    return (
      <div className="product-media-carousel no-media">
        <img src="/src/assets/default.jpg" alt="No media available" />
        <p>No media available for this product.</p>
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? medias.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === medias.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentMedia = medias[currentIndex];

  return (
    <div className="product-media-carousel">
      <div className="media-display">
        {currentMedia.url.includes('.mp4') || currentMedia.file_path.includes('.mp4') ||
         currentMedia.url.includes('.webm') || currentMedia.file_path.includes('.webm') ? (
          <video controls src={currentMedia.url || `https://maketubackend.srv696182.hstgr.cloud//storage/${currentMedia.file_path}`}>
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={currentMedia.url || `https://maketubackend.srv696182.hstgr.cloud//storage/${currentMedia.file_path}`}
            alt={`${productName} - ${currentIndex + 1}`}
          />
        )}
      </div>
      {medias.length > 1 && (
        <>
          <button onClick={goToPrevious} className="carousel-control prev">
            <FiChevronLeft />
          </button>
          <button onClick={goToNext} className="carousel-control next">
            <FiChevronRight />
          </button>
        </>
      )}
      <div className="thumbnail-navigation">
        {medias.map((media, index) => (
          <div
            key={index}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          >
            {media.url.includes('.mp4') || media.file_path.includes('.mp4') ||
             media.url.includes('.webm') || media.file_path.includes('.webm') ? (
              <FiPlayCircle className="video-thumbnail-icon" />
            ) : (
              <img
                src={media.url || `https://maketubackend.srv696182.hstgr.cloud//storage/${media.file_path}`}
                alt={`Thumbnail ${index + 1}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMediaCarousel;