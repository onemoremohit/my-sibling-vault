import React, { useState, useEffect, useRef } from 'react';
import '../../assets/global.css';
import '../../assets/css/recipient-desktop.css';
import '../../assets/css/recipient-mobile.css';

// Spin wheel slice data (from HTML prototype)
const WHEEL_SLICES = [
  { text: 'Buy Dinner',   color: '#ffb4a3' },
  { text: 'Walk the Dog', color: '#e5deff' },
  { text: 'Apologize',    color: '#6bfe9c' },
  { text: 'Do Dishes',    color: '#ffdad2' },
  { text: 'Movie Choice', color: '#c9bfff' },
  { text: 'Free Pass',    color: '#4ae183' },
];

// Memory timeline data (from HTML prototype)
const MEMORIES = [
  {
    id: 'note-1',
    year: '2003',
    yearVariant: 'secondary',
    title: 'The Great Mario Kart Incident',
    desc: 'You threw the controller. I still have the dent in my wall.',
    secret: "Honestly, I let you win that race before you threw it. I just couldn't handle the crying anymore.",
    secretVariant: 'primary',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYZVVkkQ4Qg8V8v2hgdg8yBRuv2JkJfwhmcQ98v2HUcPBPuHQwF5pjHc1kVXH-D_y_DtAvLEbRyPK6LoJFV6V5sx7e0dSRmpPE3xRcHHgS8og1RNv7yq_W1nobjd6VDGn5i7USCxZmaPJYynOgloJHWxW-Zvi_jFpS4Z4XQubexOGElLB_W5Fs4soWXctP9tJ_89A4IjX1x8ENZmSCwek007WHtgXAh1e76JiRg4fBQwuD3XIo3cWPEQ',
    imgHeight: 'medium',
    tilt: 'right',
    span: 'wide',
  },
  {
    id: 'note-2',
    year: '2008',
    yearVariant: 'tertiary',
    title: "Mother's Day 'Cake'",
    desc: 'We used salt instead of sugar.',
    secret: "Mom definitely knew it tasted awful but ate a whole slice anyway. She's a saint.",
    secretVariant: 'secondary',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Ifc8AsJu0Q0PH0Jcv3ge3SetT6UIfliB144hR__WwaTlomuil6wfEK0EpmM6Dz5otnGjJsQz3_dTa041y3bQYGyL_YCU3dwks3ivfzdOYgmyhI-t4vcBuwv2PR_v83M4seEdPEQ9e278knnPrSXY14ruaWK3sXqpMlhs0vPgEc7OBBKs8VvWuvIKET69XZuhvra8rmP7mWMhyemX7DY9jIaPRdT2TkKzPnMcyurTd46g9VPn0FHN8w',
    imgHeight: 'tall',
    tilt: 'left',
    span: 'medium',
  },
];

// Coupon/Certificate data (from HTML prototype)
const COUPONS = [
  {
    id: 'coupon-1', variant: 'primary',
    icon: 'volunteer_activism', badge: 'Valid 1x',
    title: 'One Free Hug',
    desc: "No questions asked. Even if I'm mad at you.",
  },
  {
    id: 'coupon-2', variant: 'secondary',
    icon: 'local_cafe', badge: 'Valid 3x',
    title: 'Coffee Delivery',
    desc: 'I will bring you your complicated order.',
  },
  {
    id: 'coupon-3', variant: 'tertiary',
    icon: 'cleaning_services', badge: 'Valid 1x',
    title: 'Do My Chores',
    desc: "I'll do one chore of your choosing.",
  },
];

