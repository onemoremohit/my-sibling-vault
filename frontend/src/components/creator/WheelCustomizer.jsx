import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { showError } from '../common/Toast';

const WHEEL_COLORS = ['#ffdad2','#e5deff','#6bfe9c','#ffb4a3','#c9bfff','#4ae183','#ff8264','#7459f7','#13bf66'];

const MiniWheel = ({ punishments }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx = size / 2, cy = size / 2, r = size / 2 - 4;

    ctx.clearRect(0, 0, size, size);

    if (punishments.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#e7e1de';
      ctx.fill();
      ctx.fillStyle = '#57423d';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('Add punishments', cx, cy);
      return;
    }

    const sliceAngle = (Math.PI * 2) / punishments.length;
    punishments.forEach((p, i) => {
      const start = i * sliceAngle - Math.PI / 2;
      const end = start + sliceAngle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1d1b19';
      ctx.font = 'bold 9px Plus Jakarta Sans';
      ctx.fillText(p.length > 12 ? p.slice(0, 12) + '…' : p, r - 8, 3);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#a33d25';
    ctx.fill();
  }, [punishments]);

  return <canvas ref={canvasRef} width={180} height={180} className="rounded-full shadow-soft-memory" />;
};

const WheelCustomizer = () => {
  const { packet, addPunishment, removePunishment, t } = usePacket();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) { showError('Enter a punishment!'); return; }
    addPunishment(input.trim());
    setInput('');
  };

  const PRESETS = [
    t('p1'),
    t('p2'),
    t('p3'),
    t('p4'),
    t('p5'),
    t('p6'),
  ];

  const handleTogglePreset = (p) => {
    const idx = packet.punishments?.indexOf(p);
    if (idx !== undefined && idx !== -1) {
      removePunishment(idx);
    } else {
      addPunishment(p);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-1">{t('wheelTitle')}</h3>
        <p className="font-body text-caption text-on-surface-variant mb-4">{t('wheelDesc')}</p>

        <div className="flex flex-col items-center gap-3 mb-5">
          <MiniWheel punishments={packet.punishments} />
          <p className="font-body text-caption text-on-surface-variant">
            {packet.punishments.length} {t('wheelLoadedText')}
          </p>
        </div>

        {/* Quick presets */}
        <div className="mb-4">
          <p className="font-body text-caption text-on-surface-variant font-bold uppercase tracking-wider mb-2">{t('quickPresetsTitle')}</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => {
              const isSelected = packet.punishments?.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => handleTogglePreset(p)}
                  className={`relative font-body text-caption px-3.5 py-1.5 rounded-full transition-all border ${
                    isSelected
                      ? 'bg-primary-fixed border-primary text-primary font-bold shadow-sm'
                      : 'bg-surface-container-high border-outline-variant/30 text-on-surface hover:bg-primary-fixed/40'
                  }`}
                >
                  + {p}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-primary text-on-primary w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border border-surface">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom input */}
        <div className="flex gap-2">
          <input
            className="flex-1 border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
            placeholder={t('addPunishmentPlaceholder')}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="bg-primary text-on-primary px-4 py-2.5 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {t('addBtn')}
          </button>
        </div>
      </div>

      {/* Punishments list */}
      {packet.punishments.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {packet.punishments.map((p, i) => (
              <motion.div
                key={`${p}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3 border border-outline-variant/20"
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: WHEEL_COLORS[i % WHEEL_COLORS.length] }} />
                <span className="flex-1 font-body text-body-md text-on-surface">{p}</span>
                <button onClick={() => removePunishment(i)} className="p-1 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WheelCustomizer;
