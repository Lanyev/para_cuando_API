const express = require('express');
const router = express.Router();

const {passportAuth, passportAnonymous} = require('../libs/passport');
const {multerPublicationsPhotos} = require('../middlewares/multer.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');
const isSameUser = require('../middlewares/isSameUser.middleware');

const {
  getPublications,
  getPublicationById,
  putPublications,
  createPublications,
  createVote,
  deletePublications,
} = require('../controllers/publications.controller');

const {
  uploadImagePublication,
  removePublicationImage
} = require( '../controllers/publicatonsImages.controllers' )

router.get('/', passportAnonymous, getPublications)

router.get( '/:id', passportAnonymous, getPublicationById)

router.use( passportAuth, isAdmin, isSameUser )

router.post( '/', createPublications);

router.delete( '/:id', deletePublications );

router.post( '/:id/add-image', multerPublicationsPhotos.array('images', 3), uploadImagePublication )

router.delete( '/:id/remove-image/:order', removePublicationImage ) 

router.post( '/:id/vote', createVote);


module.exports = router;
