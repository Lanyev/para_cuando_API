const { v4: uuid4 } = require('uuid');
const models = require('../database/models');
const { Op } = require('sequelize');
const { CustomError } = require('../utils/helpers');
const { hashPassword } = require('../libs/bcrypt');

class UsersService {
  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { first_name } = query;
    if (first_name) {
      options.where.first_name = { [Op.iLike]: `%${first_name}%` };
    }

    const { last_name } = query;
    if (last_name) {
      options.where.last_name = { [Op.iLike]: `%${last_name}%` };
    }

    const { email } = query;
    if (email) {
      options.where.email = { [Op.iLike]: `%${email}%` };
    }

    const { username } = query;
    if (username) {
      options.where.username = { [Op.iLike]: `%${username}%` };
    }

    const { email_verified } = query;
    if (email_verified) {
      options.where.email_verified = { [Op.iLike]: `%${email_verified}%` };
    }

    const { country_id } = query;
    if (country_id) {
      options.where.country_id = { [Op.iLike]: `%${country_id}%` };
    }

    const { code_phone } = query;
    if (code_phone) {
      options.where.code_phone = { [Op.iLike]: `%${code_phone}%` };
    }

    const { phone } = query;
    if (phone) {
      options.where.phone = { [Op.iLike]: `%${phone}%` };
    }
    
    const { created_at } = query;
    if (created_at) {
      options.where.created_at = { [Op.iLike]: `%${created_at}%` };
    }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true;

    const users = await models.Users.scope('admin').findAndCountAll(
      options
    );
    return users;
  }

  async createAuthUser(obj) {
    const transaction = await models.sequelize.transaction();
    try {
      obj.id = uuid4();
      obj.password = hashPassword(obj.password);
      let newUser = await models.Users.create(obj, {
        transaction,
        fields: [
          'id',
          'first_name',
          'last_name',
          'password',
          'email',
          'username',
        ],
      });

      let publicRole = await models.Roles.findOne(
        { where: { name: 'public' } },
        { raw: true }
      );

      let newUserProfile = await models.Profiles.create(
        { user_id: newUser.id, role_id: publicRole.id },
        { transaction }
      );

      await transaction.commit();
      return newUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getAuthUserOr404(id, scope) {
    let user = await models.Users.scope(scope).findByPk(id, {
      raw: true,
    });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
  }

  async getUser(id, scope) {
      const user = await models.Users.scope(scope).findByPk(id, {
        include:[{
          model:models.Tags,
          as: 'interests',
          through: { attributes: [] }
        }]
      });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
  }

  async findUserByEmailOr404(email) {
    if (!email) throw new CustomError('Email not given', 400, 'Bad Request');
    let user = await models.Users.findOne({ where: { email } }, { raw: true });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
  }

  async updateUser(id, obj) {
    const {
      first_name, 
      last_name, 
      code_phone, 
      phone, 
      interests:tags
    } = obj
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findOne({ where:{ id } });
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      let updatedUser = await user.update({
        first_name,
        last_name,
        code_phone,
        phone
      }, { transaction });     

      if (tags){
        let arrayTags = tags.split(',')
        let findedTags = await models.Tags.findAll({
          where: { id: arrayTags },
          attributes: ['id'],
          raw: true,
        })
  
        if (findedTags.length > 0) {
          let tags_ids = findedTags.map(tag => tag['id'])
          await user.setInterests(tags_ids, { transaction })
        }
      }

      user = await models.Users.findOne({ 
        where:{ id } ,
        include:[{
          model:models.Tags,
          as: 'interests',
          through: { attributes: [] }
        }]
      });

      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeUser(id) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      await user.destroy({ transaction });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async setTokenUser(id, token) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      let updatedUser = await user.update({ token }, { transaction });
      await transaction.commit();
      return updatedUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeTokenUser(id) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      await user.update({ token: null }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async verifiedTokenUser(id, token, exp) {
    const transaction = await models.sequelize.transaction();
    try {
      if (!id) throw new CustomError('Not ID provided', 400, 'Bad Request');
      if (!token)
        throw new CustomError('Not token provided', 400, 'Bad Request');
      if (!exp) throw new CustomError('Not exp exist', 400, 'Bad Request');

      let user = await models.Users.findOne({
        where: {
          id,
          token,
        },
      });
      if (!user)
        throw new CustomError(
          'The user associated with the token was not found',
          400,
          'Invalid Token'
        );
      if (Date.now() > exp * 1000)
        throw new CustomError(
          'The token has expired, the 15min limit has been exceeded',
          401,
          'Unauthorized'
        );
      await user.update({ token: null }, { transaction });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updatePassword(id, newPassword) {
    const transaction = await models.sequelize.transaction();
    try {
      if (!id) throw new CustomError('Not ID provided', 400, 'Bad Request');
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      let restoreUser = await user.update(
        { password: hashPassword(newPassword) },
        { transaction }
      );
      await transaction.commit();
      return restoreUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async createUserImage(id, image_url) {
    const transaction = await models.sequelize.transaction()
    try {  
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      let newImage = await user.update({ 
        image_url }, 
      { transaction })
      await transaction.commit();
      return newImage
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeUserImage(id) {{
    const transaction = await models.sequelize.transaction()
    try {  
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      let newImage = await user.update({ 
        image_url:null }, 
      { transaction })
      await transaction.commit();
      return newImage
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  }
}

module.exports = UsersService;
