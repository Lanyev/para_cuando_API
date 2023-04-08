const PublicationsTypesService = require('../services/publicationsTypes.services')
const { getPagination, getPagingData } = require('../utils/helpers')

const publicationsTypesService = new PublicationsTypesService()

const getPublicationsTypes = async (request, response, next) => {
  try {
    let query = request.query
    let { page, size } = query
    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset

    const publicationsTypes = await publicationsTypesService.findAndCount(query)
    const results = getPagingData(publicationsTypes, page, limit)
    return response.json( {results} )

  } catch (error) {
    next(error)
  }
}

const getPublicationsTypesById = async (request, response, next) => {
  try {
    let { id } = request.params
    let results = await publicationsTypesService.getPublicationsTypes(id)
    return response.json({ results })    
  } catch (error) {
    next(error)
  }
}

const getMyPublicationsTypes = async (request, response, next) => {
  try {
    let { id } = request.publicationsTypes.id
    let publicationsTypes = await publicationsTypesService.getPublicationsTypes(id)
    return response.json({ results: publicationsTypes })
  } catch (error) {
    next(error)
  }
}

const putPublicationsTypes = async (request, response, next) => {
  try {
    const admin = request.admin
    if(!admin) return response.status(403).json({ message: 'Unauthorized' })
    const { id } = request.params
    let { body } = request
    const publicationsTypes = await publicationsTypesService.updatePublicationsTypes(id, body)
    return response.json({ message: 'Success Update', })
  } catch (error) {
    console.log({Error:'Entro Aqui'})
    next(error)
  }
}

module.exports = {
  getPublicationsTypes,
  getPublicationsTypesById,
  getMyPublicationsTypes,
  putPublicationsTypes,
}
