import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CollageGrid = ({ item }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const urls = item.mediaUrls?.length > 0
    ? item.mediaUrls
    : item.mediaUrl
    ? [item.mediaUrl]
    : [];

  if (urls.length === 0) return null;

  const getFullUrl = (url) => (url.startsWith('/uploads') ? `http://localhost:5000${url}` : url);

  // 1. Single Video Player
  if (item.mediaType === 'video') {
    return (
      <div className="mb-4 overflow-hidden rounded-2xl bg-black/10 shadow-sm border border-outline-variant/30">
        <video
          src={getFullUrl(urls[0])}
          controls
          className="w-full max-h-96 object-cover rounded-2xl"
        />
      </div>
    );
  }

  // 2. Photos Collage Logic
  const count = urls.length;

  return (
    <>
      <div className="mb-4 overflow-hidden rounded-2xl shadow-sm border border-outline-variant/30">
        {/* Case 1: Single Image */}
        {count === 1 && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(0);
            }}
            className="group cursor-pointer overflow-hidden max-h-96 bg-surface-container flex items-center justify-center relative"
          >
            <img
              src={getFullUrl(urls[0])}
              alt={item.title}
              className="w-full max-h-96 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-2 rounded-full">
                zoom_in
              </span>
            </div>
          </div>
        )}

        {/* Case 2: 2 Images Side-by-Side */}
        {count === 2 && (
          <div className="grid grid-cols-2 gap-1.5 h-64 sm:h-72">
            {urls.map((url, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(i);
                }}
                className="group cursor-pointer relative overflow-hidden h-full bg-surface-container"
              >
                <img
                  src={getFullUrl(url)}
                  alt={`${item.title}-${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Case 3: 3 Images Asymmetric Layout */}
        {count === 3 && (
          <div className="grid grid-cols-12 gap-1.5 h-64 sm:h-80">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(0);
              }}
              className="col-span-7 group cursor-pointer relative overflow-hidden h-full bg-surface-container"
            >
              <img
                src={getFullUrl(urls[0])}
                alt={`${item.title}-0`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="col-span-5 grid grid-rows-2 gap-1.5 h-full">
              {urls.slice(1, 3).map((url, i) => (
                <div
                  key={i + 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(i + 1);
                  }}
                  className="group cursor-pointer relative overflow-hidden h-full bg-surface-container"
                >
                  <img
                    src={getFullUrl(url)}
                    alt={`${item.title}-${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case 4: 4 Images 2x2 Grid */}
        {count === 4 && (
          <div className="grid grid-cols-2 gap-1.5 h-64 sm:h-80">
            {urls.map((url, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(i);
                }}
                className="group cursor-pointer relative overflow-hidden h-full bg-surface-container"
              >
                <img
                  src={getFullUrl(url)}
                  alt={`${item.title}-${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Case 5+: 4-Photo Grid with "+N More" Overlay */}
        {count >= 5 && (
          <div className="grid grid-cols-2 gap-1.5 h-64 sm:h-80">
            {urls.slice(0, 3).map((url, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(i);
                }}
                className="group cursor-pointer relative overflow-hidden h-full bg-surface-container"
              >
                <img
                  src={getFullUrl(url)}
                  alt={`${item.title}-${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
            {/* 4th item with overlay */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(3);
              }}
              className="group cursor-pointer relative overflow-hidden h-full bg-surface-container"
            >
              <img
                src={getFullUrl(urls[3])}
                alt={`${item.title}-3`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-display font-bold text-headline-md group-hover:bg-black/50 transition-colors">
                +{count - 3} photos
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Interactive Photo Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors"
            >
              ✕
            </button>

            {/* Photo Index Counter */}
            <div className="absolute top-4 left-4 bg-white/20 text-white px-4 py-1 rounded-full font-body text-caption font-bold">
              {lightboxIndex + 1} / {count}
            </div>

            {/* Photo Display */}
            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={getFullUrl(urls[lightboxIndex])}
              alt="fullscreen"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Previous Photo Button */}
            {count > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors"
              >
                ‹
              </button>
            )}

            {/* Next Photo Button */}
            {count > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === count - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors"
              >
                ›
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CollageGrid;
