const express = require('express');
const router = express.Router();

const passportAuth = require('../libs/passport')
const isAdmin = require( '../middlewares/isAdmin.middleware' )
const sameUser = require( '../middlewares/sameUser.middleware' )

const {
  getPublications,
  getPublicationsById,
  putPublications,
} = require('../controllers/publications.controller');

router.get('/', getPublications);
router.get('/:id', getPublicationsById);

router.use( passportAuth, isAdmin, sameUser )

router.put('/:id', putPublications);

module.exports = router;
