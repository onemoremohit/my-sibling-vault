import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { uploadMedia } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';
import AdaptivePhotoFrame from '../common/AdaptivePhotoFrame';

const SIBLING_STORY_PRESETS_EN = [
  {
    title: 'Cherished Memories & Timeless Bond 📸✨',
    story: 'Through every laugh, every fight, and every shared memory, having you as my sibling is the greatest blessing. No matter how much we grow up or where life takes us, our bond remains unbreakable. Happy Raksha Bandhan! 🎀💖',
  },
  {
    title: 'From Childhood Mischief to Forever Friends 🎈',
    story: 'We may have fought over the TV remote, stolen each other’s snacks, and argued over silly things, but at the end of the day, there is no one I would rather share life with. You are my forever supporter and confidant! 🌟',
  },
  {
    title: 'Forever My Protector & Best Friend 💖',
    story: 'A picture captures a single second, but the love, protection, and unspoken care we share lasts a lifetime. Thank you for always standing by me through thick and thin. Happy Rakhi! 🌸',
  },
];

const SIBLING_STORY_PRESETS_HINGLISH = [
  {
    title: 'Hamari Sabse Pyaari Yaadein 📸✨',
    story: 'Har ladai, har muskaan, aur har anmol pal ke baad bhi, tum meri zindagi ka sabse special hissa ho. Chahe hum kitne bhi bade ho jayein, hamara pyaar aur yeh rishta hamesha aisa hi rahega. Happy Raksha Bandhan! 🎀💖',
  },
  {
    title: 'Bachpan Ki Masti Se Lekar Aaj Tak 🎈',
    story: 'TV remote ke liye jhagadna, bina bataye kapde churana aur har baat par mummy se complain karna... yeh sab yaadein hamare rishte ko aur mazboot banati hain. Tu hamesha meri sabse favourite hai! 🌟',
  },
  {
    title: 'Hamara Anmol Rishta 💖',
    story: 'Yeh tasveer toh bas ek pal hai, par hamara pyaar aur ek doosre ka khayal rakhna hamesha ke liye hai. Shukriya hamesha mere saath khade rehne ke liye. Happy Festival! 🌸',
  },
];

