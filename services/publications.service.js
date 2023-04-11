const models = require('../database/models');
const { Op, cast, literal } = require('sequelize');
const { CustomError } = require('../utils/helpers');
const { v4: uuidv4 } = require('uuid');

const defaultFilter =  {
  include: [
    {
      model: models.Users.scope( 'user' ),
      as: 'user',
    },
    {
      model: models.PublicationTypes,
      as: 'publication_type',
    },
    {
      model: models.PublicationsImages,
      as: 'images',
    },
    {
      model: models.Tags,
      as: 'tags',
      through: { attributes: [] },
    },
    {
      model: models.Users.scope( 'same_vote' ),
      as: 'same_vote',
      through: { attributes: [] },
    },
  ],
  attributes: {
    include: [
      [
        cast(
          literal(
            `(SELECT COUNT(*) FROM "votes" 
        WHERE "votes"."publication_id" = "Publications"."id")`
          ),
          'integer'
        ),
        'votes_count',
      ],
    ],
  },
}

class PublicationsService {
  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
      ...defaultFilter
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    // const { tags } = query;
    // if (tags) {
    //   const ids = publication_id.map((pub) => pub.publication_id);
    //   options.where.id = { [Op.in]: ids };
    // }

    const { publication_type_id } = query;
    if (publication_type_id) {
      options.where.publication_type_id = publication_type_id;
    }

    const { title } = query;
    if (title) {
      options.where.title = { [Op.iLike]: `%${title}%` };
    }

    const { content } = query;
    if (content) {
      options.where.content = { [Op.iLike]: `%${content}%` };
    }

    const { description } = query;
    if (description) {
      options.where.description = { [Op.iLike]: `%${description}%` };
    }

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
    tags
  }) {
    const transaction = await models.sequelize.transaction();
    try {
      let newPublication = await models.Publications.create(
        {
          id: uuidv4(),
          user_id,
          publication_type_id,
          title,
          description,
          content,
          city_id,
          reference_link,
        },
        { transaction }
      );

      if (tags){
        let arrayTags = tags.split(',')
        let findedTags = await models.Tags.findAll({
          where: { id: arrayTags },
          attributes: ['id'],
          raw: true,
        })

        if (findedTags.length > 0) {
          let tags_ids = findedTags.map(tag => tag['id'])
          await newPublication.setTags(tags_ids, { transaction })
        }
      }

      await transaction.commit();
      return newPublication;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createVote( {publication_id, user_id} ){
    const transaction = await models.sequelize.transaction();
    try {
      const publication = await models.Publications.findOne({
        where:{
          id:publication_id
        }
      })

      console.log(publication)

      if (!user_id) return

      await publication.setSame_vote(user_id, { transaction })

      await transaction.commit();
      return publication;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getPublication(id) {
    const result = await models.Publications.findByPk(id, {
      ...defaultFilter
    });
    if (!result) {
      throw new CustomError('Publication not found', 404);
    }
    return result;
  }

  async findAndCountByVote( query ) {
    const {user_id} = query
    const options = {
      where:{user_id},
      include: [
        {
          model: models.Users.scope( 'user' ),
          as: 'user',
        },
        {
          model: models.PublicationTypes,
          as: 'publication_type',
        },
        {
          model: models.PublicationsImages,
          as: 'images',
        },
        {
          model: models.Tags,
          as: 'tags',
          through: { attributes: [] },
        },
        {
          model: models.Users.scope( 'same_vote' ),
          as: 'same_vote',
          through: { attributes: [] },
        },
      ],
      attributes: {
        include: [
          [
            cast(
              literal(
                `(SELECT COUNT(*) FROM "votes" 
            WHERE "votes"."publication_id" = "Publications"."id")`
              ),
              'integer'
            ),
            'votes_count',
          ],
        ],
      }
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
      ...defaultFilter
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

  async updatePublications(
    id,
    {
      title,
      description,
      content,
      city_id,
      reference_link,
      user_id,
      publication_type_id,
    }
  ) {
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
        publication_type_id,
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
      let publications = await models.Publications.findOne({
        where:{id}
      });
      if (!publications) {
        throw new CustomError('Publication not found', 404);
      }
      const result = await publications.destroy({ transaction });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = PublicationsService;
