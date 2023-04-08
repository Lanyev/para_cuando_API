const express = require('express');
const router = express.Router();

const passportAuth = require('../libs/passport');
const isAdmin = require('../middlewares/isAdmin.middleware');
const isSameUser = require('../middlewares/isSameUser.middleware');

const {
  getPublications,
  getPublicationsById,
  putPublications,
  createPublications,
  deletePublications
} = require('../controllers/publications.controller');

const {
  uploadImagePublication,
  removePublicationImage
} = require( '../controllers/publicatonsImages.controllers' )

router.route('/')
  .get(getPublications)
  .post( passportAuth, isAdmin, isSameUser, createPublications);
  
router.route('/:id')
  .get(getPublicationsById)
  .put(passportAuth, isAdmin, isSameUser, putPublications)
  .delete(passportAuth, isAdmin, isSameUser, deletePublications);

router.post( '/:id/add-image', isAdmin, isSameUser, uploadImagePublication)

router.delete( '/:id/remove-image/order', isAdmin, isSameUser, removePublicationImage)


module.exports = router;