const TimelineBuilder = () => {
  const { packet, addTimelineItem, removeTimelineItem, updateTimelineItem, t } = usePacket();
  const isHinglish = packet?.language === 'hinglish';
  const presets = isHinglish ? SIBLING_STORY_PRESETS_HINGLISH : SIBLING_STORY_PRESETS_EN;

  const currentItem = packet.timeline?.[0] || null;

  const matchedPresetIdx = presets.findIndex(
    p => p.title === currentItem?.title || p.story === currentItem?.story
  );

  const [uploading, setUploading] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(
    matchedPresetIdx !== -1 ? matchedPresetIdx : null
  );
  const [secretNote, setSecretNote] = useState(currentItem?.secretNote || '');
  const [customTitle, setCustomTitle] = useState(currentItem?.title || '');
  const [customStory, setCustomStory] = useState(currentItem?.story || '');

  const fileRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('mediaFiles', file);

      const { data } = await uploadMedia(fd);
      const photoUrl = data.mediaUrl || data.mediaUrls?.[0] || '';

      const baseItem = {
        title: customTitle || (selectedPresetIndex !== null ? presets[selectedPresetIndex]?.title : ''),
        date: isHinglish ? 'Khaas Yaad' : 'Cherished Memory',
        story: customStory || (selectedPresetIndex !== null ? presets[selectedPresetIndex]?.story : ''),
        secretNote: secretNote.trim(),
        mediaUrl: photoUrl,
        mediaUrls: [photoUrl],
        mediaType: 'image',
      };

      if (currentItem?.id) {
        updateTimelineItem({ id: currentItem.id, ...baseItem });
      } else {
        addTimelineItem(baseItem);
      }

      showSuccess(isHinglish ? '📸 Sibling memory photo successfully save ho gayi!' : '📸 Sibling memory photo uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      showError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSelectPreset = (index) => {
    if (selectedPresetIndex === index) {
      // Toggle OFF (Deselect)
      setSelectedPresetIndex(null);
      setCustomTitle('');
      setCustomStory('');

      if (currentItem?.id) {
        updateTimelineItem({
          id: currentItem.id,
          title: '',
          story: '',
        });
      }
    } else {
      // Toggle ON (Select)
      setSelectedPresetIndex(index);
      const chosen = presets[index];
      setCustomTitle(chosen.title);
      setCustomStory(chosen.story);

      if (currentItem?.id) {
        updateTimelineItem({
          id: currentItem.id,
          title: chosen.title,
          story: chosen.story,
        });
      }
    }
  };

  const handleSaveSecretNote = () => {
    if (currentItem?.id) {
      updateTimelineItem({
        id: currentItem.id,
        secretNote: secretNote.trim(),
      });
      showSuccess(isHinglish ? '🔒 Wax-sealed secret note save ho gaya!' : '🔒 Wax-sealed secret note saved!');
    }
  };

  const handleRemovePhoto = () => {
    if (currentItem?.id) {
      removeTimelineItem(currentItem.id);
      showSuccess(isHinglish ? 'Photo remove ho gayi' : 'Photo removed');
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Main Memory Upload Card ── */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-card border-2 border-primary/25 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
            📸
          </div>
          <div>
            <h3 className="font-display text-headline-md text-primary">
              {isHinglish ? 'Bhai-Behen Ki Sabse Pyaari Photo Upload Karein' : 'Upload Your Favourite Sibling Photo'}
              <span className="text-error ml-1" title="Required">*</span>
            </h3>
            <p className="font-body text-body-sm text-on-surface-variant">
              {isHinglish
                ? 'Pichle saal ki Raksha Bandhan, bachpan ki ya koi bhi special photo chuno jisme aap dono saath ho!'
                : 'Select one special memory photo of you both (e.g. last Rakhi celebration, childhood moment, or favourite trip together)'}
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Upload Zone / Display Frame */}
        {currentItem?.mediaUrl ? (
          <div className="space-y-4">
            {/* Adaptive Uncropped Photo Preview */}
            <div className="relative group">
              <AdaptivePhotoFrame
                src={currentItem.mediaUrl}
                alt="Uploaded Sibling Memory"
                maxHeight="max-h-[460px]"
              />

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="bg-surface/90 hover:bg-surface text-primary border border-primary/30 font-body font-bold text-caption px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md transition-transform hover:scale-105 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">change_circle</span>
                  <span>{isHinglish ? 'Photo Badlein' : 'Change Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-error/90 hover:bg-error text-white font-body font-bold text-caption p-2 rounded-full shadow-lg backdrop-blur-md transition-transform hover:scale-105"
                  title="Remove Photo"
                >
                  <span className="material-symbols-outlined text-[16px] block">delete</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-primary font-body font-bold text-caption bg-primary-fixed/25 px-4 py-2.5 rounded-2xl">
              <span>✨</span>
              <span>
                {isHinglish
                  ? 'Tasveer poori dikhegi recipient ko bina kisi crop ke — ambient frame ready hai!'
                  : 'Your photo will be displayed in full aspect ratio without any crop to the recipient!'}
              </span>
            </div>
          </div>
        ) : (
          /* Dropzone Upload Button */
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className={`border-3 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              uploading
                ? 'border-primary bg-primary-fixed/10'
                : 'border-primary-fixed-dim bg-surface-bright hover:bg-surface-container-low hover:border-primary hover:scale-[1.005]'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <span className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-body font-bold text-body-md text-primary">
                  {isHinglish ? 'Photo upload ho rahi hai…' : 'Uploading your memory photo…'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center text-3xl shadow-sm">
                  🖼️
                </div>
                <div>
                  <p className="font-display text-headline-sm text-primary font-bold">
                    {isHinglish ? 'Apni Favourite Photo Select Karein' : 'Click to Upload 1 Best Sibling Photo'}
                  </p>
                  <p className="font-body text-body-sm text-on-surface-variant mt-1">
                    {isHinglish
                      ? 'Supports JPG, PNG, WEBP — Any size or portrait/landscape orientation'
                      : 'Supports JPG, PNG, WEBP — Works with any vertical or horizontal size'}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-body font-bold text-label-md px-5 py-2.5 rounded-2xl shadow-md mt-2">
                  <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                  <span>{isHinglish ? 'Photo Choose Karein' : 'Select Photo'}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Auto-Generated Sibling Bond Story Section ── */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-outline-variant/30 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-headline-sm text-primary font-bold">
              {isHinglish ? 'Sibling Prem Sandesh 💌' : 'Sibling Love Message & Tribute 💌'}
            </h3>
            <p className="font-body text-body-sm text-on-surface-variant">
              {isHinglish
                ? 'Yeh pyaara sandesh recipient card par photo ke saath show hoga'
                : 'This heartfelt message will accompany your photo in the recipient view'}
            </p>
          </div>
        </div>

        {/* Quick Tone / Story Presets */}
        <div className="space-y-2">
          <label className="block font-body text-caption font-bold text-on-surface-variant uppercase tracking-wider">
            {isHinglish ? 'Sandesh Preset Chuno' : 'Choose Message Tone'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {presets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPreset(i)}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all font-body ${
                  selectedPresetIndex === i
                    ? 'border-primary bg-primary-fixed/20 shadow-sm'
                    : 'border-outline-variant/50 hover:border-primary/60 bg-surface-bright'
                }`}
              >
                <p className="font-bold text-caption text-primary line-clamp-1">{preset.title}</p>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                  {preset.story}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Display of Selected Message (Shown only if a preset is selected) */}
        {selectedPresetIndex !== null && (customTitle || customStory) && (
          <div className="bg-gradient-to-br from-primary-fixed/15 via-surface-container-low to-secondary-fixed/15 rounded-2xl p-5 border border-primary/20 space-y-2">
            <h4 className="font-display text-label-lg text-primary font-bold">
              {customTitle || presets[selectedPresetIndex]?.title}
            </h4>
            <p className="font-body text-body-md text-on-surface leading-relaxed italic">
              "{customStory || presets[selectedPresetIndex]?.story}"
            </p>
          </div>
        )}
      </div>

      {/* ── Optional Secret Message ── */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤫</span>
            <div>
              <h3 className="font-display text-headline-sm text-on-surface font-bold">
                {isHinglish ? 'Write a secret message you want to tell them (Optional)' : 'Write a secret message you want to tell them (Optional)'}
              </h3>
              <p className="font-body text-caption text-on-surface-variant">
                {isHinglish
                  ? 'Yeh secret message recipient card par tab tak locked rahega jab tak wo tap karke na padhein!'
                  : 'This secret message stays locked until they tap to unlock and read it!'}
              </p>
            </div>
          </div>
          <span className="font-body text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline-variant/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Optional
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            rows={2}
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-2xl px-4 py-3 font-body text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors resize-none placeholder:text-on-surface-variant/50"
            placeholder={isHinglish
              ? 'e.g. Yaad hai jab humne secretly raat ko Maggi banayi thi? Tu hamesha meri best friend rahegi! 🤫'
              : 'e.g. Remember when we sneaked out for ice cream? You will always be my best friend! 🤫'}
            value={secretNote}
            onChange={(e) => setSecretNote(e.target.value)}
            onBlur={handleSaveSecretNote}
          />

          {secretNote && (
            <button
              type="button"
              onClick={handleSaveSecretNote}
              className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-body font-bold text-caption px-4 py-2 rounded-xl hover:opacity-90 shadow-sm"
            >
              <span>💾</span>
              <span>{isHinglish ? 'Secret Note Save Karein' : 'Save Secret Note'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineBuilder;
