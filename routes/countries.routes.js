const express = require('express')
const router = express.Router()

const passport = require('../libs/passport')

const { getAllCountries} = require('../controllers/countries.controller')


router.get( '/', passport.authenticate('jwt', { session: false }), getAllCountries )


module.exports = router