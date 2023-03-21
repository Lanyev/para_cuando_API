const express = require('express')
const router = express.Router()

const passport = require('../libs/passport')

const { getAllCities} = require('../controllers/cities.controller')


router.get( '/',/* passport.authenticate('jwt', { session: false }),*/ getAllCities )


module.exports = router