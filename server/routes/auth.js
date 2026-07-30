const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updateProfilePhoto
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload an image file'), false);
    }
  }
});

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateDetails);
router.put('/profile/photo', protect, upload.single('photo'), updateProfilePhoto);

module.exports = router;
