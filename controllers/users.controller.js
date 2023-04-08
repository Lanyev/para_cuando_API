const UsersService = require('../services/users.service')
const { getPagination, getPagingData } = require('../utils/helpers')

const UserService = new UsersService()

const getUsers = async (request, response, next) => {
  try {
    const admin = request.admin

    if(!admin) return response.status(403).json({ message: 'Unauthorized' })

    let query = request.query
    let { page, size } = query
    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset

    let users = await UserService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return response.json({ results: results })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (request, response, next) => {
  try {
    let { id } = request.params
    const admin = request.admin
    const sameUser = request.isSameUser(id)
    let scope = 'public'
    
    if (sameUser || admin ) 
      scope = 'admin'

    let user = await UserService.getUser(id, scope)
    return response.json({ results: user })
   
  } catch (error) {
    next(error)
  }
}

const getMyUser = async (request, response, next) => {
  try {
    let { id } = request.user.id
    let user = await UserService.getUser(id)
    return response.json({ results: user })
  } catch (error) {
    next(error)
  }
}

const patchUser = async (request, response, next) => {
  try {
    let { id } = request.user
    
    if (id !== request.params.id) 
      return response.status(403).json({ message: 'Unauthorized' })
      
    let { body } = request
    let user = await UserService.updateUser(id, body)
    return response.json({ results: user })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  getMyUser,
  patchUser,
}
