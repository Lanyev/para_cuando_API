const models = require('../database/models');
const { Op, cast, literal } = require('sequelize');
const { CustomError } = require('../utils/helpers');
const { v4: uuidv4 } = require('uuid');

class PublicationsService {
  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
      include: [
        {
          model: models.Users.scope('view_public'),
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
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { tag_id } = query;
    if (tag_id) {
      const publication_id = await models.PublicationsTags.findAll({
        where: { tag_id },
        attributes: { exclude: ['id'] },
      });
      const ids = publication_id.map((pub) => pub.publication_id);
      options.where.id = { [Op.in]: ids };
    }

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
    const result = await models.Publications.findByPk(id, {
      include: [
        {
          model: models.Users.scope('view_public'),
          as: 'user',
        },
        {
          model: models.Tags,
          as: 'tags',
          through: { attributes: [] },
        },
        {
          model: models.PublicationTypes,
          as: 'publication_type',
        },
        {
          model: models.PublicationsImages,
          as: 'images',
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
    });
    if (!result) {
      throw new CustomError('Publication not found', 404);
    }
    return result;
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

module.exports = PublicationsService;
