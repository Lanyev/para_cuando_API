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
    let publicationType = await models.PublicationsTypes.findByPk(id, { raw: true })
    if (!publicationType) throw new CustomError('Not found PublicationsTypes', 404, 'Not Found')
    return publicationType
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getPublicationsTypes(id) {
    let publicationType = await models.PublicationsTypes.findByPk(id)
    if (!publicationType) throw new CustomError('Not found PublicationsTypes', 404, 'Not Found')
    return publicationType
  }

  async updatePublicationsTypes(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let publicationType = await models.PublicationsTypes.findByPk(id)

      if (!publicationType) throw new CustomError('Not found PublicationsTypes', 404, 'Not Found')

      let updatedPublicationsTypes = await publicationType.update(obj, { transaction })

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
      let publicationType = await models.PublicationsTypes.findByPk(id)

      if (!publicationType) throw new CustomError('Not found PublicationsTypes', 404, 'Not Found')

      await publicationType.destroy({ transaction })

      await transaction.commit()

      return publicationType
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

}

module.exports = PublicationsTypesService