import React from 'react';

const Loader = ({ message = 'Loading your vault…' }) => (
  <div className="min-h-screen bg-surface paper-texture flex flex-col items-center justify-center gap-6">
    {/* Animated rings */}
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-4 border-primary-fixed animate-ping opacity-30" />
      <div className="absolute inset-2 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <div className="absolute inset-5 rounded-full bg-primary-fixed-dim animate-pulse" />
    </div>
    <p className="font-body text-body-md text-on-surface-variant animate-pulse">{message}</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-card">
    <div className="skeleton w-full h-48 rounded-2xl mb-4" />
    <div className="skeleton h-5 w-3/4 rounded mb-2" />
    <div className="skeleton h-4 w-1/2 rounded" />
  </div>
);

export default Loader;
