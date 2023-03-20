const models = require('../database/models')
const { Op } = require('sequelize')
const  { CustomError }  = require('../utils/helpers')

class PublicationsTypesService {

  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
    }

    const { limit, offset } = query
    if (limit && offset) {
      options.limit = limit
      options.offset = offset
    }

    const { id } = query
    if (id) {
      options.where.id = id
    }

    const { name } = query
    if (name) {
      options.where.name = { [Op.iLike]: `%${name}%` }
    }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true

    const states = await models.PublicationsTypes.findAndCountAll(options)
    return states
  }

  async createPublicationsTypes({name}) {
    const transaction = await models.sequelize.transaction()
    try {
      let newPublicationsTypes = await models.PublicationsTypes.create({
        name
      }, { transaction })

      await transaction.commit()
      return newPublicationsTypes
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  //Return Instance if we do not converted to json (or raw:true)
  async getPublicationsTypesOr404(id) {
    let country = await models.PublicationsTypes.findByPk(id, { raw: true })
    if (!country) throw new CustomError('Not found PublicationsTypes', 404, 'Not Found')
    return country
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getPublicationsTypes(id) {
    let country = await models.PublicationsTypes.findByPk(id)
    if (!country) throw new CustomError('Not found PublicationsTypes', 404, 'Not Found')
    return country
  }

  async updatePublicationsTypes(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.PublicationsTypes.findByPk(id)

      if (!country) throw new CustomError('Not found PublicationsTypes', 404, 'Not Found')

      let updatedPublicationsTypes = await country.update(obj, { transaction })

      await transaction.commit()

      return updatedPublicationsTypes
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removePublicationsTypes(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.PublicationsTypes.findByPk(id)

      if (!country) throw new CustomError('Not found PublicationsTypes', 404, 'Not Found')

      await country.destroy({ transaction })

      await transaction.commit()

      return country
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

}

module.exports = PublicationsTypesService