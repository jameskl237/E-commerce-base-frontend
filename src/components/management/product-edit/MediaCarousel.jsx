import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './MediaCarousel.scss';

// L'URL de base de votre backend. Il est recommandé de la stocker dans un fichier de configuration ou des variables d'environnement.
const API_BASE_URL = 'http://localhost:8000';

const MediaCarousel = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);

  const inferMediaType = (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return 'image';
    }
    if (/\.(mp4|webm|ogg)$/i.test(url)) {
      return 'video';
    }
    return 'image'; // Default to image
  };

  useEffect(() => {
    // Utiliser product.media comme source pour les médias, conformément au modèle de l'API.
    const mediaList = product?.medias || [];

    if (Array.isArray(mediaList)) {
      const processedMedia = mediaList.map(item => {
        // 'item' est maintenant un objet media: { url, type, is_principal, product_id }
        const relativeUrl = item.url;
        
        if (!relativeUrl) return null;

        // Construire l'URL complète si elle est relative
        const isAbsolute = relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://');
        const finalUrl = isAbsolute ? relativeUrl : `${API_BASE_URL}/storage/${relativeUrl.replace(/^\//, '')}`;

        return {

          url: finalUrl,
          // Utiliser le type de l'API, ou le deviner si non fourni.
          type: item.type || inferMediaType(relativeUrl),
        };
      }).filter(Boolean);
      setMediaItems(processedMedia);
    }
  }, [product]);

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