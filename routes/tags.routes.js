const express = require('express')
const router = express.Router()

const {
    getTags,
    postTag,
    getTagById,
    putTag,
    deleteTag
} = require('../controllers/tags.controller')

router.route('/')
    .get( getTags )
    .post( postTag )

router.route('/:id')
    .get( getTagById )
    .put( putTag )
    .delete( deleteTag )

module.exports = router