/* ── Spin Wheel Component ── */
const SpinWheel = () => {
  const wheelRef    = useRef(null);
  const [rotation,  setRotation]  = useState(0);
  const [result,    setResult]    = useState('');
  const [spinning,  setSpinning]  = useState(false);

  // Build conic gradient on mount
  useEffect(() => {
    if (!wheelRef.current) return;
    const sliceAngle = 360 / WHEEL_SLICES.length;
    const gradient = 'conic-gradient(' +
      WHEEL_SLICES.map((s, i) =>
        `${s.color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`
      ).join(', ') + ')';
    wheelRef.current.style.background = gradient;
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult('');
    const extra  = Math.floor(Math.random() * 5) + 3;
    const angle  = Math.floor(Math.random() * 360);
    const newRot = rotation + extra * 360 + angle;
    setRotation(newRot);
    wheelRef.current.style.transform = `rotate(${newRot}deg)`;

    setTimeout(() => {
      const normalized = newRot % 360;
      const sliceAngle = 360 / WHEEL_SLICES.length;
      const winAngle   = (360 - normalized) % 360;
      const winIndex   = Math.floor(winAngle / sliceAngle);
      setResult(`Result: ${WHEEL_SLICES[winIndex].text}!`);
      setSpinning(false);
    }, 3000);
  };

  return (
    <section className="wheel-section">
      <div className="wheel-section__blob" />
      <div className="wheel-section__header">
        <h2 className="wheel-section__title">The Punishment Wheel</h2>
        <p className="wheel-section__subtitle">Settle our next argument with a spin.</p>
      </div>
      <div className="wheel-container-wrapper">
        <div className="wheel-pointer" />
        <div id="punishment-wheel" className="wheel-container" ref={wheelRef}>
          {WHEEL_SLICES.map((slice, i) => {
            const sliceAngle = 360 / WHEEL_SLICES.length;
            return (
              <div
                key={slice.text}
                className="wheel-slice-text"
                style={{ transform: `rotate(${i * sliceAngle + sliceAngle / 2}deg)` }}
              >
                <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>
                  {slice.text}
                </span>
              </div>
            );
          })}
        </div>
        <button className="wheel-spin-btn" onClick={spin} disabled={spinning}>
          <span className="material-symbols-outlined">casino</span>
          Spin the Wheel
        </button>
        <div className={`wheel-result${result ? ' visible' : ''}`}>{result}</div>
      </div>
    </section>
  );
};

/* ── Main RecipientView Component ── */
const RecipientView = ({ onBackToStudio }) => {
  const [openNotes,  setOpenNotes]  = useState({});
  const [claimed,    setClaimed]    = useState({});

  const toggleNote = (id) =>
    setOpenNotes(prev => ({ ...prev, [id]: !prev[id] }));

  const claimCoupon = (id) =>
    setClaimed(prev => ({ ...prev, [id]: true }));

  return (
    <div className="paper-texture" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* ── Back to Studio button ── */}
      <div className="recipient-back-btn">
        <a href="#" onClick={e => { e.preventDefault(); onBackToStudio(); }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Back to Studio
        </a>
      </div>

      {/* ── Main Content ── */}
      <main className="recipient-main">

        {/* ── Hero Section ── */}
        <section className="recipient-hero">
          <div className="recipient-hero__glow" />
          <div className="recipient-hero__polaroid">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwLKmKU9kRYVHlzpJxyAgOLNH4KniY3eBX95xuC1BbRNKETvz7cTbQQoir_VwsLfjilOwSdtClV-9r6zM3HckXf5rK9Nz_KIa2Kf9U9ONG6K_bk4a-WspkQ-M2Fk3hOKAEa407HXXA-3FayMdoqCUeVtno-P0gyOPBsKFe7ZvnDMBdjvndmpkpmXDBk0MMyiB8QXdfdh9EDn0psy_dyEw_CUNBIyG92c6w4Hme_5W3KOOSMcI7t4lndg"
              alt="Siblings playing in a sunlit backyard"
            />
            <div className="recipient-hero__polaroid-caption">Summer '98</div>
          </div>
          <h1 className="recipient-hero__title">A Gift for You, Sarah</h1>
          <p className="recipient-hero__subtitle">
            I put together this little collection of our best (and worst) moments.
            Scroll down to take a trip down memory lane.
          </p>
        </section>

        {/* ── Timeline & Memory Cards ── */}
        <section className="recipient-timeline-section">
          <div className="recipient-timeline__axis" />
          <div className="recipient-timeline__grid">
            {MEMORIES.map(memory => (
              <div key={memory.id} className={`memory-card-wrapper memory-card-wrapper--${memory.span}`}>
                <div className="memory-card-wrapper__dot" />
                <div
                  className={`memory-card memory-card--tilt-${memory.tilt}`}
                  onClick={() => toggleNote(memory.id)}
                >
                  <img
                    src={memory.imgUrl}
                    alt={memory.title}
                    className={memory.imgHeight}
                  />
                  <div style={{ padding: '0 0.5rem' }}>
                    <span className={`memory-card__year-badge memory-card__year-badge--${memory.yearVariant}`}>
                      {memory.year}
                    </span>
                    <h3 className="memory-card__title">{memory.title}</h3>
                    <p className="memory-card__desc">{memory.desc}</p>

                    {/* Secret Note Reveal */}
                    <div className={`secret-note${openNotes[memory.id] ? ' open' : ''}`}>
                      <div className={`secret-note__inner--${memory.secretVariant}`}>
                        <h4 className={`secret-note__heading secret-note__heading--${memory.secretVariant}`}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock_open</span>
                          Secret Note
                        </h4>
                        <p className="secret-note__text">"{memory.secret}"</p>
                      </div>
                    </div>

                    <div className="memory-card__reveal-hint">Click to reveal secret</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Spin the Wheel ── */}
        <SpinWheel />

        {/* ── Coupon / Certificate Gallery ── */}
        <section className="coupons-section">
          <div className="coupons-section__header">
            <h2 className="coupons-section__title">Favor Certificates</h2>
            <p className="coupons-section__subtitle">Click to claim. Use wisely.</p>
          </div>
          <div className="coupons-grid">
            {COUPONS.map(coupon => (
              <div
                key={coupon.id}
                className={`coupon-card coupon-card--${coupon.variant}${claimed[coupon.id] ? ' claimed' : ''}`}
                onClick={() => claimCoupon(coupon.id)}
              >
                <div className="coupon-card__hover-overlay" />
                <div className="coupon-card__top-row">
                  <span
                    className={`material-symbols-outlined coupon-card__icon`}
                    style={{ color: `var(--color-${coupon.variant})` }}
                  >
                    {coupon.icon}
                  </span>
                  <span className={`coupon-card__badge coupon-card__badge--${coupon.variant}`}>
                    {coupon.badge}
                  </span>
                </div>
                <h3 className="coupon-card__title">{coupon.title}</h3>
                <p className="coupon-card__desc">{coupon.desc}</p>
                <div className={`coupon-card__claim-row coupon-card__claim-row--${coupon.variant}`}>
                  {claimed[coupon.id]
                    ? <><span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '4px' }}>check_circle</span>Claimed</>
                    : 'Tap to Claim'
                  }
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <div className="app-footer__brand">Kinship &amp; Keepsake</div>
        <div className="app-footer__copy">© 2024 Kinship &amp; Keepsake. Made with nostalgia.</div>
        <div className="app-footer__links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>

    </div>
  );
};

export default RecipientView;
