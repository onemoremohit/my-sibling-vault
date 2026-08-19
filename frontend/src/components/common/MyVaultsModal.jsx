import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';
import Button from './Button';
import { getMyVaults } from '../../services/api';
import { showSuccess, showError } from './Toast';

const MyVaultsModal = ({ isOpen, onClose }) => {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVaults = async () => {
    setLoading(true);
    try {
      const { data } = await getMyVaults();
      setVaults(data.vaults || []);
    } catch (err) {
      console.error('Error fetching user vaults:', err);
      showError(err.response?.data?.error || 'Failed to load your vaults.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVaults();
    }
  }, [isOpen]);

  const copyVaultLink = (packetId) => {
    const url = `${window.location.origin}/vault/${packetId}`;
    navigator.clipboard.writeText(url);
    showSuccess('📋 Vault link copied to clipboard!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🗃️ My Sibling Vaults" size="lg">
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-body text-body-sm text-on-surface-variant">Loading your memory vaults…</p>
          </div>
        ) : vaults.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-primary-fixed/40 text-primary rounded-full flex items-center justify-center text-3xl mx-auto">
              🎁
            </div>
            <h4 className="font-display text-headline-sm text-on-surface">No Vaults Created Yet</h4>
            <p className="font-body text-body-sm text-on-surface-variant max-w-sm mx-auto">
              You haven't created any vaults under this account yet. Build your first personalized memory vault now!
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  window.location.href = '/studio';
                }}
                icon="add_circle"
              >
                Create New Vault
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <p className="font-body text-caption text-on-surface-variant">
              Showing {vaults.length} vault{vaults.length > 1 ? 's' : ''} created with your account:
            </p>

            {vaults.map((vault) => {
              const isCompleted = vault.interactions?.status === 'completed';
              const createdDate = new Date(vault.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <motion.div
                  key={vault.packetId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/30 hover:border-primary/40 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-title-md text-primary">
                          Vault for {vault.recipientName}
                        </h4>
                        <span className="font-body text-[11px] text-on-surface-variant">
                          (From {vault.senderName})
                        </span>
                      </div>
                      <p className="font-body text-caption text-on-surface-variant mt-0.5">
                        Created on {createdDate} • {vault.language === 'hinglish' ? '🇮🇳 Hinglish' : '🇬🇧 English'}
                      </p>
                    </div>

                    {/* Status Badge */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed font-body font-bold text-[11px] px-3 py-1 rounded-full shadow-sm">
                        <span>💌</span>
                        <span>Opened & Replied</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed font-body font-bold text-[11px] px-3 py-1 rounded-full shadow-sm">
                        <span>⏳</span>
                        <span>Awaiting Response</span>
                      </span>
                    )}
                  </div>

                  {/* If completed, show reaction summary */}
                  {isCompleted && (
                    <div className="bg-surface p-3 rounded-xl border border-secondary/30 text-body-sm font-body text-on-surface flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{vault.interactions?.reaction || '💖'}</span>
                        <span className="italic text-on-surface-variant line-clamp-1">
                          "{vault.interactions?.reactionMessage || 'Loved the vault!'}"
                        </span>
                      </div>
                      <a
                        href={`/reply/${vault.packetId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary font-bold text-caption hover:underline shrink-0 ml-2"
                      >
                        View Receipt 🧾 ↗
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => copyVaultLink(vault.packetId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-outline-variant text-on-surface font-body font-bold text-caption hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      <span>Copy Link</span>
                    </button>

                    <a
                      href={`/vault/${vault.packetId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-fixed/30 text-primary font-body font-bold text-caption hover:bg-primary-fixed/50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      <span>View Vault</span>
                    </a>

                    {isCompleted && (
                      <a
                        href={`/reply/${vault.packetId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-fixed/40 text-secondary font-body font-bold text-caption hover:bg-secondary-fixed/60 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        <span>Receipt</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MyVaultsModal;
