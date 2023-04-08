const TagsService = require('../services/tags.services')
const { getPagination, getPagingData } = require('../utils/helpers')

const tagsService = new TagsService();

const getTags = async (request, response, next) => {
  try {
    let query = request.query
    let { page, size } = query
    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset

    let tags = await tagsService.findAndCount(query)
    const results = getPagingData(tags, page, limit)
    return response.json({ results: results })
  } catch (error) {
    next(error)
  }
}

const postTag = async ( request, response, next ) =>{
  try {
    const admin = request.admin

    if ( !admin ) 
      return response.status(403).json({ message: 'Unauthorized' })

    let { body } = request;
    let tag = await tagsService.createTags( body )
    return response.status(201).json({ results: tag })
  } catch (error) {
    next(error)
  }
}

const getTagById = async (request, response, next) => {
  try {
    let { id } = request.params
    let tag = await tagsService.getTag(id);
    return response.json({ results: tag });
  } catch (error) {
    next(error);
  }
};

const putTag = async (request, response, next) => {
  try {
    const admin = request.admin
    
    if ( !admin ) 
      return response.status(403).json({ message: 'Unauthorized' })

    let { id } = request.params;
    let { body } = request;
    let tag = await tagsService.updateTag(id, body);
    return response.json({ results: tag });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (request, response, next) => {
  try {
    const admin = request.admin

    if ( !admin ) 
      return response.status(403).json({ message: 'Unauthorized' })

    let { id } = request.params;
    let tag = await tagsService.removeTag( id );
    return response.json({ results:tag, message: 'removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTags,
  postTag,
  getTagById,
  putTag,
  deleteTag
};
