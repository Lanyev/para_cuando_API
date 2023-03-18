const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  getMyUser,
  updateUser,
} = require('../controllers/users.controller');

router.get('/', getUsers);
router.route('/:id').get(getUserById);
router.route('/me').get(getMyUser);

router.put('/:id', updateUser);

module.exports = router;
