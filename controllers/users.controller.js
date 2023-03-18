const UsersService = require('../services/users.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const UserService = new UsersService();

const getUsers = async (request, response, next) => {
  try {
    let query = request.query;
    let { page, size } = query;
    const { limit, offset } = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;

    let users = await UserService.findAndCount(query);
    const results = getPagingData(users, page, limit);
    return response.json({ results: results });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (request, response, next) => {
  try {
    let { id } = request.params;
    let userId = request.user.id;
    if (userId === id) {
      // Crear funciones de servicio para obtener los datos del usuario
      let user = await UserService.getUser(id);
      return response.json({ results: user });
    } else {
      return response.status(401).json({ message: 'Unauthorized' });
      
    }
  } catch (error) {
    next(error);
  }
};

const getMyUser = async (request, response, next) => {
  try {
    let { id } = request.user.id;
    let { first_name, last_name, image_url, email, username, phone } =
      request.body;
    let user = await UserService.getUser(id, {
      first_name,
      last_name,
      image_url,
      email,
      username,
      phone,
    });
    return response.json({ results: user });
  } catch (error) {
    next(error);
  }
};

const patchUser = async (request, response, next) => {
  try {
    let { id } = request.user.id;
    let { first_name, last_name, country_id, code_phone, phone } = request.body;
    let user = await UserService.updateUser(id, {
      first_name,
      last_name,
      country_id,
      code_phone,
      phone,
    });
    return response.json({ results: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getMyUser,
  patchUser,
};
