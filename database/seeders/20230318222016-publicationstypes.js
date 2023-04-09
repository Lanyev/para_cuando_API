'use strict';
const { Op } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'publication_types',
        [
          {
            id: '1',
            name: 'marcas y tiendas',
            description: 'marcas y tiendas',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '2',
            name: 'artistas y conciertos',
            description: 'artistas y conciertos',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '3',
            name: 'torneos',
            description: 'torneos',
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
        'publication_types',
        {
          name: {
            [Op.or]: ['marcas y tiendas', 'artistas y conciertos', 'torneos'],
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
