import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SecretNoteReveal from './SecretNoteReveal';
import CollageGrid from './CollageGrid';
import Modal from '../common/Modal';
import { t } from '../../i18n/translations';

const MemoryTimeline = ({ items = [], lang = 'en' }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (items.length === 0) return null;

  const handleCardClick = (e, item) => {
    // If clicking on secret note button or photo zoom button, do not open detail modal
    if (e.target.closest('button') || e.target.closest('.group')) return;
    setSelectedItem(item);
  };

  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-display text-headline-md text-primary font-bold">
          {t('timelineSectionHeader', lang)}
        </h2>
        <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto">
          {t('timelineSectionSub', lang)}
        </p>
      </div>

      <div className="relative pl-6 sm:pl-10 border-l-3 border-dashed border-primary-fixed-dim space-y-10 ml-2 sm:ml-6">
        {items.map((item, index) => {
          const urls = item.mediaUrls?.length > 0
            ? item.mediaUrls
            : item.mediaUrl
            ? [item.mediaUrl]
            : [];

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              {/* Timeline Scrapbook Dot / Pin */}
              <div className="absolute -left-[32px] sm:-left-[49px] top-2 w-6 h-6 rounded-full bg-primary border-4 border-surface shadow-md group-hover:scale-125 transition-transform flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-on-primary" />
              </div>

              {/* Memory Card */}
              <div
                onClick={(e) => handleCardClick(e, item)}
                className="bg-surface-container-lowest rounded-3xl p-6 pt-7 shadow-soft-memory border-2 border-outline-variant/30 hover:shadow-card hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-visible"
              >
                {/* Vintage Tape Graphic at top corner */}
                <div className="absolute -top-3.5 left-8 bg-amber-200 text-amber-950 font-mono text-[11px] font-bold px-4 py-0.5 shadow-md transform -rotate-2 border border-amber-400/60 select-none rounded-sm z-10">
                  MEMORY #{index + 1}
                </div>

                {/* Date Tag Badge */}
                <div className="flex items-center justify-between gap-3 mb-3 pt-1">
                  <div className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed font-body font-bold text-caption px-3.5 py-1 rounded-full shadow-sm">
                    <span>🗓️</span>
                    <span>{item.date || t('noDateText', lang)}</span>
                  </div>

                  {urls.length > 1 && (
                    <span className="font-body text-[11px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full shadow-sm">
                      🖼️ {urls.length} Photos Collage
                    </span>
                  )}
                </div>

                {/* Memory Title */}
                <h3 className="font-display text-headline-md text-primary font-bold mb-3 tracking-tight">
                  {item.title}
                </h3>

                {/* Smart Collage Grid for 1, 2, 3, 4, 5+ Photos or Video */}
                <CollageGrid item={item} />

                {/* Story Description */}
                {item.story && (
                  <p className="font-body text-body-md text-on-surface leading-relaxed line-clamp-4 mb-3">
                    {item.story}
                  </p>
                )}

                {/* Wax-Sealed Secret Note Feature */}
                <SecretNoteReveal secretNote={item.secretNote} lang={lang} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal detail for full story view */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title}
      >
        <div className="space-y-4">
          {selectedItem && <CollageGrid item={selectedItem} />}

          {selectedItem?.date && (
            <div className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed font-body font-bold text-caption px-3 py-1 rounded-full">
              <span>🗓️</span>
              <span>{selectedItem.date}</span>
            </div>
          )}

          {selectedItem?.story && (
            <p className="font-body text-body-md text-on-surface leading-relaxed whitespace-pre-line">
              {selectedItem.story}
            </p>
          )}

          <SecretNoteReveal secretNote={selectedItem?.secretNote} lang={lang} />
        </div>
      </Modal>
    </section>
  );
};

export default MemoryTimeline;
