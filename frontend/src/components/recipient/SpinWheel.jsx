import React, { useState, useRef, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { t } from '../../i18n/translations';

const WHEEL_COLORS = [
  '#ffb4a3', '#e5deff', '#6bfe9c', '#ffdad2',
  '#c9bfff', '#4ae183', '#ff8264', '#7459f7', '#13bf66',
];

const SpinWheel = ({ punishments = [], onPunishmentAccepted, lang = 'en' }) => {
  if (!punishments || punishments.length === 0) {
    return null;
  }

  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  const items = punishments;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx = size / 2, cy = size / 2, r = size / 2 - 8;

    ctx.clearRect(0, 0, size, size);

    const sliceAngle = (Math.PI * 2) / items.length;

    items.forEach((item, i) => {
      // Start slices at -Math.PI / 2 (12 o'clock top pointer position)
      const start = i * sliceAngle - Math.PI / 2;
      const end = start + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();

      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1d1b19';
      ctx.font = 'bold 13px Plus Jakarta Sans';
      const label = item.length > 15 ? item.slice(0, 15) + '…' : item;
      ctx.fillText(label, r - 18, 5);
      ctx.restore();
    });

    // Center Gold Pin
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#a33d25';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [items]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    // Pick a random target slice index first to ensure 100% deterministic accuracy
    const targetIndex = Math.floor(Math.random() * items.length);
    const sliceDeg = 360 / items.length;

    // Calculate rotation angle so targetIndex stops directly under top pointer (12 o'clock)
    // Target slice midpoint in unrotated coords: targetIndex * sliceDeg + sliceDeg / 2
    const targetMidpoint = targetIndex * sliceDeg + sliceDeg / 2;
    
    // To align targetMidpoint with Top Pointer (0 deg clockwise from top),
    // wheel needs to rotate: (360 - targetMidpoint)
    const extraFullRounds = (Math.floor(Math.random() * 4) + 5) * 360; // 5 to 8 full spins
    
    // Compute current angle modulo 360 to smoothly add to rotationAngle
    const currentMod = rotationAngle % 360;
    const desiredMod = (360 - targetMidpoint) % 360;
    let delta = desiredMod - currentMod;
    if (delta <= 0) delta += 360;

    const newRotation = rotationAngle + extraFullRounds + delta;
    setRotationAngle(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const selected = items[targetIndex];
      setWinner(selected);
      onPunishmentAccepted?.(selected);
    }, 3200);
  };

  return (
    <section className="bg-surface-container-low border border-outline-variant/30 rounded-4xl p-6 sm:p-10 flex flex-col items-center text-center space-y-6 shadow-soft-memory relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1 relative z-10">
        <h2 className="font-display text-headline-md text-primary">{t('wheelSectionHeader', lang)}</h2>
        <p className="font-body text-body-md text-on-surface-variant">
          {t('wheelSectionSub', lang)}
        </p>
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Top Pointer Arrow */}
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-primary z-20 drop-shadow-md -mb-3 animate-pulse" />

        {/* Wheel Canvas Container */}
        <div
          className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border-8 border-primary shadow-2xl overflow-hidden transition-transform duration-[3200ms] cubic-bezier(0.15, 0.85, 0.15, 1)"
          style={{ transform: `rotate(${rotationAngle}deg)` }}
        >
          <canvas ref={canvasRef} width={320} height={320} className="w-full h-full" />
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={spin}
        loading={isSpinning}
        disabled={isSpinning}
        icon="casino"
      >
        {isSpinning ? t('spinningBtnText', lang) : t('spinBtnText', lang)}
      </Button>

      {/* Winning Popup Modal */}
      <Modal
        isOpen={!!winner}
        onClose={() => setWinner(null)}
        title={t('wheelWinnerTitle', lang)}
      >
        <div className="text-center space-y-4 py-2 flex flex-col items-center">
          <div className="text-5xl animate-bounce">🏆</div>
          <p className="font-body text-body-lg text-on-surface-variant font-medium">{t('wheelWinnerSub', lang)}</p>
          <h3 className="font-display text-display-mobile sm:text-headline-md text-secondary font-bold bg-secondary-fixed/40 px-6 py-4 rounded-2xl border border-secondary-fixed shadow-sm max-w-full break-words">
            "{winner}"
          </h3>
          <p className="font-body text-caption text-on-surface-variant italic">{t('noTakebacksText', lang)}</p>
          <div className="pt-2">
            <Button variant="primary" size="lg" onClick={() => setWinner(null)}>
              {t('acceptFateBtn', lang)}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default SpinWheel;
