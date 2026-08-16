import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage    from './pages/LandingPage';
import CreatorStudio  from './pages/CreatorStudio';
import RecipientView  from './pages/RecipientView';

const App = () => (
  <Routes>
    <Route path="/"                element={<LandingPage />} />
    <Route path="/studio"          element={<CreatorStudio />} />
    <Route path="/vault/:packetId" element={<RecipientView />} />
    <Route path="/v/:packetId"     element={<RecipientView />} />
    <Route path="*"                element={
      <div className="min-h-screen flex items-center justify-center bg-surface font-body text-on-surface">
        <div className="text-center">
          <h1 className="text-display-mobile font-display text-primary mb-4">404</h1>
          <p className="text-body-lg text-on-surface-variant mb-6">This vault doesn't exist.</p>
          <a href="/" className="inline-block bg-primary text-on-primary px-6 py-3 rounded-full font-body text-label-bold transition-transform hover:scale-105">
            Go Home
          </a>
        </div>
      </div>
    } />
  </Routes>
);

export default App;
