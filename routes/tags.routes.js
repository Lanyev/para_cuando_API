const express = require('express')
const router = express.Router()
const {multerPublicationsPhotos:multer} = require( '../middlewares/multer.middleware' )

const {
    getTags,
    postTag,
    getTagById,
    putTag,
    deleteTag,
    uploadImageTag,
    removeUserTag
} = require('../controllers/tags.controller')

router.route('/')
    .get( getTags )
    .post( postTag )

router.route('/:id')
    .get( getTagById )
    .put( putTag )
    .delete( deleteTag )

router.post( '/:id/add-image', multer.single( 'image' ), uploadImageTag )

router.delete( '/:id/remove-image', multer.single( 'image' ), removeUserTag )

module.exports = router