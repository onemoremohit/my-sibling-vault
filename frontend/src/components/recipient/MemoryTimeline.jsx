import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SecretNoteReveal from './SecretNoteReveal';
import Modal from '../common/Modal';

const MemoryTimeline = ({ items = [] }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (items.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="font-display text-headline-md text-primary">Memory Timeline 📸</h2>
        <p className="font-body text-body-md text-on-surface-variant">Our precious (and embarrassing) moments over the years.</p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-primary-fixed-dim space-y-8 ml-2 sm:ml-4">
        {items.map((item, index) => {
          const mediaSrc = item.mediaUrl?.startsWith('/uploads')
            ? `http://localhost:5000${item.mediaUrl}`
            : item.mediaUrl;

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-primary border-4 border-surface shadow-sm group-hover:scale-125 transition-transform" />

              {/* Memory Card */}
              <div
                onClick={() => setSelectedItem(item)}
                className="bg-surface-container-lowest rounded-3xl p-5 shadow-soft-memory border border-outline-variant/30 hover:shadow-card hover:-translate-y-1 transition-all cursor-pointer"
              >
                {mediaSrc && (
                  <div className="mb-4 overflow-hidden rounded-2xl bg-surface-container max-h-80 flex items-center justify-center">
                    {item.mediaType === 'video' ? (
                      <video src={mediaSrc} controls className="w-full max-h-80 object-cover" />
                    ) : (
                      <img src={mediaSrc} alt={item.title} className="w-full max-h-80 object-cover hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-display text-headline-md text-on-surface">{item.title}</h3>
                  {item.date && (
                    <span className="font-body text-caption font-bold bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full whitespace-nowrap">
                      {item.date}
                    </span>
                  )}
                </div>

                {item.story && (
                  <p className="font-body text-body-md text-on-surface-variant line-clamp-3 mb-2">
                    {item.story}
                  </p>
                )}

                <SecretNoteReveal secretNote={item.secretNote} />
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
          {selectedItem?.mediaUrl && (
            <div className="rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center">
              {selectedItem.mediaType === 'video' ? (
                <video
                  src={selectedItem.mediaUrl?.startsWith('/uploads') ? `http://localhost:5000${selectedItem.mediaUrl}` : selectedItem.mediaUrl}
                  controls
                  className="w-full max-h-[400px]"
                />
              ) : (
                <img
                  src={selectedItem.mediaUrl?.startsWith('/uploads') ? `http://localhost:5000${selectedItem.mediaUrl}` : selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  className="w-full max-h-[400px] object-contain"
                />
              )}
            </div>
          )}

          {selectedItem?.date && (
            <p className="font-body text-caption font-bold text-primary">
              Date: {selectedItem.date}
            </p>
          )}

          {selectedItem?.story && (
            <p className="font-body text-body-md text-on-surface leading-relaxed whitespace-pre-line">
              {selectedItem.story}
            </p>
          )}

          <SecretNoteReveal secretNote={selectedItem?.secretNote} />
        </div>
      </Modal>
    </section>
  );
};

export default MemoryTimeline;
