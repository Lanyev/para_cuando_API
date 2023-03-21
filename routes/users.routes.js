const express = require('express')
const router = express.Router()

const {
  getUsers,
  getUserById,
  getMyUser,
  patchUser,
} = require('../controllers/users.controller')

router.get('/', getUsers)

router.get( '/:id', getUserById )

router.put('/:id', patchUser)

module.exports = router
