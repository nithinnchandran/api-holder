const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateDetails);

module.exports = router;
