import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AdaptivePhotoFrame
 * Renders any photo in full view without cropping, regardless of aspect ratio.
 * Replaces harsh black voids with a warm, festive Polaroid/scrapbook mat and ambient glow.
 */
const AdaptivePhotoFrame = ({
  src,
  alt = 'Sibling Memory',
  className = '',
  maxHeight = 'max-h-[480px]',
  showZoom = true,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!src) return null;

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/${url}`;
  };

  const fullUrl = getFullUrl(src);

  return (
    <>
      <div
        onClick={() => showZoom && setIsLightboxOpen(true)}
        className={`relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-card border-2 border-primary/20 bg-gradient-to-b from-amber-500/10 via-surface-bright to-primary-fixed/20 p-3 sm:p-5 group cursor-pointer select-none transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover flex flex-col items-center justify-center ${className}`}
      >
        {/* 1. Warm, Soft Ambient Blur matching the photo's vibrant colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={fullUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl scale-125 opacity-35 saturate-150 transition-transform duration-700 group-hover:scale-135"
          />
          <div className="absolute inset-0 bg-white/40 dark:bg-black/10 backdrop-blur-sm" />
        </div>

        {/* 2. Top Vintage Scrapbook Badge */}
        <div className="w-full flex items-center justify-between z-10 mb-2.5 px-1">
          <span className="inline-flex items-center gap-1.5 bg-surface/90 backdrop-blur-md text-primary font-body font-bold text-[11px] px-3 py-1 rounded-full shadow-sm border border-primary/20">
            <span>✨</span>
            <span>SIBLING MEMORY 📸</span>
          </span>

          <span className="inline-flex items-center gap-1 bg-surface/90 backdrop-blur-md text-on-surface-variant font-body font-semibold text-[11px] px-2.5 py-1 rounded-full shadow-sm border border-outline-variant/30 group-hover:text-primary transition-colors">
            <span>🔍</span>
            <span className="hidden sm:inline">Tap to Zoom</span>
          </span>
        </div>

        {/* 3. Main Foreground Photo (White Polaroid Border, Soft Drop Shadow, Zero Crop) */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <div className="relative inline-block bg-white dark:bg-surface-container rounded-2xl p-1.5 sm:p-2 shadow-xl border border-black/5 group-hover:shadow-2xl transition-shadow">
            <img
              src={fullUrl}
              alt={alt}
              className={`relative z-10 ${maxHeight} max-w-full w-auto h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]`}
              loading="lazy"
            />
          </div>
        </div>

        {/* 4. Subtle Hover Hint */}
        {showZoom && (
          <div className="absolute inset-0 z-20 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center pointer-events-none rounded-3xl">
            <span className="material-symbols-outlined text-white bg-primary/80 backdrop-blur-md p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
              zoom_in
            </span>
          </div>
        )}
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 z-50 bg-white/20 hover:bg-white/30 text-white w-11 h-11 rounded-full flex items-center justify-center transition-colors text-2xl font-bold border border-white/30 shadow-lg"
            >
              ✕
            </button>

            {/* Fullscreen Photo */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={fullUrl}
              alt={alt}
              className="max-h-[88vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl border-4 border-white/90"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdaptivePhotoFrame;
