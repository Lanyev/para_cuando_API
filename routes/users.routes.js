const express = require('express')
const router = express.Router()

const isAdmin = require( '../middlewares/isAdmin.middleware' )

const {
  getUsers,
  getUserById,
  getMyUser,
  patchUser,
} = require('../controllers/users.controller')

router.get('/', isAdmin,getUsers)

router.get( '/:id', isAdmin, getUserById )

router.put('/:id', patchUser)

module.exports = router
