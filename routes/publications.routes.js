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
  deletePublications,
} = require('../controllers/publications.controller');

router.route('/')
  .get(getPublications)
  .post( passportAuth, isAdmin, isSameUser, createPublications);
  
  router.route('/:id')
    .get(getPublicationsById)
    .put(passportAuth, isAdmin, isSameUser, putPublications)
    .delete(passportAuth, isAdmin, isSameUser, deletePublications);




module.exports = router;
