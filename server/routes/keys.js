const express = require('express');
const {
  getKeys,
  getKey,
  createKey,
  updateKey,
  deleteKey
} = require('../controllers/keyController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getKeys)
  .post(protect, createKey);

router.route('/:id')
  .get(protect, getKey)
  .put(protect, updateKey)
  .delete(protect, deleteKey);

module.exports = router;
