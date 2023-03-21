const express = require('express')
const router = express.Router()

const { getAllRoles } = require('../controllers/roles.controller')

router.get( '/', getAllRoles )

module.exports = router