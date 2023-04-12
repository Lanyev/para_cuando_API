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

  async createTags({name, description, image_url}) {
    const transaction = await models.sequelize.transaction()
    try {
      let newTags = await models.Tags.create({
        name,
        description,
        image_url
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
    let tag = await models.Tags.findByPk(id, { raw: true })
    if (!tag) throw new CustomError('Not found Tags', 404, 'Not Found')
    return tag
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getTag(id) {
    let tag = await models.Tags.findByPk(id)
    if (!tag) throw new CustomError('Not found Tags', 404, 'Not Found')
    return tag
  }

  async updateTag(id, {name, description}) {
    const transaction = await models.sequelize.transaction()
    try {
      let tag = await models.Tags.findByPk(id)

      if (!tag) throw new CustomError('Not found Tags', 404, 'Not Found')

      let updatedTags = await tag.update({name, description}, { transaction })

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
      let tag = await models.Tags.findByPk(id)

      if (!tag) throw new CustomError('Not found Tagss', 404, 'Not Found')
      
      if (tag.image_url) throw new CustomError('Image Tag is on Cloud, must be deleted first', 400, 'Bad Request')

      await tag.destroy({ transaction })

      await transaction.commit()

      return tag
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async createUserImage(id, image_url) {
    const transaction = await models.sequelize.transaction()
    try {  
      let tag = await models.Tags.findByPk(id);
      if (!tag) throw new CustomError('Not found tag', 404, 'Not Found');
      let newImage = await tag.update({ 
        image_url }, 
      { transaction })
      await transaction.commit();
      return newImage
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeUserImage(id) {{
    const transaction = await models.sequelize.transaction()
    try {  
      let tag = await models.Tags.findByPk(id);
      if (!tag) throw new CustomError('Not found tag', 404, 'Not Found');
      let newImage = await tag.update({ 
        image_url:null }, 
      { transaction })
      await transaction.commit();
      return newImage
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  }

}

module.exports = TagsService