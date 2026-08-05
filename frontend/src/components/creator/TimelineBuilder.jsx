import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { uploadMedia } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const emptyForm = { title: '', date: '', story: '', secretNote: '', mediaUrl: '', mediaType: 'none' };

const TimelineBuilder = () => {
  const { packet, addTimelineItem, removeTimelineItem } = usePacket();
  const [form, setForm]       = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('media', file);
      const { data } = await uploadMedia(fd);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setForm(f => ({ ...f, mediaUrl: data.mediaUrl, mediaType: type }));
      showSuccess('Media uploaded!');
    } catch {
      showError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    if (!form.title.trim()) { showError('Title is required.'); return; }
    addTimelineItem({ ...form });
    setForm(emptyForm);
    fileRef.current.value = '';
    showSuccess('Memory added to your vault!');
  };

  return (
    <div className="space-y-5">
      {/* ── Add Memory Form ── */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-4">Add a Memory</h3>

        {/* Upload zone */}
        <div
          onClick={() => !uploading && fileRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors mb-4 ${
            form.mediaUrl
              ? 'border-tertiary bg-tertiary-fixed/20'
              : 'border-primary-fixed-dim bg-surface-bright hover:bg-surface-container-low'
          }`}
        >
          {uploading ? (
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          ) : form.mediaUrl ? (
            <>
              {form.mediaType === 'image'
                ? <img src={`http://localhost:5000${form.mediaUrl}`} alt="preview" className="w-full max-h-40 object-cover rounded-xl" />
                : <video src={`http://localhost:5000${form.mediaUrl}`} className="w-full max-h-40 rounded-xl" controls />
              }
              <p className="font-body text-caption text-tertiary mt-1">✅ Media ready</p>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-4xl text-primary">add_a_photo</span>
              <p className="font-body font-bold text-label-bold text-on-surface">Upload Photo or Video</p>
              <p className="font-body text-caption text-on-surface-variant">Drag & drop or click to browse (max 50 MB)</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />

        <div className="space-y-3">
          <div>
            <label className="font-body text-caption text-on-surface-variant block mb-1">Title *</label>
            <input
              className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
              placeholder="The Great Cookie Heist 🍪"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="font-body text-caption text-on-surface-variant block mb-1">Date</label>
            <input
              type="date"
              className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div>
            <label className="font-body text-caption text-on-surface-variant block mb-1">Story</label>
            <textarea
              rows={3}
              className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors resize-none"
              placeholder="Tell the full story of this memory…"
              value={form.story}
              onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
            />
          </div>
          <div>
            <label className="font-body text-caption text-on-surface-variant block mb-1">
              🔒 Secret Note <span className="text-on-surface-variant/60">(sibling must click to reveal)</span>
            </label>
            <textarea
              rows={2}
              className="w-full border-2 border-secondary-fixed bg-secondary-fixed/20 rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors resize-none"
              placeholder="Your secret message or inside joke…"
              value={form.secretNote}
              onChange={e => setForm(f => ({ ...f, secretNote: e.target.value }))}
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-secondary text-on-secondary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add to Vault
          </button>
        </div>
      </div>

      {/* ── Timeline List ── */}
      {packet.timeline.length > 0 && (
        <div className="space-y-3">
          <p className="font-body text-caption text-on-surface-variant font-bold uppercase tracking-wider">
            {packet.timeline.length} Memor{packet.timeline.length === 1 ? 'y' : 'ies'} Added
          </p>
          <AnimatePresence>
            {packet.timeline.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3 border border-outline-variant/20"
              >
                {item.mediaUrl
                  ? <img src={`http://localhost:5000${item.mediaUrl}`} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  : <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary">photo</span>
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <p className="font-body font-bold text-label-bold text-on-surface truncate">{item.title}</p>
                  <p className="font-body text-caption text-on-surface-variant">{item.date || 'No date'}</p>
                </div>
                {item.secretNote && (
                  <span className="material-symbols-outlined text-secondary text-[18px]" title="Has secret note">lock</span>
                )}
                <button onClick={() => removeTimelineItem(item.id)} className="p-1 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TimelineBuilder;
