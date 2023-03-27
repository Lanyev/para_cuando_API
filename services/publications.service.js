const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers')

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

    const publications = await models.Publications.findAndCountAll(options)
    return publications
  }

  async createPublications({ name }) {
    const transaction = await models.sequelize.transaction()
    try {
      let newPublications = await models.Publications.create(
        {
          name,
        },
        { transaction }
      )

      await transaction.commit()
      return newPublications
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  //Return Instance if we do not converted to json (or raw:true)
  async getPublicationsOr404(id) {
    let publication = await models.Publications.findByPk(id, { raw: true })
    if (!publication)
      throw new CustomError('Not found Publications', 404, 'Not Found')
    return publication
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getPublications(id) {
    let publication = await models.Publications.findByPk(id)
    return publication
  }

  async updatePublications(id, { name }) {
    const transaction = await models.sequelize.transaction()
    try {
      let publications = await this.getPublicationsOr404(id)
      publications.name = name
      await publications.save({ transaction })
      await transaction.commit()
      return publications
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async deletePublications(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let publications = await this.getPublicationsOr404(id)
      await publications.destroy({ transaction })
      await transaction.commit()
      return publications
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

module.exports = PublicationsTypesService
