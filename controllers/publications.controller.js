const PublicationsService = require('../services/publications.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const publicationsService = new PublicationsService();

const getPublications = async (request, response, next) => {
  try {
    let query = request.query;
    let { page, size } = query;
    const { limit, offset } = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;

    let publications = await publicationsService.findAndCount(query);
    const results = getPagingData(publications, page, limit);
    return response.json({ results: results });
  } catch (error) {
    next(error);
  }
};

const getPublicationsById = async (request, response, next) => {
  try {
    let { id } = request.params;
    let publications = await publicationsService.getPublications(id);
    return response.json({ results: publications });
  } catch (error) {
    next(error);
  }
};

const getMyPublications = async (request, response, next) => {
  try {
    let { id } = request.publications.id;
    let publications = await publicationsService.getPublications(id);
    return response.json({ results: publications });
  } catch (error) {
    next(error);
  }
};

const putPublications = async (request, response, next) => {
  try {
    let { id } = request.publications.id;
    let { body } = request;
    let publications = await publicationsService.updatePublications(id, body);
    return response.json({ results: publications });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublications,
  getPublicationsById,
  getMyPublications,
  putPublications,
};