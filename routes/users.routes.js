const express = require('express');
const router = express.Router();

const passport = require('../libs/passport');

const {
  getUsers,
  getUserById,
  getMyUser,
  patchUser,
} = require('../controllers/users.controller');

router.get('/', getUsers);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getUserById
);

router.put('/:id', patchUser);

module.exports = router;
