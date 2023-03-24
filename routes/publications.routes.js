const express = require('express');
const router = express.Router();

const {
  getPublications,
  getPublicationsById,
  putMyPublications,
  putPublications,
} = require('../controllers/publications.controller');

router.get('/', getPublications);
router.get('/:id', getPublicationsById);
// router.put('/my', putMyPublications);
router.put('/:id', putPublications);

module.exports = router;
