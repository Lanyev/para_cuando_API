const models = require('../database/models');
const { Op } = require('sequelize');
const { CustomError } = require('../utils/helpers');
const { v4: uuidv4 } = require('uuid');

class PublicationsTypesService {
  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { id } = query;
    if (id) {
      options.where.id = id;
    }

    const { name } = query;
    if (name) {
      options.where.name = { [Op.iLike]: `%${name}%` };
    }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true;

    const publications = await models.Publications.findAndCountAll(options);
    return publications;
  }

  async createPublications({
    title,
    description,
    content,
    city_id,
    reference_link,
    user_id,
    publication_type_id,
  }) {
    const transaction = await models.sequelize.transaction();
    try {
      let newPublication = await models.Publications.create(
        {
          id: uuidv4(),
          title,
          description,
          content,
          city_id,
          reference_link,
          user_id,
          publication_type_id,
        },
        { transaction }
      );

      await transaction.commit();
      return newPublication;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getPublications(id) {
    let publication = await models.Publications.findByPk(id);
    return publication;
  }

  async updatePublications(id, { name }) {
    const transaction = await models.sequelize.transaction();
    try {
      let publications = await this.getPublicationsOr404(id);
      publications.name = name;
      await publications.save({ transaction });
      await transaction.commit();
      return publications;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deletePublications(id) {
    const transaction = await models.sequelize.transaction();
    try {
      let publications = await this.getPublicationsOr404(id);
      await publications.destroy({ transaction });
      await transaction.commit();
      return publications;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = PublicationsTypesService;
