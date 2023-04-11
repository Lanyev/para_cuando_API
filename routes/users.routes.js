const express = require('express')
const router = express.Router()

const {
  getUsers,
  getUserById,
  patchUser,
  uploadImageUser,
  removeUserImage
} = require('../controllers/users.controller')

const {
  getPublicationsByUserId,
  getPublicationsByVote
} = require('../controllers/publications.controller');

const {multerPublicationsPhotos:multer} = require( '../middlewares/multer.middleware' )

router.get('/', getUsers)

router.get( '/:id', getUserById )

router.put('/:id', patchUser)

router.post( '/:id/add-image', multer.single('image'), uploadImageUser)

router.delete( '/:id/remove-image', removeUserImage)

router.get( '/:id/votes', getPublicationsByVote)

router.get( '/:id/publications', getPublicationsByUserId)

module.exports = router