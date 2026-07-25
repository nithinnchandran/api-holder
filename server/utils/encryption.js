const crypto = require('crypto');

// The encryption key must be 32 bytes (256 bits)
// In production, this should be a strong random string stored in .env
const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret || secret.length !== 64) { // 64 hex characters = 32 bytes
    throw new Error('ENCRYPTION_KEY must be a 64 character hex string');
  }
  return Buffer.from(secret, 'hex');
};

const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypts a text string using AES-256-CBC
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text in format iv:encryptedData
 */
const encrypt = (text) => {
  if (!text) return null;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

/**
 * Decrypts an encrypted text string using AES-256-CBC
 * @param {string} encryptedText - The encrypted text in format iv:encryptedData
 * @returns {string} - The decrypted text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  
  const textParts = encryptedText.split(':');
  if (textParts.length !== 2) return null;
  
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedData = Buffer.from(textParts[1], 'hex');
  const key = getEncryptionKey();
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

module.exports = {
  encrypt,
  decrypt
};
