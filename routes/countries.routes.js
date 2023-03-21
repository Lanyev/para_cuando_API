const express = require('express')
const router = express.Router()

const { getAllCountries} = require('../controllers/countries.controller')


router.get( '/', getAllCountries )


module.exports = router