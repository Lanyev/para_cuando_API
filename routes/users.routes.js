const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  getMyUser,
  updateUser,
} = require('../controllers/users.controller');

router.get('/', getUsers);
router.get('/me', getMyUser);
router.get('/:id', getUserById);
router.patch('/me', updateUser);

module.exports = router;
