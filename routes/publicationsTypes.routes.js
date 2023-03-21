const express = require('express')
const router = express.Router()

const passport = require('../libs/passport')

const {
    getPublicationsTypes,
    getPublicationsTypesById,
    putPublicationsTypes
} = require('../controllers/publicationsTypes.controller')

router.get('/', getPublicationsTypes)

router.route('/:id')
    .get( getPublicationsTypesById )
    .put( putPublicationsTypes )

module.exports = router;