import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import './MediaCarousel.scss';
import { API_BASE_URL } from '../../../config/constants';

const MediaCarousel = ({ product, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);

  const inferMediaType = (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return 'image';
    if (/\.(mp4|webm|ogg)$/i.test(url)) return 'video';
    return 'image';
  };

  useEffect(() => {
    // Utiliser product.medias (ou .media) comme source pour les médias.
    const mediaList = product?.medias || product?.media || [];

    if (Array.isArray(mediaList)) {
      const processedMedia = mediaList.map(item => {
        const relativeUrl = item.url;
        if (!relativeUrl) return null;

        // Construire l'URL complète si elle est relative
        const isAbsolute = relativeUrl.startsWith('http://') || relativeUrl.startsWith('https');
        const finalUrl = isAbsolute ? relativeUrl : `${API_BASE_URL}/storage/${relativeUrl.replace(/^\//, '')}`;

        return {
          id: item.id, // Important: on conserve l'ID pour la suppression
          url: finalUrl,
          type: item.type || inferMediaType(relativeUrl),
        };
      }).filter(Boolean);
      setMediaItems(processedMedia);

      // Réajuster l'index si l'élément actuel a été supprimé
      if (currentIndex >= processedMedia.length) {
        setCurrentIndex(Math.max(0, processedMedia.length - 1));
      }
    }
  }, [product, currentIndex]);

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
    return (
      <div className="media-carousel-container">
        <h2>Médias</h2>
        <p>Aucun média disponible.</p>
      </div>
    );
  }

  const currentItem = mediaItems[currentIndex];

  return (
    <div className="media-carousel-container">
      <h2>Médias</h2>
      <div className="carousel-main">
        {mediaItems.length > 1 && (
          <button type="button" onClick={goToPrevious} className="carousel-arrow left-arrow">
            <FiChevronLeft />
          </button>
        )}
        
        <div className="carousel-item">
          {onDelete && (
            <button
              type="button"
              className="delete-media-btn"
              title="Supprimer ce média"
              onClick={() => onDelete(currentItem.id)}
            >
              <FiTrash2 />
            </button>
          )}

          {currentItem.type === 'image' ? (
            <img src={currentItem.url} alt={`Product media ${currentIndex + 1}`} />
          ) : (
            <video controls src={currentItem.url} key={currentItem.url} />
          )}
        </div>

        {mediaItems.length > 1 && (
          <button type="button" onClick={goToNext} className="carousel-arrow right-arrow">
            <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaCarousel;
