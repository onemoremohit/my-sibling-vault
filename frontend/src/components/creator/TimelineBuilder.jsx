import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { uploadMedia } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const emptyForm = {
  title: '',
  date: '',
  story: '',
  secretNote: '',
  mediaUrl: '',
  mediaUrls: [],
  mediaType: 'none',
};

const TimelineBuilder = () => {
  const { packet, addTimelineItem, removeTimelineItem, t } = usePacket();
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/${url}`;
  };

  const handleFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    // Check if video is selected
    const videoFile = selectedFiles.find((f) => f.type.startsWith('video'));
    if (videoFile && selectedFiles.length > 1) {
      showError('Please upload either 1 video OR multiple photos (not both).');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      selectedFiles.forEach((file) => {
        fd.append('mediaFiles', file);
      });

      const { data } = await uploadMedia(fd);
      const isVideo = !!videoFile;
      const newUrls = data.mediaUrls || (data.mediaUrl ? [data.mediaUrl] : []);

      setForm((f) => {
        let combinedUrls = [];
        let type = 'image';

        if (isVideo) {
          combinedUrls = newUrls;
          type = 'video';
        } else {
          // Keep existing photos unless current media is a video
          const existingPhotos = f.mediaType === 'video' ? [] : f.mediaUrls || [];
          combinedUrls = [...existingPhotos, ...newUrls].slice(0, 6);
          type = combinedUrls.length > 1 ? 'images' : 'image';
        }

        return {
          ...f,
          mediaUrls: combinedUrls,
          mediaUrl: combinedUrls[0] || '',
          mediaType: type,
        };
      });

      showSuccess(
        isVideo
          ? '📹 Video ready!'
          : `📸 ${newUrls.length} photo(s) added! Total: ${Math.min(6, (form.mediaType === 'video' ? 0 : form.mediaUrls.length) + newUrls.length)} photos.`
      );
    } catch (err) {
      console.error('Upload error:', err);
      showError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removePhoto = (indexToRemove) => {
    const newUrls = form.mediaUrls.filter((_, i) => i !== indexToRemove);
    if (newUrls.length === 0) {
      setForm((f) => ({ ...f, mediaUrls: [], mediaUrl: '', mediaType: 'none' }));
    } else {
      setForm((f) => ({
        ...f,
        mediaUrls: newUrls,
        mediaUrl: newUrls[0],
        mediaType: newUrls.length > 1 ? 'images' : 'image',
      }));
    }
  };

  const handleAdd = () => {
    if (!form.title.trim()) {
      showError('Memory Title is required.');
      return;
    }
    addTimelineItem({ ...form });
    setForm(emptyForm);
    if (fileRef.current) fileRef.current.value = '';
    showSuccess(t('addMemoryTitle'));
  };

  return (
    <div className="space-y-6">
      {/* ── Add Memory Form ── */}
      <div className="bg-surface rounded-3xl p-6 shadow-card border-2 border-outline-variant/30 space-y-5 relative overflow-hidden">
        {/* Paper Pin Header Ornament */}
        <div className="absolute top-3 right-5 text-2xl opacity-80 select-none">📌</div>

        <div className="space-y-1">
          <h3 className="font-display text-headline-md text-primary font-bold">
            {t('addMemoryTitle')}
          </h3>
          <p className="font-body text-caption text-on-surface-variant">
            Create a nostalgic timeline card with photos, video, and a wax-sealed secret note.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="space-y-2">
          <label className="font-body text-caption font-bold text-on-surface block">
            Media (Multiple Photos OR 1 Video)
          </label>

          <div
            onClick={() => !uploading && fileRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              form.mediaUrls.length > 0
                ? 'border-tertiary bg-tertiary-fixed/10'
                : 'border-primary-fixed-dim bg-surface-bright hover:bg-surface-container-low hover:border-primary'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <span className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-body font-bold text-caption text-primary">Uploading your media…</p>
              </div>
            ) : form.mediaUrls.length > 0 ? (
              <div className="w-full space-y-3">
                {form.mediaType === 'video' ? (
                  <div className="relative rounded-xl overflow-hidden bg-black/5 max-h-52 flex items-center justify-center">
                    <video
                      src={getMediaUrl(form.mediaUrl)}
                      className="w-full max-h-52 object-cover rounded-xl"
                      controls
                    />
                  </div>
                ) : (
                  /* Multiple Photos Thumbnail Grid */
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {form.mediaUrls.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square bg-surface-container">
                        <img
                          src={getMediaUrl(url)}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(idx);
                          }}
                          className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-90 hover:bg-error transition-colors"
                          title="Remove photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {form.mediaUrls.length < 6 && (
                      <div className="border-2 border-dashed border-primary-fixed-dim rounded-xl flex flex-col items-center justify-center p-2 text-primary hover:bg-primary-fixed/20 transition-colors aspect-square">
                        <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                        <span className="font-body text-[10px] font-bold">+ Add Photo</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-caption font-body font-bold text-tertiary pt-1">
                  <span>{form.mediaType === 'video' ? '📹 1 Video Selected' : `📸 ${form.mediaUrls.length} Photos Selected (Collage Ready)`}</span>
                  <span className="underline hover:text-primary text-[11px]">Click to change / add</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-1 py-2">
                <div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                </div>
                <p className="font-body font-bold text-label-bold text-on-surface">
                  {t('uploadMediaTitle')}
                </p>
                <p className="font-body text-caption text-on-surface-variant max-w-sm">
                  {t('uploadMediaHint')}
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFiles}
            className="hidden"
          />
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-caption font-bold text-on-surface block mb-1">
                {t('titleLabel')}
              </label>
              <input
                className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
                placeholder={t('titlePlaceholder')}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="font-body text-caption font-bold text-on-surface block mb-1">
                {t('dateLabel')}
              </label>
              <input
                type="text"
                className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
                placeholder={t('datePlaceholder') || 'e.g. Summer 2018 or July 14'}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="font-body text-caption font-bold text-on-surface block mb-1">
              {t('storyLabel')}
            </label>
            <textarea
              rows={3}
              className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors resize-none"
              placeholder={t('storyPlaceholder')}
              value={form.story}
              onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
            />
          </div>

          {/* ── Highlighting Secret Note Feature Box ── */}
          <div className="bg-gradient-to-r from-amber-500/10 via-secondary-fixed/20 to-primary-fixed/20 border-2 border-secondary/40 rounded-2xl p-4 space-y-2 shadow-sm relative">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="font-display font-bold text-body-md text-secondary flex items-center gap-2">
                <span className="text-xl">✉️</span> {t('secretNoteLabel')}
              </label>
              <div className="flex items-center gap-2">
                <span className="font-body text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Optional
                </span>
                <span className="font-body text-[10px] font-bold bg-secondary text-on-secondary px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Flagship ✨
                </span>
              </div>
            </div>
            <p className="font-body text-caption text-on-surface-variant">
              {t('secretNoteHint')}
            </p>
            <textarea
              rows={2}
              className="w-full border-2 border-secondary bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none transition-colors resize-none"
              placeholder={t('secretNotePlaceholder')}
              value={form.secretNote}
              onChange={(e) => setForm((f) => ({ ...f, secretNote: e.target.value }))}
            />
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-body font-bold text-label-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-card"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            {t('addToVaultBtn')}
          </button>
        </div>
      </div>

      {/* ── Added Memories List ── */}
      {packet.timeline.length > 0 && (
        <div className="space-y-3">
          <p className="font-body text-caption text-on-surface-variant font-bold uppercase tracking-wider">
            {packet.timeline.length} {t('memoriesAddedCount')}
          </p>
          <AnimatePresence>
            {packet.timeline.map((item) => {
              const urls = item.mediaUrls?.length > 0 ? item.mediaUrls : item.mediaUrl ? [item.mediaUrl] : [];
              const firstUrl = urls[0];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 bg-surface-container-low rounded-2xl p-3 border border-outline-variant/30 shadow-sm"
                >
                  {firstUrl ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                      <img
                        src={getMediaUrl(firstUrl)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {urls.length > 1 && (
                        <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white font-body text-[10px] font-bold px-1 rounded">
                          +{urls.length - 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center flex-shrink-0 text-primary">
                      <span className="material-symbols-outlined">photo_library</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-body-md text-on-surface truncate">
                      {item.title}
                    </p>
                    <p className="font-body text-caption text-on-surface-variant">
                      {item.date || t('noDateText')} {urls.length > 1 && `• ${urls.length} photos collage`}
                    </p>
                  </div>

                  {item.secretNote && (
                    <span
                      className="material-symbols-outlined text-secondary text-[20px] bg-secondary-fixed p-1.5 rounded-full"
                      title={t('hasSecretNoteTooltip')}
                    >
                      mark_email_unread
                    </span>
                  )}

                  <button
                    onClick={() => removeTimelineItem(item.id)}
                    className="p-2 rounded-xl hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TimelineBuilder;
