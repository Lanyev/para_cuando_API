const models = require('../database/models')
const { Op } = require('sequelize')
const  { CustomError }  = require('../utils/helpers')

class TagsService {

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

    const states = await models.Tags.findAndCountAll(options)
    return states
  }

  async createTags({name}) {
    const transaction = await models.sequelize.transaction()
    try {
      let newTags = await models.Tags.create({
        name
      }, { transaction })

      await transaction.commit()
      return newTags
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  //Return Instance if we do not converted to json (or raw:true)
  async getTagOr404(id) {
    let country = await models.Tags.findByPk(id, { raw: true })
    if (!country) throw new CustomError('Not found Tags', 404, 'Not Found')
    return country
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getTag(id) {
    let country = await models.Tags.findByPk(id)
    if (!country) throw new CustomError('Not found Tags', 404, 'Not Found')
    return country
  }

  async updateTag(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.Tags.findByPk(id)

      if (!country) throw new CustomError('Not found Tags', 404, 'Not Found')

      let updatedTags = await country.update(obj, { transaction })

      await transaction.commit()

      return updatedTags
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeTag(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.Tags.findByPk(id)

      if (!country) throw new CustomError('Not found Tagss', 404, 'Not Found')

      await country.destroy({ transaction })

      await transaction.commit()

      return country
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

}

module.exports = TagsService