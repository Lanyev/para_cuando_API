'use strict';
const { Op } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'states',
        [
          {
            id: '1',
            country_id: '1',
            name: 'Aguascalientes',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '2',
            country_id: '2',
            name: 'Chihuahua',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '3',
            country_id: '3',
            name: 'Sinaloa',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '4',
            country_id: '4',
            name: 'Buenos Aires',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '5',
            country_id: '5',
            name: 'Mendoza',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '6',
            country_id: '6',
            name: 'Bolívar',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '7',
            country_id: '7',
            name: 'Córdoba',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '8',
            country_id: '8',
            name: 'San Luis',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '9',
            country_id: '9',
            name: 'Tucumán',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '10',
            country_id: '10',
            name: 'San Juan',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '11',
            country_id: '11',
            name: 'Santa Fe',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '12',
            country_id: '12',
            name: 'La Pampa',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('states', {
        name: {
          [Op.in]: [
            'Aguascalientes',
            'Chihuahua',
            'Sinaloa',
            'Buenos Aires',
            'Mendoza',
            'Bolívar',
            'Córdoba',
            'San Luis',
            'Tucumán',
            'San Juan',
            'Santa Fe',
            'La Pampa',
          ],
        },
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
