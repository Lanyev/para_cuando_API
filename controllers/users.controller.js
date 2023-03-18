const usersService = require('../services/users.service');

const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.findAndCount(req.query);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getAuthUserOr404(req.params.id);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getMyUser = async (req, res, next) => {
  try {
    const user = await usersService.getAuthUserOr404(req.user.id);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getMyUser,
  updateUser,
};
