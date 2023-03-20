const models = require('../database/models')
const { Op } = require('sequelize')
const  { CustomError }  = require('../utils/helpers')

class CitiesService {

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

    const states = await models.Cities.findAndCountAll(options)
    return states
  }

  async createCity({name}) {
    const transaction = await models.sequelize.transaction()
    try {
      let newCity = await models.Cities.create({
        name
      }, { transaction })

      await transaction.commit()
      return newCity
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  //Return Instance if we do not converted to json (or raw:true)
  async getCityOr404(id) {
    let country = await models.Cities.findByPk(id, { raw: true })
    if (!country) throw new CustomError('Not found Cities', 404, 'Not Found')
    return country
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getCity(id) {
    let country = await models.Cities.findByPk(id)
    if (!country) throw new CustomError('Not found Cities', 404, 'Not Found')
    return country
  }

  async updateCity(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.Cities.findByPk(id)

      if (!country) throw new CustomError('Not found Cities', 404, 'Not Found')

      let updatedCities = await country.update(obj, { transaction })

      await transaction.commit()

      return updatedCities
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeCity(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let country = await models.Cities.findByPk(id)

      if (!country) throw new CustomError('Not found Cities', 404, 'Not Found')

      await country.destroy({ transaction })

      await transaction.commit()

      return country
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

}

module.exports = CitiesService