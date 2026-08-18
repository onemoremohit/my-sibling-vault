import React, { useState } from 'react';
import AdaptivePhotoFrame from '../common/AdaptivePhotoFrame';

const CollageGrid = ({ item }) => {
  const urls = item.mediaUrls?.length > 0
    ? item.mediaUrls
    : item.mediaUrl
    ? [item.mediaUrl]
    : [];

  if (urls.length === 0) return null;

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/${url}`;
  };

  // Video Player
  if (item.mediaType === 'video') {
    return (
      <div className="mb-4 overflow-hidden rounded-3xl bg-black/10 shadow-card border-2 border-primary/20">
        <video
          src={getFullUrl(urls[0])}
          controls
          className="w-full max-h-[480px] object-contain rounded-3xl"
        />
      </div>
    );
  }

  // Single Photo with Ambient Adaptive Frame (Never cropped)
  if (urls.length === 1) {
    return (
      <div className="mb-4">
        <AdaptivePhotoFrame
          src={urls[0]}
          alt={item.title || 'Sibling Memory'}
          maxHeight="max-h-[500px]"
        />
      </div>
    );
  }

  // Multi-photo fallback
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      {urls.map((url, i) => (
        <AdaptivePhotoFrame
          key={i}
          src={url}
          alt={`${item.title}-${i}`}
          maxHeight="max-h-[350px]"
        />
      ))}
    </div>
  );
};

export default CollageGrid;
