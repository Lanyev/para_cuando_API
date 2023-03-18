'use strict';
const uuid = require('uuid');
const { Op } = require('sequelize');
const { hashPassword } = require('../../libs/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    const usersSeeds = [
      {
        id: uuid.v4(),
        first_name: 'Alan',
        last_name: 'Yeverino',
        email: 'alan@academlo.com',
        username: 'example@academlo.com',
        password: hashPassword('12345678910'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid.v4(),
        first_name: 'Julio',
        last_name: 'Sanchez',
        email: 'julio@academlo.com',
        username: 'example2@academlo.com',
        password: hashPassword('12345678910'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    try {
      await queryInterface.bulkInsert('users', usersSeeds, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    const userNames = ['example@academlo.com'];

    try {
      await queryInterface.bulkDelete(
        'users',
        {
          username: {
            [Op.or]: userNames,
          },
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
