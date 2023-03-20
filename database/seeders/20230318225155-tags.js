'use strict';
const { Op } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'tags',
        [
          {
            id: '1',
            name: 'ropa y accesorios',
            description: 'ropa y accesorios',
            image_url: 'https://example.png',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '2',
            name: 'deportes',
            description: 'deportes',
            image_url: 'https://example2.png',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '3',
            name: 'conciertos',
            description: 'conciertos',
            image_url: 'https://example3.png',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '4',
            name: 'meet & greet',
            description: 'meet & greet',
            image_url: 'https://example4.png',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '5',
            name: 'e-sport',
            description: 'e-sport',
            image_url: 'https://example5.png',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '6',
            name: 'pop/rock',
            description: 'pop/rock',
            image_url: 'https://example6.png',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '7',
            name: 'tecnologia',
            description: 'tecnologia',
            image_url: 'https://example7.png',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '8',
            name: 'hogar y decoracion',
            description: 'hogar y decoracion',
            image_url: 'https://example8.png',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '9',
            name: 'abastecimiento',
            description: 'abastecimiento',
            image_url: 'https://example9.png',
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
      await queryInterface.bulkDelete(
        'tags',
        {
          name: {
            [Op.or]: [
              'ropa y accesorios',
              'deportes',
              'conciertos',
              'meet & greet',
              'e-sport',
              'pop/rock',
              'tecnologia',
              'hogar y decoracion',
              'abastecimiento',
            ],
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
