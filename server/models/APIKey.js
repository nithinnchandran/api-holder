const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const apiKeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceName: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true
  },
  encryptedApiKey: {
    type: String,
    required: false
  },
  encryptedSecret: {
    type: String,
    required: false
  },
  encryptedAccessToken: {
    type: String,
    required: false
  },
  encryptedRefreshToken: {
    type: String,
    required: false
  },
  category: {
    type: String,
    default: 'Development'
  },
  environment: {
    type: String,
    enum: ['Development', 'Staging', 'Production', 'Testing', 'Other'],
    default: 'Development'
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ],
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  favorite: {
    type: Boolean,
    default: false
  },
  archived: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true }
});

// Virtuals to seamlessly get/set encrypted fields

apiKeySchema.virtual('apiKey')
  .get(function() {
    if (this.encryptedApiKey) return decrypt(this.encryptedApiKey);
    return null;
  })
  .set(function(value) {
    if (value) this.encryptedApiKey = encrypt(value);
  });

apiKeySchema.virtual('secretKey')
  .get(function() {
    if (this.encryptedSecret) return decrypt(this.encryptedSecret);
    return null;
  })
  .set(function(value) {
    if (value) this.encryptedSecret = encrypt(value);
  });

apiKeySchema.virtual('accessToken')
  .get(function() {
    if (this.encryptedAccessToken) return decrypt(this.encryptedAccessToken);
    return null;
  })
  .set(function(value) {
    if (value) this.encryptedAccessToken = encrypt(value);
  });

apiKeySchema.virtual('refreshToken')
  .get(function() {
    if (this.encryptedRefreshToken) return decrypt(this.encryptedRefreshToken);
    return null;
  })
  .set(function(value) {
    if (value) this.encryptedRefreshToken = encrypt(value);
  });

module.exports = mongoose.model('APIKey', apiKeySchema);
