const models = require('../database/models');
const { Op, cast, literal } = require('sequelize');
const { CustomError } = require('../utils/helpers');
const { v4: uuidv4 } = require('uuid');
const { options } = require('joi');

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

const addSameVote = (user_id, filter) => filter.include.push(
  {
    model: models.Users.scope( 'same_vote' ),
    as: 'same_vote',
    through:{
      where: {user_id},
      attributes:[]
    }
  }
)

class PublicationsService {
  constructor() {}

  async findAndCount(query, user_id) {
    const filter = defaultFilter
    addSameVote(user_id, filter)
    const options = {
      where: {},
      ...filter
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    // const { tags:tagsToSplit } = query;
    // if (tagsToSplit) {
    //   const tagsSplit = tagsToSplit.split(',')
    //   let publicationsIds = []
    //   for (const tagId of tagsSplit) {
    //     const Tag = await models.Tags.findOne({
    //         where:{id:tagId},
    //         attributes:['id']
    //       },
    //       {
    //         raw:true
    //     })
        
    //     const publicationsByTag = await Tag.getTags(  )
    //     const ids = publicationsByTag.map( pub => pub.id )
    //     publicationsIds = [...publicationsIds, ...ids]
    //   }

    //   options.where.id = { [Op.in]: publicationsIds  };
    // }
    
    const { tags } = query;
    if (tags) {
      let tagsIDs = tags.split(',')
      options.include.push({
        model: models.Tags.scope('filtered_tags'),
        as: 'filtered_tags',
        required: true,
        where: { id: tagsIDs },
        through: { attributes: [] }
      })
    }
    const { votes_count } = query;
    if( votes_count ){
      let  arrQuery = votes_count.split( ',' )
      if (!arrQuery.length > 0 && !arrQuery.length < 2) {
        const filterOp = arrQuery[0]
        const votes = arrQuery[1]
        const filters = [
          'gte',
          'lte',
          'lt',
          'gt',
          'eq',
        ]
        if( !filters.some( filter => filter == votes ) ) 
          throw new CustomError(`Operator ${filterOp} is not valid`, 400, 'Bad Request');
          
        options.where.votes_count = { [Op[filterOp]]: `%${votes}%` }
      };
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
    
    if (user_id) {
      options.include.push({
        model: models.Users.scope( 'same_vote' ),
        as: 'same_vote',
        through:{
          where: {user_id},
          attributes:[]
        }
      })
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

      let user = await newPublication.getSame_vote({where:{id:user_id}})
      await newPublication.addSame_vote(user_id, { transaction })

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

      let user = await publication.getSame_vote({where:{id:user_id}})
      let vote
      if (user[0]){
        vote = await publication.removeSame_vote(user_id, { transaction })
      } else{
        vote = await publication.addSame_vote(user_id, { transaction })
      }
      console.log({vote})
      await transaction.commit();
      return vote;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getPublication(id, user_id) {
    const filter = defaultFilter
    const options = {
      ...filter
    }

    if (user_id) {
      options.include.push({
        model: models.Users.scope( 'same_vote' ),
        as: 'same_vote',
        through:{
          where: {user_id},
          attributes:[]
        }
      })
    }

    const result = await models.Publications.findByPk(id, options);

    if (!result) {
      throw new CustomError('Publication not found', 404);
    }
    return result;
  }

  async findAndCountByVote( query ) {
    const {user_id} = query
    const filter = defaultFilter
    const options = {
      where:{},
      ...filter
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const user = await models.Users.findOne({where:{id:user_id}})

    const publicationsByUser = await user.getSame_vote(options);
    const PublicationsIds = publicationsByUser.map( publication => publication.id )
    options.where.id = PublicationsIds

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true;

    const publications = await models.Publications.findAndCountAll(options);
    return publications;
  }

  async findAndCountByUserId( query ) {
    const user_id = query.id
    const filter = defaultFilter
    console.log({user_id,filter})
    const options = {
      where: {user_id},
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
    console.log(publications)
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
