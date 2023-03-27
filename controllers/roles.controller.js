// const RolesService = require('../services/countries.service')
const RolesService = require('../services/roles.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const rolesService = new RolesService();

const getAllRoles = async (request, response, next) => {
  try {
    let query = request.query;
    let { page, size } = query;
    const { limit, offset } = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;

    const roles = await rolesService.findAndCount(query);
    const results = getPagingData(roles, page, limit);
    return response.json({ results: results });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoles,
};
