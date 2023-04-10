const express = require('express');
const router = express.Router();

const passportAuth = require('../libs/passport');
const {multerPublicationsPhotos} = require('../middlewares/multer.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');
const isSameUser = require('../middlewares/isSameUser.middleware');

const {
  getPublications,
  getPublicationById,
  putPublications,
  createPublications,
  deletePublications,
} = require('../controllers/publications.controller');

const {
  uploadImagePublication,
  removePublicationImage
} = require( '../controllers/publicatonsImages.controllers' )

router.get('/', getPublications)
router.get( '/:id', getPublicationById)

router.use( passportAuth, isAdmin, isSameUser )

router.post( '/', createPublications);

router.route('/:id')
  .put( putPublications )
  .delete( deletePublications );

router.post( '/:id/add-image', multerPublicationsPhotos.array('images', 3), uploadImagePublication )
router.delete( '/:id/remove-image/:order', removePublicationImage ) 


module.exports = router;
