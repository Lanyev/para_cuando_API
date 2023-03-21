const PublicationsTypesService = require('../services/publicationsTypes.services');
const { getPagination, getPagingData } = require('../utils/helpers');

const publicationsTypesService = new PublicationsTypesService();

const getPublicationsTypes = async (request, response, next) => {
  try {
    let query = request.query;
    let { page, size } = query;
    const { limit, offset } = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;

    let publicationsTypes = await publicationsTypesService.findAndCount(query);
    const results = getPagingData(publicationsTypes, page, limit);
    return response.json({ results: results });
  } catch (error) {
    next(error);
  }
};

const getPublicationsTypesById = async (request, response, next) => {
  try {
    let { id } = request.params;
    let publicationsTypes = await publicationsTypesService.getPublicationsTypes(id);
    return response.json({ results: publicationsTypes });    
  } catch (error) {
    next(error);
  }
};

const getMyPublicationsTypes = async (request, response, next) => {
  try {
    let { id } = request.publicationsTypes.id;
    let publicationsTypes = await publicationsTypesService.getPublicationsTypes(id);
    return response.json({ results: publicationsTypes });
  } catch (error) {
    next(error);
  }
};

const putPublicationsTypes = async (request, response, next) => {
  try {
    let { id } = request.publicationsTypes.id;
    let { body } = request;
    let publicationsTypes = await publicationsTypesService.updatePublicationsTypes(id, body);
    return response.json({ results: publicationsTypes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicationsTypes,
  getPublicationsTypesById,
  getMyPublicationsTypes,
  putPublicationsTypes,
};
