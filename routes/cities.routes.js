const express = require('express')
const router = express.Router()

const { getAllCities} = require('../controllers/cities.controller')

router.get( '/', getAllCities )


module.exports = router