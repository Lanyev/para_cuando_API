const express = require('express')
const router = express.Router()

const {
  getUsers,
  getUserById,
  getMyUser,
  patchUser,
} = require('../controllers/users.controller')

const {
  getMyPublications,
  getPublicationsByUserId,
  getPublicationsByVote
} = require('../controllers/publications.controller');

router.get('/', getUsers)

router.get( '/:id', getUserById )

router.put('/:id', patchUser)

router.get( '/:id/votes', getPublicationsByVote)

router.get( '/:id/publications', getPublicationsByUserId)

module.exports = router