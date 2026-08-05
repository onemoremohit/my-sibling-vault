import React, { useState } from 'react';
import '../../assets/global.css';
import '../../assets/css/creator-desktop.css';
import '../../assets/css/creator-mobile.css';

// Sidebar nav items extracted from HTML prototype
const sidebarItems = [
  { icon: 'dashboard',            label: 'Layouts',  id: 'layouts'  },
  { icon: 'auto_awesome',         label: 'Stickers', id: 'stickers' },
  { icon: 'music_note',           label: 'Music',    id: 'music'    },
  { icon: 'timeline',             label: 'Timeline', id: 'timeline' },
  { icon: 'confirmation_number',  label: 'Coupons',  id: 'coupons'  },
];

// Quick-start templates from HTML prototype
const templates = [
  { icon: 'child_care',  color: 'var(--color-primary)',   label: 'Nostalgic Childhood', desc: 'Warm tones and vintage filters.' },
  { icon: 'explore',     color: 'var(--color-secondary)',  label: 'Recent Adventure',    desc: 'Vibrant colors for new memories.' },
  { icon: 'mood_bad',    color: 'var(--color-tertiary)',   label: 'Funny/Prank Mode',    desc: 'Wacky layouts and hidden jokes.' },
];

// Default module toggles
const defaultModules = [
  { id: 'timeline',    label: 'Timeline',         checked: true  },
  { id: 'wheel',       label: 'Punishment Wheel', checked: true  },
  { id: 'coupons',     label: 'Coupons',          checked: false },
];

const CreatorStudio = ({ onViewSibling }) => {
  const [activeNav,  setActiveNav]  = useState('layouts');
  const [modules,    setModules]    = useState(defaultModules);
  const [memoryTitle, setMemoryTitle] = useState('');

  const toggleModule = (id) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, checked: !m.checked } : m));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* ── Top Navigation ── */}
      <nav className="creator-topnav">
        <div className="creator-topnav__inner">
          <div className="creator-topnav__brand">Kinship &amp; Keepsake</div>

          <div className="creator-topnav__links">
            <a href="#" className="active">Studio</a>
            <a href="#">Gallery</a>
            <a href="#">Settings</a>
          </div>

          <div className="creator-topnav__actions">
            <span className="material-symbols-outlined creator-topnav__icon">notifications</span>
            <span className="material-symbols-outlined creator-topnav__icon">person</span>
            <button className="btn-primary" onClick={onViewSibling}>
              Share Memory
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="creator-bottomnav">
        {sidebarItems.map(item => (
          <a
            key={item.id}
            href="#"
            className={`creator-bottomnav__item${activeNav === item.id ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); setActiveNav(item.id); }}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
        <button className="creator-bottomnav__fab">
          <span className="material-symbols-outlined">add</span>
        </button>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Desktop Sidebar ── */}
        <aside className="creator-sidebar">
          <div className="creator-sidebar__heading">
            <h2>Creator Studio</h2>
            <p>Editing: Childhood 1995</p>
          </div>

          <nav className="creator-sidebar__nav">
            {sidebarItems.map(item => (
              <a
                key={item.id}
                href="#"
                className={`creator-sidebar__nav-link${activeNav === item.id ? ' active' : ''}`}
                onClick={e => { e.preventDefault(); setActiveNav(item.id); }}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="creator-sidebar__footer">
            <button className="creator-sidebar__add-btn">
              <span className="material-symbols-outlined">add</span>
              Add Memory
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="creator-main">
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

            {/* Page Header */}
            <div className="creator-main__header">
              <h1 className="creator-main__title">Preview</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="creator-main__preview-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                  Preview Mode Active
                </div>
                <button className="btn-secondary" onClick={onViewSibling}>
                  <span className="material-symbols-outlined">send</span>
                  Ready to Send?
                </button>
              </div>
            </div>

            {/* Builder Grid */}
            <div className="creator-main__grid">

              {/* ── Left Controls Column ── */}
              <div className="creator-main__controls" style={{ display: 'flex', flexDirection: 'column' }}>

                {/* Templates Panel */}
                <div className="creator-panel">
                  <h3>Choose a Quick-Start Template</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {templates.map(t => (
                      <button key={t.label} className="template-btn">
                        <span className="material-symbols-outlined" style={{ color: t.color }}>{t.icon}</span>
                        <div>
                          <p className="template-btn__title">{t.label}</p>
                          <p className="template-btn__desc">{t.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module Toggle Panel */}
                <div className="creator-panel">
                  <h3>Step 1: Choose your modules</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {modules.map(mod => (
                      <label key={mod.id} className="module-label">
                        <span className="module-label__text">{mod.label}</span>
                        <input
                          type="checkbox"
                          checked={mod.checked}
                          onChange={() => toggleModule(mod.id)}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Add Memory Form Panel */}
                <div className="creator-panel">
                  <h3>Step 2: Add your first memory</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="upload-zone">
                      <span className="material-symbols-outlined">add_a_photo</span>
                      <p className="upload-zone__title">Upload Photo</p>
                      <p className="upload-zone__hint">Drag &amp; drop or click to browse</p>
                    </div>
                    <div>
                      <label className="creator-input-label">Title</label>
                      <input
                        className="creator-input"
                        type="text"
                        placeholder="What happened?"
                        value={memoryTitle}
                        onChange={e => setMemoryTitle(e.target.value)}
                      />
                    </div>
                    <button className="add-vault-btn">Add to My Vault</button>
                  </div>
                </div>

                {/* Tip Banner */}
                <div className="tip-banner">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <p>Tip: Secret messages are only revealed when your sibling clicks them! Try adding a funny inside joke.</p>
                </div>

              </div>

              {/* ── Right Live Preview Canvas ── */}
              <div className="creator-main__canvas">
                <div className="preview-canvas">
                  <div className="phone-frame">
                    <div className="phone-frame__header">
                      <h4>Our Scrapbook</h4>
                    </div>
                    <div className="phone-frame__body">
                      <div className="phone-timeline">
                        <div className="phone-timeline__dot" />
                        <div className="phone-timeline__card">
                          <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqZdpWWSJbcQzvrvRNuImW-bKv1udyAhO0E2Dy58JzFg9fcPCpY1hNLsHrxfc1XGv5TW7qnYe1X7JPCfJi1ouPMm3_xMjwRMSYY_pRzz8qq4al4foVumtVKhYtdDF6G6IeLgE2RyKP3AxvdfpFZz64RVPkApZ7tQ7R1j-28UKqP83TPYUK71A1fa-xnXF62nnyEE5-sgSJ3zc33R9b0xAGCsG-qFw3ZypjnMtN6BD8Ih_fKWqBh4s3nw"
                            alt="Nostalgic sibling memory"
                          />
                          <h5>The Great Cookie Heist</h5>
                          <p className="date">July 1998</p>
                        </div>
                        <div className="phone-timeline__dot" style={{ top: '300px' }} />
                        <div className="phone-timeline__card" style={{ transform: 'rotate(1deg)', marginTop: '3rem' }}>
                          <div className="phone-timeline__secret">
                            <span className="material-symbols-outlined">lock</span>
                            <span className="text-label-bold">Secret Message Unlocked!</span>
                          </div>
                        </div>
                      </div>
                      <div className="preview-chips">
                        <span className="preview-chip preview-chip--secondary">#Siblings</span>
                        <span className="preview-chip preview-chip--tertiary">#1990s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>{/* /builder grid */}
          </div>
        </main>
      </div>

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

export default CreatorStudio;
