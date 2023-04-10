const models = require('../database/models');
const { Op, cast, literal } = require('sequelize');
const { CustomError } = require('../utils/helpers');
const { v4: uuidv4 } = require('uuid');

const defaultIncludes = {
  attributes:{
    include: [
      [cast(literal(
      `(SELECT COUNT(*) FROM "votes" 
        WHERE "votes"."publication_id" = "Publications"."id")`
      ), 'integer'), 
      'votes_count']
    ],
  },
  include:[
    {
      model:models.Users,
      as: 'user',
    },
    {
      model:models.Users,
      as: 'same_vote',
    },
    {
      model:models.PublicationsImages,
      as: 'images',
    },
    {
      model:models.Tags,
      as: 'tags',
    },
    {
      model:models.PublicationTypes,
      as: 'publication_type',
    },
  ]
}

class PublicationsTypesService {
  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
      ...defaultIncludes
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
    city_id = 1,
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
  async getPublication(id) {
    let publication = await models.Publications.findOne({
      where:{id},
      attributes:{
        include: [
          [cast(literal(
          `(SELECT COUNT(*) FROM "votes" 
            WHERE "votes"."publication_id" = "Publications"."id")`
          ), 'integer'), 
          'votes_count']
        ],
      },
      include:[
        {
          model:models.Users,
          as: 'same_vote',
          // where:{
          //   id:query.id
          // }
        },
      ]
    });
    if (!publication) throw new CustomError('Not found User', 404, 'Not Found');
    return publication;
  }

  async findAndCountByVote( query ) {
    const options = {
      where:{},
      ...defaultIncludes
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    
    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true;

    const publications = await models.Publications.findAndCountAll(options);
    return publications;
  }

  async findAndCountByUserId( query ) {
    const options = {
      where: {user_id:query.id},
      ...defaultIncludes
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    
    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true;

    const publications = await models.Publications.findAndCountAll(options);
    return publications;
  }

  async updatePublications(id, { 
    title,
    description,
    content,
    city_id,
    reference_link,
    user_id,
    publication_type_id, }) {
    const transaction = await models.sequelize.transaction();
    try {
      let publications = await models.Publications.findByPk(id);
      if (!publications) {
        throw new CustomError('Publication not found', 404);
      }
      publications.name = {
        title,
        description,
        content,
        city_id,
        reference_link,
        user_id,
        publication_type_id
      };
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
      let publications = await models.Publications.findByPk(id);
      if (!publications) {
        throw new CustomError('Publication not found', 404);
      }
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
