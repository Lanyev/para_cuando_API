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
    return response.json({ results });
  } catch (error) {
    next(error);
  }
};

const getPublicationById = async (request, response, next) => {
  try {
    let { id } = request.params;
    let publications = await publicationsService.getPublication(id);
    return response.json({ results: publications });
  } catch (error) {
    next(error);
  }
};

const getMyPublications = async (request, response, next) => {
  try {
    let { id } = request.params;
    let publications = await publicationsService.getPublications(id);
    return response.json({ results: publications });
  } catch (error) {
    next(error);
  }
};

const createPublications = async (request, response, next) => {
  try {
    const { id: user_id } = request.user;
    const { body } = request;
    let publications = await publicationsService.createPublications({
      ...body,
      user_id,
    });
    return response.status(201).json({ results: publications });
  } catch (error) {
    next(error);
  }
};

const createVote = async (request, response, next) => {
  try {
    const user_id = request.user.id;
    const publication_id = request.params.id
    let publications = await publicationsService.createVote({
      publication_id,
      user_id,
    });
    return response.status(201).json({ results: publications });
  } catch (error) {
    next(error);
  }
};

const getPublicationsByVote = async (request, response, next) => {
  try {
    const query = request.query;
    query.user_id = request.params.id
    const { page, size } = query;
    const { limit, offset } = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;

    let publications = await publicationsService.findAndCountByVote(query);
    const results = getPagingData(publications, page, limit);
    return response.json({ results });
  } catch (error) {
    next(error);
  }
}

const getPublicationsByUserId = async (request, response, next) => {
  try {
    let query = request.query;
    query.id = request.params.id
    let { page, size } = query;
    const { limit, offset } = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;

    let publications = await publicationsService.findAndCountByUserId(query);
    const results = getPagingData(publications, page, limit);
    return response.json({ results });
  } catch (error) {
    next(error);
  }
}

const putPublications = async (request, response, next) => {
  try {
    const { id } = request.publications;
    const { id: user_id } = request.user.id;
    const { body } = request;
    let publications = await publicationsService.updatePublications({
      id,
      body,
      user_id,
    });
    return response.json({ results: publications });
  } catch (error) {
    next(error);
  }
};

const deletePublications = async (request, response, next) => {
  try {
    const { id: publicationId } = request.params;
    const publication = await publicationsService.getPublication(
      publicationId
    );
    const { user_id } = publication;

    const admin = request.admin;
    const sameUser = request.isSameUser(user_id);
    console.log({ user_id, sameUser });

    if (!admin && !sameUser)
      return response.status(403).json({ message: 'Forbidden' });

    console.log({message:'Aqui andamos'})

    const publications = await publicationsService.deletePublications(
      publicationId
    );
    response.status(200).json({ results: publication });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublications,
  getPublicationById,
  getMyPublications,
  createPublications,
  createVote,
  getPublicationsByUserId,
  getPublicationsByVote,
  putPublications,
  deletePublications,
};
