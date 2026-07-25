const APIKey = require('../models/APIKey');

// @desc    Get all API keys for user
// @route   GET /api/keys
// @access  Private
exports.getKeys = async (req, res, next) => {
  try {
    const keys = await APIKey.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      count: keys.length,
      data: keys
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single API key
// @route   GET /api/keys/:id
// @access  Private
exports.getKey = async (req, res, next) => {
  try {
    const key = await APIKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    // Make sure user owns key
    if (key.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: key
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new API key
// @route   POST /api/keys
// @access  Private
exports.createKey = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;

    // Use the virtual setters for encrypted fields by assigning them directly to the doc
    const newKey = new APIKey({
      userId: req.user.id,
      serviceName: req.body.serviceName,
      category: req.body.category,
      environment: req.body.environment,
      website: req.body.website,
      notes: req.body.notes,
      description: req.body.description,
      tags: req.body.tags,
      favorite: req.body.favorite,
      expiresAt: req.body.expiresAt
    });

    if (req.body.apiKey) newKey.apiKey = req.body.apiKey;
    if (req.body.secretKey) newKey.secretKey = req.body.secretKey;
    if (req.body.accessToken) newKey.accessToken = req.body.accessToken;
    if (req.body.refreshToken) newKey.refreshToken = req.body.refreshToken;

    await newKey.save();

    res.status(201).json({
      success: true,
      data: newKey
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update API key
// @route   PUT /api/keys/:id
// @access  Private
exports.updateKey = async (req, res, next) => {
  try {
    let key = await APIKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    // Make sure user owns key
    if (key.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Assign new values, utilizing virtuals for encryption
    const updateFields = ['serviceName', 'category', 'environment', 'website', 'notes', 'description', 'tags', 'favorite', 'archived', 'expiresAt'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        key[field] = req.body[field];
      }
    });

    if (req.body.apiKey !== undefined) key.apiKey = req.body.apiKey;
    if (req.body.secretKey !== undefined) key.secretKey = req.body.secretKey;
    if (req.body.accessToken !== undefined) key.accessToken = req.body.accessToken;
    if (req.body.refreshToken !== undefined) key.refreshToken = req.body.refreshToken;

    await key.save();

    res.status(200).json({
      success: true,
      data: key
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete API key
// @route   DELETE /api/keys/:id
// @access  Private
exports.deleteKey = async (req, res, next) => {
  try {
    const key = await APIKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    // Make sure user owns key
    if (key.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await APIKey.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
