const express = require('express')
const router = express.Router()

const passport = require('../libs/passport')

const {
    getTags,
    getTagById,
    putTag
} = require('../controllers/tags.controller')

router.get('/', getTags)

router.route('/:id')
    .get( getTagById )
    .put( putTag )

module.exports = router