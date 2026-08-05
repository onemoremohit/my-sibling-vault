/**
 * generateLink.js
 * Produces the full shareable Recipient URL for a given packetId.
 */
const generateLink = (packetId) => {
  const base = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${base}/vault/${packetId}`;
};

export default generateLink;
