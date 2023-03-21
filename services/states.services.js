const models = require('../database/models')
const { Op } = require('sequelize')
const  { CustomError }  = require('../utils/helpers')

class StatesService {

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

    const states = await models.States.findAndCountAll(options)
    return states
  }

  async createState({name}) {
    const transaction = await models.sequelize.transaction()
    try {
      let newState = await models.States.create({
        name
      }, { transaction })

      await transaction.commit()
      return newState
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  //Return Instance if we do not converted to json (or raw:true)
  async getStateOr404(id) {
    let country = await models.States.findByPk(id, { raw: true })
    if (!country) throw new CustomError('Not found States', 404, 'Not Found')
    return country
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getState(id) {
    let country = await models.States.findByPk(id)
    if (!country) throw new CustomError('Not found States', 404, 'Not Found')
    return country
  }

  async updateState(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.States.findByPk(id)

      if (!country) throw new CustomError('Not found States', 404, 'Not Found')

      let updatedStates = await country.update(obj, { transaction })

      await transaction.commit()

      return updatedStates
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeState(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.States.findByPk(id)

      if (!country) throw new CustomError('Not found States', 404, 'Not Found')

      await country.destroy({ transaction })

      await transaction.commit()

      return country
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

}

module.exports = StatesService